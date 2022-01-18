import React from 'react'
const ClassName = ({ name }) => {
    return (
        <>
            <h2>{name}</h2>
        </>
    )
}

const Content = ({ name, exercises }) => {
    return (
        <p>{name} {exercises}</p>
    )
}

const LoopAllContent = ({ parts }) => {
    return (
        <>
            {
                parts.map((parts) => (
                    <Content name={parts.name} exercises={parts.exercises} key={parts.id} />
                ))
            }
        </>
    )
}

const Total = ({ parts }) => {
    return (
        <p><b>total of {parts.reduce((prev, curr) => prev + curr.exercises, 0)} exercises</b></p>
    )
}

const CourseInfo = ({ courses }) => {
    return (
        <>
            <ClassName name={courses.name} />
            <LoopAllContent parts={courses.parts} />
            <Total parts={courses.parts} />
        </>
    )
}
export default CourseInfo