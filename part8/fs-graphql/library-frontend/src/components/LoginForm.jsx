import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'

const LoginForm = ({ setPage, setToken, setError, show }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login ] = useMutation(LOGIN, {
    skip: !show,
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-backend-token', token)
    },
    onError: (error) => {
      setError(`login failed: ${error.message}`)
    }
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    const result = await login({ variables: { username, password } })

    if (!result.data) {
      return
    }

    setUsername('')
    setPassword('')
    setPage('authors')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label>
            username <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password <input
              type='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
