import { render, screen } from '@testing-library/react'
import Blog from './Blog'
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

test('form calls the event handler and new blog is created', async () => {
  const mockHandler = vi.fn()

  render(<BlogForm handleBlogCreation={mockHandler} />)

  const user = userEvent.setup()

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')

  await user.type(titleInput, blog.title)
  await user.type(authorInput, blog.author)
  await user.type(urlInput, blog.url)

  const submitButton = screen.getByText('create')
  await user.click(submitButton)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0]).toEqual({
    title: blog.title,
    author: blog.author,
    url: blog.url
  })
})


