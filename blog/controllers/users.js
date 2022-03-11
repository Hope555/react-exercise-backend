const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', {title: 1, author: 1, url: 1, likes: 1})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const {username, name, password} = request.body
  if (password.length >= 3) {
    const saltRounds = bcryptjs.genSaltSync(10)
    const passwordHash = await bcryptjs.hashSync(password, saltRounds)
    const user = new User({
      username,
      name,
      passwordHash
    })
  
    const savedUser = await user.save()
  
    response.json(savedUser)
  } else {
    return response.status(400).json({
      error: 'password length should not less than 3'
    })
  }
})

module.exports = usersRouter