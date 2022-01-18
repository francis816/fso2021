import React, { useEffect, useState } from 'react'
import personsService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import { Notification, ErrorMessage } from './components/Message'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addContact = (event) => {
    event.preventDefault()
    const contactObj = {
      name: newName,
      number: newNumber
    }
    // check if contact already existed in phonebook
    for (let i = 0; i < persons.length; i++) {

      // if so, want to update the contract?
      if ((persons[i].name.toLowerCase()) === newName.toLowerCase()) {
        const wantUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)

        if (wantUpdate) {
          // must use name, not id, bc new contactObj has a new id
          const targetPerson = persons.find(person => person.name.toLowerCase() === contactObj.name.toLowerCase())
          // copy every property of the obj except number, aka update the number
          const updatedTargetPerson = { ...targetPerson, number: newNumber }

          personsService
            .update(targetPerson.id, updatedTargetPerson)
            .then(returnedObj => {
              // can also use person.name.toLowerCase() instead of person.id 
              setPersons(persons.map(person => person.id !== targetPerson.id ? person : returnedObj))
            })
            .then(() => {
              // targetPerson is the old obj, updatedTargetPerson is the new updated obj
              setMessage(`Updated ${newName}'s phone number from ${targetPerson.number} to ${newNumber}`)
              setTimeout(() => {
                setMessage(null)
              }, 5000)
            })
            .catch(() => {
              setErrorMessage(`Information of ${updatedTargetPerson.name} has already been removed from server`)
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
            })
        }
        return
      }
      if (persons[i].number === newNumber) {
        alert(`Phone number " ${newNumber} " is already added to phonebook`)
        return
      }
    }
    personsService
      .create(contactObj)
      .then(returnedObj => {
        setPersons(persons.concat(returnedObj))
        setNewName('')
        setNewNumber('')
      })
      .then(() => {
        setMessage(`Added ${newName}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(() => {
        setErrorMessage(`Information of ${contactObj.name} has already been removed from server`)
      })
  }

  const removeContact = (id) => {
    const person = persons.find(person => person.id === id)

    if (window.confirm(`Delete ${person.name} ?`)) {
      personsService
        .remove(id)
        .then(
          setPersons(persons.filter(person => person.id !== id))
        )
    }
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
      <Notification message={message} />
      <ErrorMessage errorMessage={errorMessage} />
      <Filter change={handleFilterChange} />
      <h3>add a new </h3>
      <PersonForm addContact={addContact} handleChange={handleChange} handleNumChange={handleNumChange} newName={newName} newNumber={newNumber} />
      <h3>Numbers</h3>
      <Persons contactToShow={contactToShow} removeContact={removeContact} />
    </div>
  )
}

export default App;
