import React, { useState, useEffect } from 'react'
import axios from 'axios'

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
  const [ filter, setFilter] = useState('')

  useEffect( () => {
    axios.get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
    })
  })

  const addPerson = (event) => {
    event.preventDefault()
    if (search(newName, persons)){
      alert(`${newName} is already added to phonebook`)
    }
    else {
      const copy = [...persons]
      copy.push({name: newName, number: newNumber})
      setPersons(copy)
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

  
  const personsToShow = filter ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())) : persons
  console.log(personsToShow)

  return (
    <div>
      <h1>Phonebook</h1>
        <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h1>add a new</h1>
        <Form addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h1>Numbers</h1>
        <Numbers personsToShow={personsToShow} />
    </div>
  )
}

export default App