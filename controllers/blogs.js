const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const _ = require('lodash')
const { userExtractor } = require('../utils/middleware')


router.get('/', async (request, response) => {
  await Blog.find().sort({createdAt: 1});
  const blogs = await Blog.find({}).populate('user', { username: true, name: true }).sort({likes: -1})

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

router.post('/', userExtractor, async (request, response) => {
  const user = request.user
  // console.log('user: ', request.user)

  const blog = new Blog({
    ...request.body,
    user: user._id
  })

  const newBlog = await blog.save()
  user.blogs = user.blogs.concat(newBlog._id)
  const result = await newBlog.populate('user')
  await user.save()
  response.status(201).json(result)
})

router.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
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

router.put('/:id', userExtractor, async (request, response) => {
  // const user = request.user
  const newBlog = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    throw new Error("the blog does not exist")
  }
  const result = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true, runValidators: true }).populate('user')
  response.status(200).json(result)
})

router.post('/:id/comments', userExtractor, async (request, response) => {
  const comment = request.body.comment

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    throw new Error("the blog does not exist")
  }
  blog.comments.push(comment)
  const result = await (await blog.save()).populate('user')
  response.status(200).json(result)
})

module.exports = router