import { useState, useEffect } from 'react'

import blogService from './services/blogs'

import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Header from './components/Header'
import Notification from './components/Notification'
import Error from './components/Error'
import Togglable from './components/Togglable'
import Blog from './components/Blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

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
      <Notification message={message}/>
      <Error errorMessage={errorMessage}/>
      { !user &&
        <>
          <LoginForm
            setUser={setUser}
            setMessage={setMessage}
            setErrorMessage={setErrorMessage}
          />
        </>
      }
      { user &&
        <>
          <Header user={user} handleLogout={handleLogout}/>
          <Togglable buttonLabel='create new blog' cancelButtonLabel={'cancel'} buttonBefore={false}>
            <BlogForm
              handleBlogCreation={handleBlogCreation}
            />
          </Togglable>
          <BlogList blogs={blogs} handleLike={handleLike} handleDeletion={handleDeletion}/>
        </>
      }
    </div>
  )
}

export default App
