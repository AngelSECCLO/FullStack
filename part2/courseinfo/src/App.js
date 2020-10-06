import React from 'react'
import Course from './components/Course'

const App = ({courses}) => {
    const body = courses.map(course => <Course key={course.id} course={course} />)
    return (
        <div>
            <h1>Web Development Curriculum</h1> 
            {body} 
        </div>
    )
}

export default App