import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Display = props => <div>{props.text} {props.value}</div>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = (props) => {
	const good = props.good
	const neutral = props.neutral
	const bad = props.bad
	if ((good + neutral + bad) === 0) {
		return (
			<div>
			  No feedback given
			</div>
		)
	}
	return (
	<div>
	  <Display text="good" value={good} />
	  <Display text="neutral" value={neutral} />
	  <Display text="bad" value={bad} />
	  <Display text="all" value={good + neutral + bad} />
	  <Display text="average" value={(good - bad)/(good + neutral + bad)} />
	  <Display text="positive" value={good*100/(good + neutral + bad) + " %"} />
	</div>
	)
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
	  <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
	  <h1>statistics</h1>
	  <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)