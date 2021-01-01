import React from 'react'

const Notification = ({ message, error }) => {
  if (message === null && error === null) {
    return null
  }

  else if (error !== null) {
    return (
      <div className="error">
        {error}
      </div>
    )
  }

  else {
    return (
      <div className="message">
        {message}
      </div>
    )
  }

}

export default Notification