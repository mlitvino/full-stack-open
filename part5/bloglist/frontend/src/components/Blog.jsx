import Togglable from './Togglable'

const Blog = ({ blog, handleLike, handleDeletion }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className="blog">
      <span className="blog-title-author">
        {blog.title} {blog.author}
      </span>
      <Togglable buttonLabel="view" cancelButtonLabel="hide" buttonBefore={true}>
        <span className="blog-url">{blog.url}</span> <br/>
        <span className="blog-likes">likes {blog.likes}</span>
        <button onClick={() => handleLike(blog)}>like</button> <br/>
        <span>{blog.creator?.name || 'Unknown'}</span> <br/>
        <button onClick={() => handleDeletion(blog)}>delete</button>
      </Togglable>
    </div>
  )
}

export default Blog
