require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
const errorHandler = require('./middlewares/errorHandler')
const app = express()
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', function getId (req) {
  return JSON.stringify(req.body);
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
//   return [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     tokens.status(req, res),
//     tokens.res(req, res, 'content-length'), '-',
//     tokens['response-time'](req, res), 'ms',
//     JSON.stringify(req.body),
//   ].join(' ')
// }))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/info', (req, res) => {
  Person.find({}).then(result => {
    const content = `<h3>Phonebook has info for ${result.length} people</h3>`;
    const date = `<h3>${new Date()}</h3>`
    res.send(content + date);
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => {
    res.json(result)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        console.log('id not found')
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => console.log(error))
})

function getRandomId() {
  return Math.floor(Math.random() * 1000)
}

app.post('/api/persons', (request, response) => {
  const {name, number} = request.body
  if (name && number && !persons.find(person => person.name == name)) {
    const person = new Person({
      name,
      number
    })
    person.save().then(result => {
      response.json(result)
    })
  } else {
    response.status(400).json({error: 'name must be unique'})
  }
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body
  const person = {
    name,
    number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler.invalidId)
app.use(errorHandler.unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})