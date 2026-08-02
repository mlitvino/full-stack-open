import { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Button } from '@mui/material'

import blogService from './services/blogs'

import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import BlogForm from './components/BlogForm'
import Header from './components/Header'
import Notification from './components/Notification'
import Error from './components/Error'

const navButtonStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  if (!blogs) {
    return null
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
    blogService.setToken(null)
    navigate('/')
  }

  const handleLike = async (blog) => {
    const updated = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
    setBlogs(blogs.map(b => b.id !== blog.id ? b : updated))
  }

  const handleDeletion = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title}`)) {
      return
    }
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      navigate('/')
    } catch {
      setErrorMessage('failed to delete blog')
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }
  }

  const handleBlogCreation = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(createdBlog))
      navigate('/')

      setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setMessage('')
      }, 3000)
    } catch {
      setErrorMessage('failed to add new blog')
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={navButtonStyle}>
            blogs
          </Button>
          { user &&
            <Button color="inherit" component={Link} to="/create" sx={navButtonStyle}>
              new blog
            </Button>
          }
          { !user &&
            <Button color="inherit" component={Link} to="/login" sx={navButtonStyle}>
              login
            </Button>
          }
          { user &&
            <Button color="inherit" onClick={handleLogout} sx={navButtonStyle}>
              logout
            </Button>
          }
        </Toolbar>
      </AppBar>

      <Notification message={message}/>
      <Error errorMessage={errorMessage}/>

      <Routes>
        <Route path="/login" element={
          user
            ? <Navigate replace to="/" />
            : <LoginForm
              setUser={setUser}
              setMessage={setMessage}
              setErrorMessage={setErrorMessage}
            />
        } />
        <Route path="/" element={
          <>
            <Header/>
            <BlogList blogs={blogs}/>
          </>
        } />
        <Route path="/create" element={
          user
            ? <BlogForm handleBlogCreation={handleBlogCreation}/>
            : <Navigate replace to="/login" />
        } />
        <Route path="/blogs/:id" element={
          <BlogView blogs={blogs} user={user} handleLike={handleLike} handleDeletion={handleDeletion}/>
        } />
      </Routes>
    </div>
  )
}

export default App
