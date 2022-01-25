import React, { useState } from 'react'
const Title = ({ text }) => {
  return (
    <>
      <h1>{text}</h1>
    </>
  )
}

const Content = ({ quote, votesNum }) => {
  return (
    <>
      <p>{quote}</p>
      <p>has {votesNum} votes</p>
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
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const generateQuote = () => {
    const randomNum = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomNum)
  }

  const upVoted = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  const maxVote = Math.max(...votes)
  const maxQuote = anecdotes[votes.indexOf(maxVote)]
  return (
    <>
      <Title text="Anecdote of the day" />
      <Content quote={anecdotes[selected]} votesNum={votes[selected]} />
      <Button func={upVoted} text='vote' />
      <Button func={generateQuote} text='next anecdote' />
      <Title text="Anecdote with most votes" />
      <Content quote={maxQuote} votesNum={maxVote} />
    </>
  )
}

export default App