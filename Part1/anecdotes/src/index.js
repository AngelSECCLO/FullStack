import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const Max = (props)	=>	{
	if (props.votes > 0) {
		return (
		  <div>
			<h1>Anecdote with most votes</h1>
			{props.anecdotes[props.index]} <br />
			Has {props.votes} votes <br />
	      </div>
		)
	}
	return null
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState([0, 0, 0, 0, 0, 0])

  const handleSelectionClick = () => {
    const rand = Math.floor(Math.random()*props.anecdotes.length)
    setSelected(rand)
  }
  
  const handleVoteClick = () => {
	const copy = [...points]
	copy[selected] += 1
	setPoints(copy)
  }
	  
  return (
    <div>
	  <h1>Anecdote of the day</h1>	
      {props.anecdotes[selected]} <br />
	  Has {points[selected]} votes <br />
	  <Button onClick={handleVoteClick} text='vote' />
	  <Button onClick={handleSelectionClick} text='next anecdote' />
	  <Max index={points.indexOf(Math.max(...points))} votes={Math.max(...points)} anecdotes={props.anecdotes} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)