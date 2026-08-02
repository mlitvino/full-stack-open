import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ handleBlogCreation }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
    }
    handleBlogCreation(newBlog)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            margin="normal"
            label="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            margin="normal"
            label="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            margin="normal"
            label="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
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
