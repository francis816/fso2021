import React, { useEffect, useState } from 'react'
import personsService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

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
          // must compare with name, not id, bc new contactObj has a new id
          const targetPerson = persons.find(person => person.name.toLowerCase() === contactObj.name.toLowerCase())
          const changedNum = { ...targetPerson, number: newNumber }
          personsService
            .update(targetPerson.id, changedNum)
            .then(returnedObj => {
              // can also use person.name.toLowerCase() instead of person.id 
              setPersons(persons.map(person => person.id !== targetPerson.id ? person : returnedObj))
            })
        }
        return
      }
      if ((persons[i].number) === newNumber) {
        alert(`${newNumber} is already added to phonebook`)
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
      <Filter change={handleFilterChange} />
      <h3>add a new </h3>
      <PersonForm addContact={addContact} handleChange={handleChange} handleNumChange={handleNumChange} newName={newName} newNumber={newNumber} />
      <h3>Numbers</h3>
      <Persons contactToShow={contactToShow} removeContact={removeContact} />
    </div>
  )
}

export default App;
