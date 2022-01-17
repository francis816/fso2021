import React from 'react'
import Button from './Button'
const Contact = ({ name, phone, id, removeContact }) => {
    return (
        <>
            <p>{name} {phone} <Button func={() => removeContact(id)} text='delete' /></p>
        </>
    )
}

export default Contact