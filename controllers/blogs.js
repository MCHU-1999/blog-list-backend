const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const _ = require('lodash')


router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: true, name: true })

  response.json(blogs)
})

router.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user')
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

router.post('/', async (request, response) => {
  const user = request.user

  const blog = new Blog({
    ...request.body,
    user: user._id
  })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  response.status(201).json(result)
})

router.delete('/:id', async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  // console.log(blog)
  if (!blog) {
    throw new Error("the blog does not exist")
  }

  if (blog.user.toString() === user._id.toString()) {
    const result = await blog.deleteOne()
    user.blogs = _.remove(user.blogs, (n) => n.toString() !== request.params.id) 
    await user.save()
    // console.log(user.blogs)
    response.status(204).end()
  } else {
    throw { name : "UnauthorizedError", message : "only the creator can delete the blog" }
  }
})

router.put('/:id', async (request, response) => {
  const newBlog = request.body
  const result = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true, runValidators: true })
  response.status(200).json(result)
})

module.exports = router