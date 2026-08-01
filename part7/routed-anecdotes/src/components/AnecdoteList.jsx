import { useAnecdotes } from "../hooks/useAnecdotes"

const AnecdoteList = () => {
  const { anecdotes, remove } = useAnecdotes()

  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote => (
          <div key={anecdote.id}>
            <li>{anecdote.content}</li>
            <button onClick={() => remove(anecdote.id)}>delete</button>
          </div>
        ))}
      </ul>
    </div>
  )
}

export default AnecdoteList
