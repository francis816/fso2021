import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './/services/login'
import { Notification, ErrorMessage } from './components/Message'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState(0)

  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url,
      user: user.name,
      likes: likes
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setTitle('')
        setAuthor('')
        setUrl('')
      })
      .then(() => {

        setMessage(`a new blog ${title} by ${author} added`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
    // .catch(() => {
    //   setErrorMessage(`xxxxxxxxxx`)
    //   setTimeout(() => {
    //     setErrorMessage(null)
    //   }, 5000)
    // })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      // trying to see if it logs hihi out
      // it does, so the function is not wrong 
      // so probably something wrong during rendering at the bottom
      // figured out should put errormessage in login form, not after logging in
      console.log(`hihi`)
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    // clear local storage
    window.localStorage.removeItem('loggedBlogappUser')
    // clear user
    setUser(null)
  }
  const loginForm = () => {
    return (
      <>
        <h2> Log in to application </h2>
        <ErrorMessage errorMessage={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </>
    )
  }


  const createForm = () => {
    return (
      <>
        <form onSubmit={addBlog}>
          {/* same as const = handleTitleChange... above */}
          <div>Title: <input value={title} onChange={({ target }) => setTitle(target.value)} /></div>
          <div>Author: <input value={author} onChange={({ target }) => setAuthor(target.value)} /></div>
          <div>Url: <input value={url} onChange={({ target }) => setUrl(target.value)} /></div>
          <button type="submit">create</button>
        </form>
      </>
    )
  }


  const blogLists = () => {
    return (
      <>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </>
    )
  }


  return (
    <div>
      {user === null ?
        loginForm() :
        <>
          <h2>blogs</h2>
          <Notification message={message} />
          <div>{user.name} logged in <button onClick={handleLogout}>logout</button></div>
          <br></br>
          {createForm()}
          {blogLists()}
        </>
      }
    </div>
  )
}

export default App