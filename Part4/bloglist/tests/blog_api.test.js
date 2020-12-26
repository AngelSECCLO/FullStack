const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('when there is initially some blogs saved', () => {
  test('there are 6 blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(6)
  })

  test('the "id" property exists', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultBlog.body).toEqual(blogToView)
    })

    test('fails with statuscode 404 if the blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 the id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with a valid token', async () => {
      const token = await helper.getValidToken()

      const newBlog = {
        title: 'New Blog',
        author: 'Some One',
        url: 'https://whatever.com/',
        likes: 8
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', 'Bearer ' + token)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
      const lastBlog = blogsAtEnd.slice(-1)[0]
      newBlog['id'] = lastBlog['id']
      newBlog['user'] = lastBlog['user']
      expect(lastBlog).toEqual(newBlog)
    })

    test('fails if a token is not provided', async() => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        title: 'New Blog',
        author: 'Some One',
        url: 'https://whatever.com/',
        likes: 8
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtStart.length).toBe(blogsAtEnd.length)
    })

    test('missing "likes" defaults to 0', async () => {
      const token = await helper.getValidToken()

      const newBlog = {
        title: 'New Blog2',
        author: 'Some Guy',
        url: 'https://whatever2.com/'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', 'Bearer ' + token)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const lastBlog = blogsAtEnd.slice(-1)[0]
      expect(lastBlog.likes).toBeDefined()
      expect(lastBlog.likes).toBe(0)
    })

    test('missing title and url results in error', async () => {
      const token = await helper.getValidToken()

      const newBlog = {
        author: 'test',
        likes: 3
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
      const token = await helper.getValidToken()

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', 'Bearer ' + token)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1)
      expect(blogsAtEnd.map(blog => blog.id)).not.toContain(blogToDelete.id)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with code 204 if likes is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: blogToUpdate.likes + 5 })
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes + 5)
    })
  })
})


afterAll(() => {
  mongoose.connection.close()
})