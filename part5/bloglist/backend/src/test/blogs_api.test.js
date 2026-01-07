const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)
let token = ''
let tokenHeader = {}

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  const user = helper.initialUsers[0]

  const passwordHash = await bcrypt.hash(user.password, 10)
  const userToSave = new User({
    username: user.username,
    name: user.name,
    passwordHash
  })
  await userToSave.save()

  const response = await api
    .post('/api/login')
    .send(user)
    .expect(200)

  token = response.body.token
  tokenHeader = { 'Authorization': `Bearer ${token}` }
})

describe('get method', () => {
  test('all blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blog contains property id, not _id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blog = response.body[0]
    assert(Object.hasOwn(blog, 'id') && !Object.hasOwn(blog, '_id'))
  })
})

describe('post method', () => {
  test.only('a valid blog post can be added', async () => {
    const newBlog = {
      title: 'goto is bad',
      author: 'Me',
      url: 'localhost',
      likes: 100,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(tokenHeader)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    const blogToFind = blogs.find(b =>
      b.title === newBlog.title &&
      b.author === newBlog.author &&
      b.url === newBlog.url &&
      b.likes === newBlog.likes
    )
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
    assert.ok(blogToFind)
  })

  test('add likes 0, if property likes is missing', async () => {
    const newBlog = helper.listWithOneBlog[0]
    delete newBlog.likes

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(tokenHeader)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    const toFind = blogs.find(b =>
      b.title === newBlog.title &&
      b.author === newBlog.author &&
      b.url === newBlog.url
    )
    assert.strictEqual(toFind.likes, 0)
  })

  describe('delete method', () => {
    test('succeeds with deletion of valid blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const userAtStart = (await helper.usersInDb())[0]
      const newBlog = { ...blogsAtStart[0], creator: userAtStart.id }

      await Blog.findByIdAndUpdate(newBlog.id, newBlog)

      await api
        .delete(`/api/blogs/${newBlog.id}`)
        .set(tokenHeader)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const contents = blogsAtEnd.map(b => b.id)
      assert(!contents.includes(newBlog.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  test('deny blogs with missing property url or title', async () => {
    const newBlog = helper.listWithOneBlog[0]
    delete newBlog.url
    delete newBlog.title

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(tokenHeader)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  describe('put method', () => {
    test('update likes for valid blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const blogToSend = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToSend)
        .set(tokenHeader)
        .expect(200)

      assert.deepStrictEqual(response.body.likes, blogToSend.likes)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})


