import { Card, CardContent, Typography, Button, Stack, Link as MuiLink } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import DeleteIcon from '@mui/icons-material/Delete'

const Blog = ({ user, blog, handleLike, handleDeletion }) => {
  return (
    <Card variant="outlined" className="blog" data-testid="blog" sx={{ maxWidth: 480, mt: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" className="blog-title-author" gutterBottom>
          {blog.title} {blog.author}
        </Typography>

        <MuiLink
          className="blog-url"
          href={blog.url}
          target="_blank"
          rel="noreferrer"
          sx={{ display: 'block', mb: 1 }}
        >
          {blog.url}
        </MuiLink>

        <Typography className="blog-likes" sx={{ mb: 1 }}>
          likes {blog.likes}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          added by {blog.creator?.name || 'Unknown'}
        </Typography>

        <Stack direction="row" spacing={1}>
          {user && (
            <Button
              variant="contained"
              size="small"
              startIcon={<ThumbUpIcon />}
              onClick={() => handleLike(blog)}
            >
              like
            </Button>
          )}
          {user && user.name === blog.creator?.name && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => handleDeletion(blog)}
            >
              delete
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Blog
