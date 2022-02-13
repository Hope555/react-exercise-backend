const errorHandler = {
  invalidId: (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
  },
  unknownEndpoint: (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
}

module.exports = errorHandler;