import { useState, useEffect } from 'react'
import axios from 'axios'
import Person from './components/Person'

const DisplayNames = ({ persons, newFilter }) => {

  const isComplyFilter = (name) => {
    const lowCase = name.toLowerCase()
    if (!newFilter || lowCase.includes(newFilter.toLowerCase()))
      return true
    return false
  }

  return (
    <div>
      {persons.map((person) => { if (isComplyFilter(person.name)) {
        return <Person key={person.name} person={person} />
      }}
      )}
    </div>
  )
}

const Filter = ({ newFilter, handleFilterChange}) => {

  return (
    <form>
      <div>
        filter shown with
        <input
          value={newFilter}
          onChange={handleFilterChange}
        />
      </div>
    </form>
  )
}

const PersonForm = ({ onSubmit, newName, onNameChange, newNumber, onNumberChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name:
        <input
          value={newName}
          onChange={onNameChange}
        />
      </div>
      <div>
        number:
        <input
          value={newNumber}
          onChange={onNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }

  useEffect(hook, [])
  console.log('render', persons.length, 'notes')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
        name : newName,
        number : newNumber
    }

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      <h2>add a new</h2>
        <PersonForm
          onSubmit={addPerson}
          newName={newName}
          onNameChange={handleNameChange}
          newNumber={newNumber}
          onNumberChange={handleNumberChange}
        />
      <h2>Numbers</h2>
        <DisplayNames persons={persons} newFilter={newFilter}/>
    </div>
  )
}

export default App
