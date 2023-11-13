const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())

app.use(express.static('dist'))

morgan.token('body', (req,res) => {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
    response.send()
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.write(`<p>Phonebook has info for ${persons.length} people</p>`)
    response.write(`${date}`)
    response.send()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id == id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    //console.log(person)
    if (!person.name) {
        response.status(400).json({
            error: 'name missing',
        })
    } else if (!person.number) {
        response.status(400).json({
            error: 'number missing',
        })
    } else if (persons.map(p => p.name).includes(person.name)) {
        response.status(400).json({
            error: 'name must be unique',
        })
    } else {
        const id = Math.floor(Math.random() * 1000000)
        const newPerson = {
            id: id,
            name: person.name,
            number: person.number
        }
        persons = persons.concat(newPerson)
        response.json(newPerson)
    }
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})