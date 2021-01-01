import React, { useState } from 'react'

const Blog = ({ blog, increaseLikes, user, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className='blog'>
      <div style={hideWhenVisible} className='blogshortdiv'>
        {blog.title} {blog.author} <button onClick={() => setVisible(!visible)}>view</button>
      </div>
      <div style={showWhenVisible} className='bloglongdiv'>
        {blog.title} {blog.author} <button onClick={() => setVisible(!visible)}>hide</button> <br />
        {blog.url} <br />
        likes {blog.likes} <button id='like-button' onClick={increaseLikes}>like</button> <br />
        {blog.user.name} <br />
        {blog.user.username === user ? <button id='remove-button' onClick={deleteBlog}>remove</button> : '' }
      </div>

    </div>
  )
}

export default Blog
