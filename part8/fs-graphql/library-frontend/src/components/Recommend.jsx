import { useQuery } from "@apollo/client/react"

import { ALL_BOOKS, ME } from "../queries"

const Recommend = ({ show }) => {
  const meResult = useQuery(ME, {
    skip: !show
  })

  const favoriteGenre = meResult.data?.me?.favoriteGenre

  const booksResult = useQuery(ALL_BOOKS, {
    skip: !show || !favoriteGenre,
    variables: { genre: favoriteGenre }
  })

  if (!show) {
    return null
  }

  if (meResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>

      <div>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksResult.data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
