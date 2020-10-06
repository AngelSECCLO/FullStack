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

const Total = ({parts}) => {
  const total = parts.reduce((s, p) => s + p.exercises, 0)
	return (
	  <p><b>Total of {total} exercises</b></p>
	)
}

const Course = ({course}) => {
	return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
	  <Total parts={course.parts} />
    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
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
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  const body = courses.map(course => <Course key={course.id} course={course} />)
  return <div> {body} </div>
}

ReactDOM.render(<App />, document.getElementById('root'))