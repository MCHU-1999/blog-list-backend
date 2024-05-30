const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')

const app = require('../app')
const api = supertest(app)

const { listWithOneBlog, listWithManyBlogs } = require('./test_helper')


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
})



