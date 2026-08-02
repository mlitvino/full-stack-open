import { useParams } from 'react-router-dom'

import Blog from './Blog'

const BlogView = ({ blogs, user, handleLike, handleDeletion }) => {
  const { id } = useParams()
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return null
  }

  return (
    <Blog
      user={user}
      blog={blog}
      handleLike={handleLike}
      handleDeletion={handleDeletion}
    />
  )
}

export default BlogView
