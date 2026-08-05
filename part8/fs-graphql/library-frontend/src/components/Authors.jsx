import { useQuery } from '@apollo/client/react'

import { ALL_AUTHORS } from "../queries"
import BirthyearForm from './BirthyearForm'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS, {
    skip: !props.show
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <BirthyearForm authors={result.data.allAuthors}/>
    </div>
  )
}

export default Authors
