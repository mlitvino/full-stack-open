const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, openBlog } = require('./helper')

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

const validBlog = {
  title: 'Victory',
  author: 'Me',
  url: 'localhost'
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', { data: testUser })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
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

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, validBlog)

      await expect(page.getByRole('link', { name: `${validBlog.title} ${validBlog.author}` })).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, validBlog)
      })

      test('a blog can be liked', async ({ page }) => {
        await openBlog(page, validBlog)

        await expect(page.getByText('likes 0')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a blog can be deleted', async ({ page }) => {
        await openBlog(page, validBlog)

        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'delete' }).click()

        await expect(page.getByRole('link', { name: `${validBlog.title} ${validBlog.author}` })).not.toBeVisible()
      })
    })
  })
})
