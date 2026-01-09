import Blog from './Blog'

const BlogList = ({ user, blogs, handleLike, handleDeletion }) => {
  blogs.sort((a, b) => {
    if (a.likes > b.likes) {
      return -1
    } else {
      return 1
    }
  })

  return (
    <div>
      {blogs.map(blog => {
        return (
          <Blog
            key={blog.id }
            user={user}
            blog={blog}
            handleLike={handleLike}
            handleDeletion={handleDeletion}
          />
        )
      })}
    </div>
  )
}

export default BlogList
