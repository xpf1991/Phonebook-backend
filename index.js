require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Phone = require('./modules/phone')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (request, response) => {
    const body = request.body
    //console.log('body type: ', typeof(body), 'and body is: ', body)
    return JSON.stringify(body)
})

app.use(morgan(':method :url :status :res[content-length] :response-time :body'))

/*
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
*/

app.get('/info', (request, response) => {
    Phone.find({})
        .then(persons => {
            response.send(`
                <p>PhoneBook has info for ${persons.length} person</p>
                <p>${new Date()}</p>
            `)
        })
})

app.get('/api/persons', (request, response) => {
    Phone.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Phone.findById(id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Phone.findByIdAndDelete(request.params.id)
        .then(resulet => {
            response.status(204).end()
        })
        .catch(error => next(error))
    /*
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
    */
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Phone.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
        .then(updatedPhone => {
            response.json(updatedPhone)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    console.log('request body is: ', body)
    //console.log(persons.find(person => person.name === body.name))
    /*
    if (!body.name || !body.number || persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }
    */

    const person = new Phone({
        //id: id,
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error)

    if (error.name === 'CastError') {
        response.status(404).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        response.status(404).json(error.message)
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})