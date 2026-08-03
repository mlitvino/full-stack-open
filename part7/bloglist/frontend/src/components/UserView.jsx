import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Typography } from '@mui/material'

import { useUsers, useUsersActions } from '../stores/usersStore'

const UserView = () => {
  const { id } = useParams()
  const users = useUsers()
  const { initialize } = useUsersActions()

  useEffect(() => {
    initialize()
  }, [initialize])

  const user = users.find((u) => u.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <Typography variant="h5" component="h2" sx={{ mt: 2, mb: 2 }}>
        {user.name}
      </Typography>

      <Typography variant="h6" component="h3">
        added blogs
      </Typography>

      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserView
