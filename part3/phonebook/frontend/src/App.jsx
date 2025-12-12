import { useState, useEffect } from 'react'
import Person from './components/Person'
import personService from './services/persons'
import Notification from './components/Notification'
import Error from './components/Error'

const DisplayNames = ({ persons, newFilter, onDelete}) => {
  const isComplyFilter = (name) => {
    const lowCase = name.toLowerCase()
    if (!newFilter || lowCase.includes(newFilter.toLowerCase()))
      return true
    return false
  }

  return (
    <div>
      {persons.map((person) => { if (isComplyFilter(person.name)) {
        return (
          <Person
            key={person.name}
            person={person}
            onDelete={() => {onDelete(person)}}
          />
        )
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
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
        name : newName,
        number : newNumber,
    }

    const storedPerson = persons.find(person => person.name === newName)
    if (storedPerson != undefined
      && confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(storedPerson.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === storedPerson.id ? returnedPerson : person))
            setNewName('')
            setNewNumber('')
            setMessage(`Updated ${returnedPerson.name}`)
            setTimeout(() => {
              setMessage(null)
            }, 3000)
          })
        return
    } else if (storedPerson == undefined) {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${returnedPerson.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
        .catch(error => {
          console.log(error.response.data.error)
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
    }
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

  const handleDeletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deleteObj(person.id)
        .then( () => {
          setPersons(persons.filter(storedPerson => storedPerson.id != person.id))
          setMessage(`Deleted ${person.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
        .catch(error => {
          setErrorMessage(
            `Person '${person.name}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(storedPerson => storedPerson.id !== person.id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
        <Error message={errorMessage}/>
        <Notification message={message}/>
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
        <DisplayNames persons={persons} newFilter={newFilter} onDelete={handleDeletePerson}/>
    </div>
  )
}

export default App
