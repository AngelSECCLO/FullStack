import React from 'react';
import ReactDOM from 'react-dom';

const Header = ({course}) => {
	return (
	  <h1>{course}</h1>
	)
}

const Part = ({part, exercises}) => {
	return (
	    <p>
		  {part} {exercises}
		</p>
	)
}

const Content = ({parts}) => {
	const result = parts.map(part =>
					<Part key={part.id} part={part.name} exercises={part.exercises} />
				   )
	return (
	    <div>
		{result}
		</div>
	)
}

/*const Total = (props) => {
	return (
	  <p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
	)
}*/

const Course = ({course}) => {
	return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
    </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

ReactDOM.render(<App />, document.getElementById('root'))