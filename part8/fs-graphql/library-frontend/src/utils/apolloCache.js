export const addBookToCache = (cache) => {
  cache.evict({ id: 'ROOT_QUERY', fieldName: 'allBooks' })
  cache.evict({ id: 'ROOT_QUERY', fieldName: 'allAuthors' })
  cache.gc()
}
