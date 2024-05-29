/**
 * 
 * @param {Array} blogs 
 * @returns {Number}
 */
const dummy = (blogs) => {
  return 1
}

/**
 * calculate total likes of a list of blogs
 * @param {Array} blogs 
 * @returns {Number}
 */
const totalLikes = (blogs) => {
  const reducer = (accumulator, element) => {
    return accumulator + element.likes
  }

  return blogs.reduce(reducer, 0)
}

/**
 * return the blog with the most likes from a list of blogs
 * @param {Array} blogs 
 * @returns {{ title: String, author: String, likes: Number }}
 */
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return { title: null, author: null, likes: null }
  }
  const reducer = (comparator, element) => {
    if (element.likes > comparator.likes) {
      comparator = {
        title: element.title,
        author: element.author,
        likes: element.likes
      }
    }
    return comparator
  }
  const initial = { 
    title: blogs[0].title,
    author: blogs[0].author,
    likes: blogs[0].likes,
  }

  return blogs.reduce(reducer, initial)
}

module.exports = {
  dummy, 
  totalLikes,
  favoriteBlog
}