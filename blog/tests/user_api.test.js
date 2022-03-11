const mongoose = require('mongoose')
const supertest = require('supertest')
const bcryptjs = require('bcryptjs')
const User = require('../models/user')
const helper = require('./user_api_test_helper')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  for (const user of helper.initialUsers) {
    const saltRounds = bcryptjs.genSaltSync(10)
    const passwordHash = await bcryptjs.hashSync(user.password, saltRounds)
    const userObj = new User({
      username: user.username,
      name: user.name,
      passwordHash,
    })
    await userObj.save();
  }
}, 100000)

afterAll(() => {
  mongoose.connection.close()
})

describe('test get method', () => {
  test('should return two users', async () => {
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(helper.initialUsers.length)
  }, 100000)
})

describe('test create user', () => {
  test('creation fails if username already taken', async () => {
    const userObj = {
      username: 'hellas',
      name: 'Arto Hellas2',
      password: 'password',
    }
    const result = await api
      .post('/api/users')
      .send(userObj)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toContain('`username` to be unique')
    const currentUsers = await helper.usersInDb()
    expect(currentUsers).toHaveLength(helper.initialUsers.length)
  }, 100000)

  test('creation fails if no username', async () => {
    const userObj = {
      name: 'Arto Hellas2',
      password: 'password',
    }
    const result = await api
      .post('/api/users')
      .send(userObj)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toContain('`username` is required')
    const currentUsers = await helper.usersInDb()
    expect(currentUsers).toHaveLength(helper.initialUsers.length)
  })

  test('creation fails if password length less than 3', async () => {
    const userObj = {
      username: 'hellas2',
      name: 'Arto Hellas2',
      password: 'p',
    }
    const result = await api
      .post('/api/users')
      .send(userObj)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password length should not less than 3')
    const currentUsers = await helper.usersInDb()
    expect(currentUsers).toHaveLength(helper.initialUsers.length)
  })
})