const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if the username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails if username or password are missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const res_no_pass = await api
      .post('/api/users')
      .send({ username: 'mlukkai', name: 'Matti Lukkainen' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(res_no_pass.body.error).toMatch(/password.*missing/)

    const res_no_uname = await api
      .post('/api/users')
      .send({ name: 'Matti Lukkainen', password: 'salainen' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(res_no_uname.body.error).toContain('`username` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails if username or password are too short', async() => {
    const usersAtStart = await helper.usersInDb()

    const res_short_pass = await api
      .post('/api/users')
      .send({ username: 'ml', name: 'Matti Lukkainen', password: 'salainen' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(res_short_pass.body.error).toMatch(/username.*is shorter/)

    const res_short_uname = await api
      .post('/api/users')
      .send({ username: 'mlukkai', name: 'Matti Lukkainen', password: 'sa' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(res_short_uname.body.error).toContain('password is too short')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})