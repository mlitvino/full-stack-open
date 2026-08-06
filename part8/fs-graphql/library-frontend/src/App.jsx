import { useState } from 'react'
import { useApolloClient } from '@apollo/client/react'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommend'
import Notify from './components/Notify'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-backend-token'))
  const [errorMessage, setErrorMessage] = useState('')
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  const onLogout = () => {
    setToken(null)
    setPage('authors')
    localStorage.removeItem('library-backend-token')
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        { token
          ? (
            <>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={() => setPage('recommend')}>recommend</button>
              <button onClick={onLogout}>logout</button>
            </>
          )
          : <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Notify errorMessage={errorMessage} />

      <Authors
        show={page === 'authors'}
        token={token}
      />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommended show={page === 'recommend'}/>

      <LoginForm
        setPage={setPage}
        setToken={setToken}
        setError={notify}
        show={page === 'login'}
      />
    </div>
  )
}

export default App
