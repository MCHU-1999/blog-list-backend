const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')

const app = require('../app')
const api = supertest(app)

const { listWithOneBlog, listWithManyBlogs, blogsInDb } = require('./test_helper')


beforeEach(async () => {
  
  await Blog.deleteMany({})
  const blogObjects = listWithManyBlogs.map(blog => new Blog(blog))
  await Promise.all(blogObjects.map(element => element.save()))

  console.log('beforeEach() done')
})

describe('blog tests', () => {
  after(async () => {
    console.log('after() done');
    await mongoose.connection.close()
  })

  test('blogs are returned as json', async () => {

    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('all blogs are returned', async () => {
  
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, listWithManyBlogs.length)
  })

  test('index key is named "id" not "_id"', async () => {
    const response = await api.get('/api/blogs')

    const reduced = response.body.reduce((acc, value) => {
      if (value.id) {
        return acc + 1
      } else {
        return acc
      }
    }, 0)
    // console.log(reduced)
    assert.strictEqual(reduced, listWithManyBlogs.length)
  })

  test('a valid blog can be added', async () => {
  
    const newBlog = {
      title: "new blog",
      author: "MCHU",
      url: "http://localhost:3003",
      likes: 18,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await blogsInDb()
    assert.strictEqual(blogs.length, listWithManyBlogs.length + 1)

    const titles = blogs.map(n => n.title)
    assert(titles.includes('new blog'))
  })

  test('if the "likes" property is missing, set it to 0', async () => {
  
    const newBlog = {
      title: "new blog",
      author: "MCHU",
      url: "http://localhost:3003",
      likes: undefined,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blog = await Blog.findOne({ title: "new blog" })
    // console.log(blog.toJSON())
    assert.strictEqual(blog.toJSON().likes, 0)
  })

  test('blogs without title of url cannot be added', async () => {
    const newBlogWothoutTitle = {
      author: "MCHU",
      url: "http://localhost:3003",
      likes: 18,
    }  
    await api
      .post('/api/blogs')
      .send(newBlogWothoutTitle)
      .expect(400)

    const newBlogWothoutUrl = {
      title: "new blog",
      author: "MCHU",
      likes: 18,
    }
    await api
      .post('/api/blogs')
      .send(newBlogWothoutUrl)
      .expect(400)

    const allBlogs = await blogsInDb()
    assert.strictEqual(allBlogs.length, listWithManyBlogs.length)
  })

  test('delete a blog with id', async () => {
    const allBlogs = await blogsInDb()
    const firstBlog = allBlogs[0]
    await api
      .delete(`/api/blogs/${firstBlog.id}`)
      .expect(204)

    const allBlogsAfter = await blogsInDb()

    assert.strictEqual(allBlogs.length, allBlogsAfter.length +1)
    assert(!allBlogsAfter.map(e => e.id).includes(firstBlog.id))
  })
})



