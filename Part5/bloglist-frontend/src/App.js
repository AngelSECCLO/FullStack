import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = React.createRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setError('Wrong credentials!')
      setTimeout(() => setError(null), 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
    setMessage('Logged out successfully')
    setTimeout(() => setMessage(null), 5000)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`Added new blog "${blogObject.title}"`)
      setTimeout(() => setMessage(null), 5000)
    } catch (exception) {
      setError('ERROR: Missing parameters')
      setTimeout(() => setError(null), 5000)
    }
  }

  const increaseLikesTo = async (id, likes) => {
    try {
      const returnedObject = await blogService.update(id, { likes: likes })
      const changedBlog = blogs.find(blog => blog.id === id)
      changedBlog.likes = returnedObject.likes
      setBlogs(blogs.map(blog => blog.id === id ? changedBlog : blog))
    } catch (exception) {
      console.log(exception)
      setError('ERROR')
      setTimeout(() => setError(null), 5000)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      if (window.confirm(`Delete blog "${blog.title}" by ${blog.author}?`)) {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setMessage(`Deleted blog "${blog.title}" by ${blog.author}`)
        setTimeout(() => setMessage(null), 5000)
      }
    } catch (exception) {
      console.log(exception)
      setError('ERROR')
      setTimeout(() => setError(null), 5000)
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} error={error} />

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in <button onClick={handleLogout}>logout</button> </p>
          {blogForm()}

          <div>
            {blogs
              .sort(function (a, b) {
                return b.likes - a.likes
              })
              .map(blog =>
                <Blog key={blog.id} blog={blog} user={user.username}
                  increaseLikes={() => increaseLikesTo(blog.id, blog.likes + 1)}
                  deleteBlog={() => deleteBlog(blog)} />
              )}
          </div>
        </div>
      }

    </div>
  )
}

export default App