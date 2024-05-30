const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { listWithOneBlog, listWithManyBlogs } = require('./test_helper')



describe('totalLikes() test', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has many blogs', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    assert.strictEqual(result, 36)
  })
})

describe('favoriteBlog() test', () => {

  test('when list is empty, return nulls', () => {
    const result = listHelper.favoriteBlog([])
    assert.deepStrictEqual(result, {
      title: null,
      author: null,
      likes: null,
    })
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    })
  })

  test('when list has many blogs', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    assert.deepStrictEqual(result, {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    })
  })
})

describe('mostProlificAuthor() test', () => {

  test('when list is empty, return nulls', () => {
    const result = listHelper.mostProlificAuthor([])
    assert.deepStrictEqual(result, { author: null, blogs: null })
  })

  test('when list has only one blog, equals 1', () => {
    const result = listHelper.mostProlificAuthor(listWithOneBlog)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    })
  })

  test('when list has many blogs', () => {
    const result = listHelper.mostProlificAuthor(listWithManyBlogs)
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    })
  })
})

describe('mostLikes() test', () => {

  test('when list is empty, return nulls', () => {
    const result = listHelper.mostLikes([])
    assert.deepStrictEqual(result, { author: null, likes: null })
  })

  test('when list has only one blog, equals his/her likes', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    })
  })

  test('when list has many blogs', () => {
    const result = listHelper.mostLikes(listWithManyBlogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})