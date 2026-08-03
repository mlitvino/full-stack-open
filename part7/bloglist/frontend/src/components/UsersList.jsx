import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material'

import { useUsers, useUsersActions } from '../stores/usersStore'

const UsersList = () => {
  const users = useUsers()
  const { initialize } = useUsersActions()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div>
      <Typography variant="h5" component="h2" sx={{ mt: 2, mb: 2 }}>
        Users
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>username</TableCell>
              <TableCell>name</TableCell>
              <TableCell align="right">blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell align="right">{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default UsersList
