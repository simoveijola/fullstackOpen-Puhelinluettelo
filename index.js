require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.json())

app.use(express.static('dist'))

morgan.token('body', (req, res) => {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const date = new Date()
    Person.find({}).then(persons => {
        response.write(`<p>Phonebook has info for ${persons.length} people</p>`)
        response.write(`${date}`)
        response.send()
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    }).catch(error => {
        next(error)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        response.status(400).json({
            error: 'name missing',
        })
    } else if (!body.number) {
        response.status(400).json({
            error: 'number missing',
        })
    } else {
        const person = new Person({
            name: body.name,
            number: body.number,
        })
        person.save().then(savedPerson => {
            response.json(savedPerson)
        })
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number,
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true }).then(updatedPerson => {
        response.json(updatedPerson)
    }).catch(error => {
        next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
    }).catch(error => {
        next(error)
    })
})

const errorHandler = (error, request, response, next) => {
    console.log(error)
    if (error.name === 'CastError') {
        response.status(400).send({error: 'malformatted id'})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})