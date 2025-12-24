const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const helper = require('./test_helper')

const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  for (let user of helper.initialUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const userToSave = new User({
      username: user.username,
      name: user.name,
      passwordHash
    })

    await userToSave.save()
  }
})

describe('get method', () => {
  test('all users are returned', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })
})

describe('post method', () => {
  test('create valid user', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'gama',
      name: 'Bjorn',
      password: 'shs'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('deny user with invalid password', async () => {
    const usersAtStart = await helper.usersInDb()

    const invalidUser = {
      username: 'valid',
      name: 'valid',
      password: 'i'
    }

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('deny user with invalid username', async () => {
    const usersAtStart = await helper.usersInDb()

    const invalidUser = {
      username: 'i',
      name: 'valid',
      password: 'valid'
    }

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('deny user with duplicated username', async () => {
    const usersAtStart = await helper.usersInDb()
    const duplicatedUser = usersAtStart[0]

    await api
      .post('/api/users')
      .send(duplicatedUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
