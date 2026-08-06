import { useState } from 'react'
import { useMutation } from '@apollo/client/react'

import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const BirthyearForm = ({ authors, token }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onCompleted: (data) => {
      if (!data.editAuthor) {
        console.log('author not found')
      }
    }
  })

  if (!token) {
    return null
  }

  const submit = (event) => {
    event.preventDefault()

    editAuthor({ variables: { name, setBornTo: Number(born) } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>

      <form onSubmit={submit}>
        <label>
          name
          <select
            name='name'
            value={name}
            onChange={({ target }) => setName(target.value)}
          >
            <option value=''></option>
            {authors.map(a => {
              return (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              )
            })}
          </select>
        </label>
        <div>
          <label>
            born <input
              name='born'
              type='number'
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </label>
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default BirthyearForm
