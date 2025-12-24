import { useState, useEffect } from 'react'

import blogService from './services/blogs'

import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  return (
    <div>
      { !user && (<LoginForm setUser={setUser}/>) }
      { user && (<BlogList blogs={blogs} user={user}/>) }
    </div>
  )
}

export default App
