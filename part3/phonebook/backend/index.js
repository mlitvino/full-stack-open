require(`dotenv`).config()
const express = require('express')
const morgan = require('morgan')
const Person = require(`./models/person`)

const app = express()

let persons = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.use(express.static(`dist`))
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res),
    '\n---',
  ].join(' ')
}))

app.get('/info', (request, response) => {
  const size = persons.length
  const date = new Date()

  const res_body = `Phonebook has info for ${size} people\n\n${date}`

  response.end(res_body)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete(`/api/persons/:id`, (request, response) => {
  const id = request.params.id
  let isFound = false
  persons = persons.filter(person => {
    if (person.id !== id) {
      return true
    } else {
      isFound = true
      return false
    }
  })

  if (isFound) {
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  let error

  if (!body.name) {
    error = 'name missing'
  }
  else if (!body.number) {
    error = 'number missing'
  }

  const duplicate = persons.find(person => person.name === body.name)
  if (duplicate) {
    error = 'name already exists'
  }

  if (error) {
    return response.status(400).json({
      error: error
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
