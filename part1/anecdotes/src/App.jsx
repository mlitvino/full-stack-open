"use strict";
import { useState } from 'react'

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const Header = ({ title }) => {
  return (
    <h1>
      {title}
    </h1>
  )
}

const Button = ({ name, onClick }) => {
  return (
    <button onClick={onClick}>{name}</button>
  )
}

const handleNextClick = (size, setter) => {
  return () => setter(getRandomInt(size))
}

const handleVoteClick = (selected, setter) => {
  return () => {
    setter(prev => {
      const copy = [...prev]
      copy[selected]++
      return copy
    })
  }
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const maxVotes = votes.length ? Math.max(...votes) : 0
  const indMaxVotes = votes.findIndex(v => v === maxVotes)

  return (
    <div>
      <Header title='Anecdote of the day'/>
      {anecdotes[selected]} <br/>
      has {votes[selected]} votes<br/>
      <Button onClick={handleNextClick(anecdotes.length, setSelected)} name='next anecdote' />
      <Button onClick={handleVoteClick(selected, setVotes)} name='vote' />
      <Header title='Anecdote with most votes'/>
      {anecdotes[indMaxVotes]} <br/>
      has {maxVotes} votes
    </div>
  )
}

export default App
