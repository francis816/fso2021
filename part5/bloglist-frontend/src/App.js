import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './/services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState(0)


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
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    // try {
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
    // } catch (exception) {
    //   setErrorMessage('Wrong credentials')
    //   setTimeout(() => {
    //     setErrorMessage(null)
    //   }, 5000)
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