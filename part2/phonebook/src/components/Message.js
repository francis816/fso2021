import React from 'react'

const Notification = ({ message }) => {
    if (message === null) return null
    return (
        <div className='message'>
            {message}
        </div>
    )
}

const ErrorMessage = ({ errorMessage }) => {
    if (errorMessage === null) return null
    return (
        <div className='error'>
            {errorMessage}
        </div>
    )
}

export { Notification, ErrorMessage }
// 'export' {xxx, yyy} matches import {xxx, yyy}
// 'export default' xxx matches import xxx