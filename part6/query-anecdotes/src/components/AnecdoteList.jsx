import { useEffect } from 'react'
import useAnecdote from '../hooks/useAnecdote'
import { useNotification } from '../contexts/NotificationContext'

const AnecdoteList = () => {
  const { anecdotes, isLoading, isError, voteAnecdote } = useAnecdote()
  const { setNotification } = useNotification()

  const handleVote = (anecdote) => {
    voteAnecdote({ ...anecdote, votes: anecdote.votes + 1 })
    setNotification(`anecdote '${anecdote.content}' voted`)
  }

  useEffect(() => {
    if (isError) {
      setNotification('anecdote service not available due to problems in server')
    }
  }, [isError, setNotification])

  if (isLoading) {
    return <div>loading data...</div>
  }

  if (isError) {
    return null
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
