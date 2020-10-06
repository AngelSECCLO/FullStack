import React, { useState, useEffect } from 'react'
import Person from './components/Person'
import Form from './components/Form'
import Notification from './components/Notification'
import personService from './services/persons'

function search(key, tArray) {
  for (var i=0; i < tArray.length; i++) {
    if (tArray[i].name === key){
      return true
    }
  }
  return false
}

const Filter = ({filter, handleFilterChange}) => <div> filter shown with <input value={filter} onChange={handleFilterChange} /></div>
const Numbers = ({personsToShow, deletePerson}) => <div>{personsToShow.map(person => <Person key={person.name} person={person} deletePerson={deletePerson} />)}</div>

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ sfilter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  
  useEffect( () => {
    personService
      .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
    })
  })

  const addPerson = (event) => {
    event.preventDefault()
    if (search(newName, persons)){
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newName)
        const changedPerson = {...person, number: newNumber}
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : changedPerson))
            setMessage(`Updated ${newName}`)
            setTimeout(() => setMessage(null), 5000)
          })
          .catch(error => {
            alert(`The person ${newName} was already deleted from the server`)
            setPersons(persons.filter(p => p.id !== person.id))
          })
      }
    }
    else {
      personService
        .create({name: newName, number: newNumber})
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${newName}`)
          setTimeout(() => setMessage(null), 5000)
        })
      }
  }

  const deletePerson = (event) => {
    event.preventDefault()
    const id = event.target.value
    const name = persons.find(person => person.id === parseInt(id)).name
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(returnedPerson => {
          setPersons(persons.filter(p => p.id !== id))
          setMessage(`Deleted ${newName}`)
          setTimeout(() => setMessage(null), 5000)
        })
        .catch(error => {
          alert(`The person ${newName} was already deleted from the server`)
          setPersons(persons.filter(p => p.id !== id))
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
    setFilter(event.target.value)

  }

  const personsToShow = sfilter ? persons.filter(person => person.name.toLowerCase().includes(sfilter.toLowerCase())) : persons
  
  return (
    <div>
      <h1>Phonebook</h1>
        <Notification message={message} />
        <Filter filter={sfilter} handleFilterChange={handleFilterChange}/>
      <h1>add a new</h1>
        <Form addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h1>Numbers</h1>
        <Numbers personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App