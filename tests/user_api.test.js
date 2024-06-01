const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const app = require('../app')
const api = supertest(app)

const { usersInDb } = require('./test_helper')


const validAccount = {
  username: "testaccount2",
  name: "testaccount2",
  password: "test2",
}
const invalidAccount = {
  username: "user",
  name: "testaccount",
  password: "pw",
}


describe('user api tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('test1', 10)
    const user = new User({ username: 'testaccount1', name: 'testaccount1', passwordHash })

    await user.save()
  })

  after(async () => {
    await mongoose.connection.close()
    console.log('after() done');
  })

  test('create a user (valid)', async () => {

    await api
      .post('/api/users')
      .send(validAccount)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const users = await usersInDb()
    assert.strictEqual(users.length, 2)
  })

  test('invalid users are not created and will return an error message', async () => {

    await api
      .post('/api/users')
      .send(invalidAccount)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const users = await usersInDb()
    assert.strictEqual(users.length, 1)
  })
  
})



