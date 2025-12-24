import Blog from './Blog'

const BlogList = ({ blogs, user }) => {

  return (
    <div>
      <h2>blogs</h2>
        <p>{user.name} logged in</p>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
    </div>
  )
}

export default BlogList
