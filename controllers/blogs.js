const router = require('express').Router()
const Blog = require('../models/blog')


router.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

router.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

router.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const result = await blog.save()
  response.status(201).json(result)
})

router.delete('/:id', async (request, response) => {
  const result = await Blog.findByIdAndDelete(request.params.id,)
  response.status(204).end()
})

router.put('/:id', async (request, response) => {
  const newBlog = request.body
  const result = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true, runValidators: true })
  response.status(200).json(result)
})

module.exports = router