import React, { useState } from 'react'

const Filter = ({ change }) => {
  return (
    <>
      filter shown with <input onChange={change} />
    </>
  )
}


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

const Contact = ({ name, phone }) => {
  return (
    <>
      <p>{name} {phone}</p>
    </>
  )
}

const Persons = ({ contactToShow }) => {
  return (
    <>
      {contactToShow.map((person) => (
        <Contact key={person.name} name={person.name} phone={person.number} />
      ))}
    </>
  )
}

function App() {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: "040-1234567" }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addContact = (event) => {
    event.preventDefault()
    const contactObj = {
      name: newName,
      number: newNumber
    }
    for (let i = 0; i < persons.length; i++) {
      if ((persons[i].name) === newName) {
        alert(`${newName} is already added to phonebook`)
        return
      }
      if ((persons[i].number) === newNumber) {
        alert(`${newNumber} is already added to phonebook`)
        return
      }
    }
    // cannot put the 2 lines below inside the for loop above, bc not every name in the array = name, which causes always push into the list
    setPersons(persons.concat(contactObj))
    setNewName('')
    setNewNumber('')

  }
  const handleChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  const contactToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter change={handleFilterChange} />
      <h3>add a new </h3>
      <PersonForm addContact={addContact} handleChange={handleChange} handleNumChange={handleNumChange} newName={newName} newNumber={newNumber} />
      <h3>Numbers</h3>
      <Persons contactToShow={contactToShow} />
    </div>
  )
}

export default App;
