require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Phone = require('./modules/phone')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (request, response)=>{
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
    response.send(`
        <p>PhoneBook has info for ${persons.length} person</p>
        <p>${new Date()}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    Phone.find({}).then(persons => {
        response.json(persons)
    })
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

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    //console.log(body.name)
    //console.log(persons.find(person => person.name === body.name))
    if (!body.name || !body.number || persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    //console.log('request body is: ', body)
    //const id = persons.length + Math.floor(Math.random() * 1000)
    //console.log('id is: ', id)
    const person = new Phone({
        //id: id,
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson=>{
        response.json(savedPerson)
    })
})

const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})