const Blog = require('../models/blog')

const initialBlogs = [
  {
    "title": "test-title-1",
    "author": "test-author-1",
    "url": "test-url-1",
    "likes": 0
  },
  {
    "title": "test-title-2",
    "author": "test-author-2",
    "url": "test-url-2",
    "likes": 0
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
}