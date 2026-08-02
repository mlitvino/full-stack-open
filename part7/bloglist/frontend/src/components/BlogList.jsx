import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <ul>
        {sortedBlogs.map(blog => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogList
