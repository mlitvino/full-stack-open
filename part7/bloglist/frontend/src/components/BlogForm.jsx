import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

import useField from '../hooks/useField'
import { useBlogsActions } from '../stores/blogsStore'
import { useNotificationActions } from '../stores/notificationStore'

const BlogForm = () => {
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetUrl, ...url } = useField('text')
  const { add } = useBlogsActions()
  const { setNotification, setError } = useNotificationActions()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value
    }

    try {
      await add(newBlog)
      resetTitle()
      resetAuthor()
      resetUrl()
      navigate('/')

      setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    } catch {
      setError('failed to add new blog')
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField margin="normal" label="title" {...title} />
        </div>
        <div>
          <TextField margin="normal" label="author" {...author} />
        </div>
        <div>
          <TextField margin="normal" label="url" {...url} />
        </div>
        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            create
          </Button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm
