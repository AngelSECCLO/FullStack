import React, { useEffect, useState } from 'react';
import axios from 'axios'

const Output = ({countries}) => {
  if (countries.length > 10) {
    return(<div>Too many matches, specify another filter</div>)
  } else if (countries.length == 1) {
    return (
      <div>
        <h1>{countries[0].name}</h1>
        capital {countries[0].capital} <br />
        population {countries[0].population}
        <h2>languages</h2>
        <ul>
          {countries[0].languages.map(language => <li>{language.name}</li>)}
        </ul>
        <img width='200p' height='100p' src={countries[0].flag} />
      </div>
    )
  } else if (countries.length > 1 && countries.length <= 10) {
    return (
      countries.map(country => <Country key={country.name} name={country.name} />)
    )
  }
  return (<div>No countries found</div>)
}

const Country = ({name}) => {
  return (
    <div>{name}</div>
  )
}

function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])

  useEffect( () => {
    axios.get('https://restcountries.eu/rest/v2/all')
    .then(response => setCountries(response.data))
  })
 
  const handleSearchChange = (event) => setSearch(event.target.value)
  const countriesToShow = search ? countries.filter(country => country.name.toLowerCase().includes(search.toLowerCase())) : []

  return (
    <div>
      find countries <input value={search} onChange={handleSearchChange} />
      <Output countries={countriesToShow} />
    </div>
  );
}

export default App;
