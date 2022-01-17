import React from 'react'
import Contact from './Contact'


const Persons = ({ contactToShow, removeContact }) => {
    return (
        <>
            {contactToShow.map((person) => (
                <Contact key={person.name} name={person.name} phone={person.number} removeContact={removeContact} id={person.id} />
            ))}
        </>
    )
}


export default Persons