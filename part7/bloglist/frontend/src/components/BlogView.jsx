import { useParams, useNavigate } from 'react-router-dom'

import Blog from './Blog'
import Comments from './Comments'
import { useBlogs, useBlogsActions } from '../stores/blogsStore'
import { useUser } from '../stores/userStore'
import { useNotificationActions } from '../stores/notificationStore'

const BlogView = () => {
  const { id } = useParams()
  const blogs = useBlogs()
  const user = useUser()
  const { like, remove } = useBlogsActions()
  const { setError } = useNotificationActions()
  const navigate = useNavigate()

  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return null
  }

  const handleLike = async (blog) => {
    await like(blog.id)
  }

  const handleDeletion = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title}`)) {
      return
    }
    try {
      await remove(blog.id)
      navigate('/')
    } catch {
      setError('failed to delete blog')
    }
  }

  return (
    <div>
      <Blog user={user} blog={blog} handleLike={handleLike} handleDeletion={handleDeletion} />
      <Comments blog={blog} />
    </div>
  )
}

export default BlogView
