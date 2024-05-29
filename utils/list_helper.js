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
  const reducer = (accumulator, value) => {
    return accumulator + value.likes
  }

  return blogs.reduce(reducer, 0)
}

module.exports = {
  dummy, 
  totalLikes
}