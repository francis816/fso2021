import React, { useState } from 'react'

const Title = ({ text }) => {
  return (
    <>
      <h1>{text}</h1>
    </>
  )
}

const Button = ({ func, text }) => {
  return (
    <>
      <button onClick={func}>{text}</button>
    </>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>
        <p>{text} {value}</p>
      </td>
    </tr>
  )
}


const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = `${good / all * 100} %`
  if (all === 0) {
    return (
      <>
        <p>No feedback given</p>
      </>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positive} />
      </tbody>
    </table>
  )
}
const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => {
    setGood(good + 1)
  }

  const increaseNeutral = () => {
    setNeutral(neutral + 1)
  }

  const increaseBad = () => {
    setBad(bad + 1)
  }


  return (
    <>
      <Title text='give feedback' />
      <Button func={increaseGood} text="good" />
      <Button func={increaseNeutral} text="neutral" />
      <Button func={increaseBad} text="bad" />
      <Title text='statistics' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App