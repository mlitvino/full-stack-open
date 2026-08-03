import { useEffect } from 'react'
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Button, Typography } from '@mui/material'
import { ErrorBoundary } from 'react-error-boundary'

import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import BlogForm from './components/BlogForm'
import UsersList from './components/UsersList'
import UserView from './components/UserView'
import Header from './components/Header'
import Notification from './components/Notification'
import Error from './components/Error'
import ErrorFallback from './components/ErrorFallback'
import { useBlogs, useBlogsActions } from './stores/blogsStore'
import { useUser, useUserActions } from './stores/userStore'

const navButtonStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

const App = () => {
  const { initialize } = useBlogsActions()
  const blogs = useBlogs()
  const user = useUser()
  const { initUser, logout } = useUserActions()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    initUser()
  }, [initUser])

  if (!blogs) {
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={navButtonStyle}>
            blogs
          </Button>
          <Button color="inherit" component={Link} to="/users" sx={navButtonStyle}>
            users
          </Button>
          {user && (
            <Button color="inherit" component={Link} to="/create" sx={navButtonStyle}>
              new blog
            </Button>
          )}
          {!user && (
            <Button color="inherit" component={Link} to="/login" sx={navButtonStyle}>
              login
            </Button>
          )}
          {user && (
            <Button color="inherit" onClick={handleLogout} sx={navButtonStyle}>
              logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[location.pathname]}>
        <Notification />
        <Error />

        <Routes>
          <Route path="/login" element={user ? <Navigate replace to="/" /> : <LoginForm />} />
          <Route
            path="/"
            element={
              <>
                <Header />
                <BlogList blogs={blogs} />
              </>
            }
          />
          <Route path="/create" element={user ? <BlogForm /> : <Navigate replace to="/login" />} />
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:id" element={<UserView />} />
          <Route
            path="*"
            element={
              <Typography component="h2" sx={{ fontSize: 24, fontWeight: 'bold', mt: 4 }}>
                404 - Page Not Found
              </Typography>
            }
          />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
