import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

import { useNotificationActions } from '../stores/notificationStore'
import { useUserActions } from '../stores/userStore'
import useField from '../hooks/useField'

const LoginForm = () => {
  const { login } = useUserActions()
  const { setNotification, setError } = useNotificationActions()
  const { reset: resetUsername, ...username } = useField('text')
  const { reset: resetPassword, ...password } = useField('password')
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedInUser = await login(username.value, password.value)
      resetUsername()
      resetPassword()
      navigate('/')

      setNotification(`${loggedInUser.name} logged in successfully`)
    } catch {
      setError('wrong username or password')
    }
  }

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <TextField margin="normal" label="username" {...username} />
        </div>
        <div>
          <TextField margin="normal" label="password" {...password} />
        </div>
        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
