import { useAnecdotes, useAnecdoteActions } from '../stores/anecdoteStore'
import { useNotificationActions } from '../stores/notificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote,  remove } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()
  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)

  const handleVote = async (anecdote) => {
    await vote(anecdote.id)
    setNotification(`you voted '${anecdote.content}'`)
  }

  const handleDeletion = async (anecdote) => {
    await remove(anecdote.id)
    setNotification(`you deleted '${anecdote.content}'`)
  }

  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {anecdote.votes === 0 ?
              <button onClick={(() => handleDeletion(anecdote))}>
                delete
              </button>
              : null
            }
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
