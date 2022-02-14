const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favouriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : blogs.reduce((result, current) => result.likes > current.likes ? result : current)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const map = new Map()
  for (const blog of blogs) {
    if (map.has(blog.author)) {
      map.set(blog.author, map.get(blog.author) + 1)
    } else {
      map.set(blog.author, 1)
    }
  }
  let authorWithMostBlogs = ''
  let maxBlogs = 0
  for (const entry of map) {
    if (entry[1] > maxBlogs) {
      authorWithMostBlogs = entry[0]
      maxBlogs = entry[1]
    }
  }
  return {
    author: authorWithMostBlogs,
    blogs: maxBlogs
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const map = new Map()
  for (const blog of blogs) {
    if (map.has(blog.author)) {
      map.set(blog.author, map.get(blog.author) + blog.likes)
    } else {
      map.set(blog.author, blog.likes)
    }
  }
  let authorWithMostLikes = ''
  let maxLikes = 0
  for (const entry of map) {
    if (entry[1] > maxLikes) {
      authorWithMostLikes = entry[0]
      maxLikes = entry[1]
    }
  }
  return {
    author: authorWithMostLikes,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}