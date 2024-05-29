const _ = require('lodash')

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

/**
 * return the blog auther with the most blog posts from a list of blogs
 * @param {Array} blogs 
 * @returns {{ author: String, blogs: Number }}
 */
const mostProlificAuthor = (blogs) => {
  if (blogs.length === 0) {
    return { author: null, blogs: null }
  }
  // Count the number of blog posts for each author
  const authorCounts = _.countBy(blogs, 'author');

  // Find the author with the most blog posts
  const author = _.maxBy(Object.keys(authorCounts), (author) => authorCounts[author]);

  return { author: author, blogs: authorCounts[author] }
}

module.exports = {
  dummy, 
  totalLikes,
  favoriteBlog,
  mostProlificAuthor
}