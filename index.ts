const express = require('express')
const morgan = require('morgan')
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
  const content = `<h3>Phonebook has info for ${persons.length} people</h3>`;
  const date = `<h3>${new Date()}</h3>`
  res.send(content + date);
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

function getRandomId() {
  return Math.floor(Math.random() * 1000)
}

app.post('/api/persons', (request, response) => {
  const {name, number} = request.body
  if (name && number && !persons.find(person => person.name == name)) {
    const person = {
      id: getRandomId(),
      name: name,
      number: number,
    }
    persons = persons.concat(person);
    response.json(person)
  } else {
    response.status(400).json({error: 'name must be unique'})
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})