import React from 'react'

const PersonForm = ({ addContact, handleChange, handleNumChange, newName, newNumber }) => {
    return (
        <form onSubmit={addContact}>
            <div>
                name: <input value={newName} onChange={handleChange} />
            </div>
            <div>
                number: <input value={newNumber} onChange={handleNumChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm
