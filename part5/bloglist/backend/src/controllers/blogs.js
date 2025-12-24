const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.delete('/all', async (request, response) => {
  await Blog.deleteMany({})
  response.status(204).end()
})

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('creator', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or invalid' })
  } else if (!body.url || !body.title) {
    return response.status(400).json({ error: 'url or title is missing' })
  }

  if (!body.likes)
    body.likes = 0

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    creator: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = (user.blogs ?? []).concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const idToDelete = request.params.id
  const user = request.user

  const blog = await Blog.findById(idToDelete)
  if (!blog) {
    return response.status(400).json({ error: 'blogId missing or invalid' })
  }

  if (user.id.toString() !== blog.creator.toString()) {
    return response.status(401).json({ error: 'only creator can delete blog' })
  }

  await Blog.findByIdAndDelete(idToDelete)
  await User.findByIdAndUpdate(
    user._id,
    { $pull: { blogs: idToDelete } }
  )

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
