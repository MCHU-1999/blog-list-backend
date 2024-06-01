const { test, describe, beforeEach, after, before } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const app = require('../app')
const api = supertest(app)

const { listWithOneBlog, listWithManyBlogs, blogsInDb } = require('./test_helper');


describe('blog tests', () => {

  before(async () => {
    console.log("before() done")
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('test1', 10)
    const user = new User({ username: 'testaccount1', name: 'testaccount1', passwordHash })
    await user.save()

    const userForToken = {
      username: user.username,
      id: user._id,
    }
    this.user = user
    this.token = jwt.sign(
      userForToken, 
      process.env.SECRET,
      { expiresIn: 60*60 }
    )
    console.log("token: ", this.token)
    
  })

  beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = listWithManyBlogs.map(blog => new Blog({ ...blog, user: this.user._id }))
    await Promise.all(blogObjects.map(element => element.save()))

    // console.log('beforeEach() done')
  })

  after(async () => {
    await mongoose.connection.close()
    console.log('after() done');
  })

  describe('External Functions', () => {
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
  })

  describe('Internal Functions', () => {

    test(' adding a blog without token fails with 401 Unauthorized', async () => {
      const newBlog = {
        title: "whatever",
        author: "MCHU",
        url: "http://localhost:3003",
        likes: 18,
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

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
        .auth(this.token, { type: "bearer" })
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
        .auth(this.token, { type: "bearer" })
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
        .auth(this.token, { type: "bearer" })
        .send(newBlogWothoutTitle)
        .expect(400)
  
      const newBlogWothoutUrl = {
        title: "new blog",
        author: "MCHU",
        likes: 18,
      }
      await api
        .post('/api/blogs')
        .auth(this.token, { type: "bearer" })
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
        .auth(this.token, { type: "bearer" })
        .expect(204)
  
      const allBlogsAfter = await blogsInDb()
  
      assert.strictEqual(allBlogs.length, allBlogsAfter.length +1)
      assert(!allBlogsAfter.map(e => e.id).includes(firstBlog.id))
    })
  
    test('update a blog with id', async () => {
      const allBlogs = await blogsInDb()
      let firstBlog = allBlogs[0]
      firstBlog.likes = 1000
      await api
        .put(`/api/blogs/${firstBlog.id}`)
        .auth(this.token, { type: "bearer" })
        .send(firstBlog)
        .expect(200)
  
      const allBlogsAfter = await blogsInDb()
  
      assert.strictEqual(allBlogs.length, allBlogsAfter.length)
      assert.strictEqual(allBlogsAfter[0].likes, 1000)
    })


  })
})



