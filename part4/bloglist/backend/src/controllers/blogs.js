const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  if (!blog.likes)
    blog.likes = 0

  if (!blog.url || !blog.title) {
    return response.status(400).json({ error: 'url or title is missing' })
  }

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const newBlog = { ...body }

  if (!newBlog.likes)
    newBlog.likes = 0

  if (!newBlog.url || !newBlog.title) {
    return response.status(400).json({ error: 'url or title is missing' })
  }

  const storedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    newBlog,
    { new: true, runValidators: true }
  )

  if (!storedBlog) {
    return response.status(404).end()
  }

  response.json(storedBlog)
})

module.exports = blogsRouter
