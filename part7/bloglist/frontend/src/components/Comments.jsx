import { Typography, TextField, Button } from '@mui/material'

import useField from '../hooks/useField'
import { useBlogsActions } from '../stores/blogsStore'
import { useNotificationActions } from '../stores/notificationStore'

const Comments = ({ blog }) => {
  const { reset: resetComment, ...comment } = useField('text')
  const { addComment } = useBlogsActions()
  const { setError } = useNotificationActions()

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await addComment(blog.id, comment.value)
      resetComment()
    } catch {
      setError('failed to add comment')
    }
  }

  return (
    <div>
      <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
        comments
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField margin="normal" size="small" label="comment" {...comment} />
        <Button type="submit" variant="contained" sx={{ ml: 1, mt: 2 }}>
          add comment
        </Button>
      </form>

      <ul>
        {(blog.comments ?? []).map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default Comments
