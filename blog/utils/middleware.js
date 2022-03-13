const jwt = require('jsonwebtoken')
const User = require('../models/user')

const unknownEndpoint = (request, response) => {
  response
    .status(404)
    .send({error: 'unknow endpoint'})
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response
      .status(400)
      .send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response
      .status(400)
      .send({error: error.message})
  } else if (error.name === 'JsonWebTokenError') {
    return response
      .status(401)
      .send({error: 'invalid token'})
  }
  next(error)
}

const tokenExtractor = (request, response, next) => {
  let token = null;
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.slice(7)
  }
  request.token = token;
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }
  const user = await User.findById(decodedToken.id)
  request.user = user
  console.log(user)
  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}