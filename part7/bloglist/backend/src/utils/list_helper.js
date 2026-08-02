const lodash = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const total = blogs.reduce((likesSum, currentBlog) => {
    return likesSum + currentBlog.likes
  }, 0)

  return total
}

const favoriteBlog = (blogs) => {
  let favorite = null

  if (blogs && blogs.length > 0) {
    favorite = blogs[0]
  } else {
    return null
  }

  blogs.forEach(element => {
    if (element.likes > favorite.likes) {
      favorite = element
    }
  })

  return favorite
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null
  }

  const authorCounts = lodash.countBy(blogs, 'author')

  const authors = Object.keys(authorCounts).map(author => ({
    author: author,
    blogs: authorCounts[author]
  }))

  return lodash.maxBy(authors, 'blogs')
}

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null
  }

  const grouped = lodash.groupBy(blogs, 'author')

  const authors = Object.keys(grouped).map(author => ({
    author: author,
    likes: lodash.sumBy(grouped[author], 'likes')
  }))

  return lodash.maxBy(authors, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
