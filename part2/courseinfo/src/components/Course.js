import React from 'react'

const Header = ({course}) => {
	return (
	  <h2>{course}</h2>
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

export default Course