const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

const testUser = {
  name: 'vostok',
  username: 'nest',
  password: '123'
}

const wrongUser = {
  username: 'wrong-username',
  name: 'wrong-name',
  password: 'wrong-password'
}

const users = [
  {
    name: 'mem',
    username: 'nomer',
    password: '123'
  }
]

const validBlog = {
  title: 'Victory',
  author: 'Me',
  url: 'localhost'
}

const blogs = [
  {
    title: 'Monster',
    author: 'Frankenstein',
    url: 'nen'
  },
  {
    title: 'Kakto',
    author: 'Fritzer',
    url: 'nowhere'
  }
]

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', { data: testUser })
    await request.post('/api/users', { data: users[0] })


    await page.goto('/')
  })

  test('Login form is show', async ({ page }) => {
    const locator = await page.getByText('Log in to application')

    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, testUser.username, testUser.password)

      await expect(page.getByText(`${testUser.name} logged in successfully`)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, wrongUser.username, wrongUser.password)

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, testUser.username, testUser.password)
    })

    describe('Blog interaction', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, validBlog)
      })

      test('a new blog can be created', async({ page }) => {
        await expect(page.getByText(validBlog.title).first()).toBeVisible()
        await expect(page.getByText(validBlog.author).first()).toBeVisible()
      })

      test('a created blog can be liked', async({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()

        await expect(page.getByText('likes 0')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a created blog can be deleted', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()

        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'delete' }).click()
      })

      test(`another user cannot see blog's deletion button`, async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, users[0].username, users[0].password)

        await page.getByRole('button', { name: 'view' }).click()
        await expect(await page.getByRole('button', { name: 'delete' })).not.toBeVisible()
      })

      test('blogs are sorted by likes', async ({ page }) => {
      })
    })
  })
})
