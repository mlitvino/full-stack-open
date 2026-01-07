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

test('renders title and author but not url or likes by default', () => {
  const { container } = render(<Blog blog={blog} handleLike={() => {}} handleDeletion={() => {}} />)

  const titleAuthorSpan = container.querySelector('.blog-title-author')
  expect(titleAuthorSpan).toBeDefined()
  expect(titleAuthorSpan).toHaveTextContent('Testing React Components')
  expect(titleAuthorSpan).toHaveTextContent('Test Author')

  const urlSpan = container.querySelector('.blog-url')
  expect(urlSpan).not.toBeVisible()

  const likesSpan = container.querySelector('.blog-likes')
  expect(likesSpan).not.toBeVisible()
})

test('render url and likes after clicking button', async () => {
  const { container } = render(<Blog blog={blog} handleLike={() => {}} handleDeletion={() => {}} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const urlSpan = container.querySelector('.blog-url')
  expect(urlSpan).toBeDefined()
  expect(urlSpan).toHaveTextContent(blog.url)

  const likesSpan = container.querySelector('.blog-likes')
  expect(likesSpan).toBeDefined()
  expect(likesSpan).toHaveTextContent('likes ' + blog.likes)
})

test('double clicking likes causes calling of event handler twice', async () => {
  const mockLikesHandler = vi.fn()

  render(
    <Blog blog={blog} handleLike={mockLikesHandler} handleDeletion={() => {}} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  expect(likeButton).toBeDefined()

  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockLikesHandler.mock.calls).toHaveLength(2)
})
