const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./blog_api_test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  for (const blog of helper.initialBlogs) {
    const blogObj = new Blog(blog);
    await blogObj.save()
  }
}, 100000)

afterAll(() => {
  mongoose.connection.close()
})

test('should return all blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
}, 100000)

test('should have id property', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
}, 100000)

test('should have one more blog', async () => {
  const blogObj = {
    "title": "test-title-3",
    "author": "test-author-3",
    "url": "test-url-3",
    "likes": 0
  }
  await api
    .post('/api/blogs')
    .send(blogObj)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await helper.blogsInDb()
  expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
  
  const blogTitles = blogs.map(blog => blog.title)
  expect(blogTitles).toContain('test-title-3')
}, 100000)

test('should set like property to 0', async () => {
  const blogObj = {
    "title": "test-title-3",
    "author": "test-author-3",
    "url": "test-url-3",
  }
  await api
    .post('/api/blogs')
    .send(blogObj)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await helper.blogsInDb()
  const latestBlog = blogs.find(blog => blog.title === blogObj.title)
  expect(latestBlog.likes).toBe(0)
}, 100000)

test('should response status 400 if no title and url', async () => {
  const blogObj = {
    "author": "test-author-3",
    'likes': 0
  }
  await api
    .post('/api/blogs')
    .send(blogObj)
    .expect(400)
  
  const blogs = await helper.blogsInDb()
  expect(blogs).toHaveLength(helper.initialBlogs.length)
}, 100000)

test('should delete a blog', async () => {
  const blogs = await helper.blogsInDb()
  const blogToDelete = blogs[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const currentBlogs = await helper.blogsInDb()
  expect(currentBlogs).toHaveLength(helper.initialBlogs.length - 1)

  const blogTitles = currentBlogs.map(blog => blog.title)
  expect(blogTitles).not.toContain(blogToDelete.title)
})

test('should update likes to 1', async () => {
  const blogs = await helper.blogsInDb()
  const newBlog = {
    title: blogs[0].title,
    author: blogs[0].author,
    url: blogs[0].url,
    likes: blogs[0].likes + 1,
  }
  await api
    .put(`/api/blogs/${blogs[0].id}`)
    .send(newBlog)
  const newBlogs = await helper.blogsInDb()
  const updatedBlog = newBlogs.find(blog => blog.id === blogs[0].id)
  expect(updatedBlog.likes).toBe(blogs[0].likes + 1)
})