import React, { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Person = ({person}) => {
  return (
    <div>
      {person.name} {person.number}
    </div>
  )
}

function search(key, tArray) {
  for (var i=0; i < tArray.length; i++) {
    if (tArray[i].name === key){
      return true
    }
  }
  return false
}

const Filter = ({filter, handleFilterChange}) => <div> filter shown with <input value={filter} onChange={handleFilterChange} /></div>
const Numbers = ({personsToShow}) => <div>{personsToShow.map(person => <Person key={person.name} person={person} />)}</div>

const Form = (props) => {
  return (
    <form onSubmit={props.addPerson}>
        <div>
          name: <input value={props.newName} onChange={props.handleNameChange}/>
        </div>
        <div>
          number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ sfilter, setFilter] = useState('')

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
      alert(`${newName} is already added to phonebook`)
    }
    else {
      personService
        .create({name: newName, number: newNumber})
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
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
        <Filter filter={sfilter} handleFilterChange={handleFilterChange}/>
      <h1>add a new</h1>
        <Form addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h1>Numbers</h1>
        <Numbers personsToShow={personsToShow} />
    </div>
  )
}

export default App