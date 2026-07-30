import { useAnecdoteActions } from "../stores/anecdoteStore"

const Filter = () => {
  const { setFilter } = useAnecdoteActions()

  const handleChange = (e) => {
    setFilter(e.target.value)
  }

  const style = {
    marginTop: 10,
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter
