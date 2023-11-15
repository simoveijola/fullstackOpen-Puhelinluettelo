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

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    }).catch(error => {
        console.log(error)
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
    } /* else if (persons.map(p => p.name).includes(body.name)) {
        response.status(400).json({
            error: 'name must be unique',
        })
    }*/ else {
        // const id = Math.floor(Math.random() * 1000000)
        const person = new Person({
            name: body.name,
            number: body.number,
        })
        person.save().then(savedPerson => {
            response.json(savedPerson)
        })
    }
})

app.delete('api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
    }).catch(error => {
        next(error)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})