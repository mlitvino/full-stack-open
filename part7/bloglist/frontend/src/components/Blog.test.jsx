import { render, screen } from '@testing-library/react'
import Blog from './Blog'
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

test('blog information and likes are shown to unauthenticated users, buttons are not displayed', () => {
  render(<Blog blog={blog} handleLike={() => {}} handleDeletion={() => {}} />)

  expect(screen.getByText('Testing React Components', { exact: false })).toBeDefined()
  expect(screen.getByText('Test Author', { exact: false })).toBeDefined()
  expect(screen.getByText(blog.url)).toBeDefined()
  expect(screen.getByText('likes 5', { exact: false })).toBeDefined()

  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('delete')).toBeNull()
})

test('authenticated users who are not the creator are shown only the like button', () => {
  const otherUser = { name: 'Someone Else' }

  render(<Blog blog={blog} user={otherUser} handleLike={() => {}} handleDeletion={() => {}} />)

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('delete')).toBeNull()
})

test('the creator is also shown the delete button', async () => {
  const creator = { name: 'Test Creator' }
  const mockLikesHandler = vi.fn()

  render(<Blog blog={blog} user={creator} handleLike={mockLikesHandler} handleDeletion={() => {}} />)

  expect(screen.getByText('delete')).toBeDefined()

  const user = userEvent.setup()
  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockLikesHandler.mock.calls).toHaveLength(2)
})
