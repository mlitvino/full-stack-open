const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = 3001

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
  if (persons) {
    response.json(persons)
  } else {
    response.status(404).end()
  }
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
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

const generateId = () => {
  // const maxId = persons.length > 0
  //   ? Math.max(...persons.map(n => Number(n.id)))
  //   : 0
  const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  return String(id)
}

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

  const newPerson = {
    name: body.name,
    number: body.number,
    important: body.important || false,
    id: generateId(),
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
