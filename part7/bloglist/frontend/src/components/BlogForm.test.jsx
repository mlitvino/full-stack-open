import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BlogForm from './BlogForm'
import { expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

const blog = {
  title: 'Testing React Components',
  author: 'Test Author',
  url: 'http://example.com',
  likes: 5,
  creator: {
    name: 'Test Creator'
  }
}

const mockAdd = vi.fn()

vi.mock('../stores/blogsStore', () => ({
  useBlogsActions: () => ({ add: mockAdd })
}))

vi.mock('../stores/notificationStore', () => ({
  useNotificationActions: () => ({ setNotification: vi.fn(), setError: vi.fn() })
}))

test('form calls add and a new blog is created', async () => {
  render(
    <MemoryRouter>
      <BlogForm />
    </MemoryRouter>
  )

  const user = userEvent.setup()

  const titleInput = screen.getByLabelText('title')
  const authorInput = screen.getByLabelText('author')
  const urlInput = screen.getByLabelText('url')

  await user.type(titleInput, blog.title)
  await user.type(authorInput, blog.author)
  await user.type(urlInput, blog.url)

  const submitButton = screen.getByText('create')
  await user.click(submitButton)

  expect(mockAdd.mock.calls).toHaveLength(1)
  expect(mockAdd.mock.calls[0][0]).toEqual({
    title: blog.title,
    author: blog.author,
    url: blog.url
  })
})
