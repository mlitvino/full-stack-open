import { useQuery, useSubscription, useApolloClient } from "@apollo/client/react"
import { useMemo, useState } from "react"

import { ALL_BOOKS, BOOK_ADDED } from "../queries"
import { addBookToCache } from '../utils/apolloCache'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      addBookToCache(client.cache)
      props.notify(`New book added: ${addedBook.title}`, 'success')
    },
    onError: (error) => {
      console.error('bookAdded subscription error:', error)
    },
  })

  const allBooksResult = useQuery(ALL_BOOKS, {
    skip: !props.show
  })

  const result = useQuery(ALL_BOOKS, {
    skip: !props.show,
    variables: { genre }
  })

  const genres = useMemo(() => {
    const allBooks = allBooksResult.data?.allBooks

    if (!allBooks) {
      return []
    }

    return [...new Set(allBooks.flatMap((b) => b.genres))]
  }, [allBooksResult.data])

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const booksToShow = result.data?.allBooks ?? []

  return (
    <div>
      <h2>books</h2>

      <div>
        in genre <strong>{genre ?? 'all genres'}</strong>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => setGenre(null)}>all genres</button>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
