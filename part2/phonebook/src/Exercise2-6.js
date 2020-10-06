import React, { useState } from 'react'

const Person = ({person}) => {
  return (
    <div>
      {person.name}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [ newName, setNewName ] = useState('')

  const addName = (event) => {
    event.preventDefault()
    const copy = [...persons]
    copy.push({name: newName})
    setPersons(copy)
  }

  const handleInputChange = (event) => {
    setNewName(event.target.value)
  }

  const numbers = persons.map(person => <Person key={person.name} person={person} />)

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleInputChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
       {numbers}
    </div>
  )
}

export default App