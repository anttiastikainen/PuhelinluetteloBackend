const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

//get rid of unecessary information of :url
morgan.token('pathname', (request) => {
    return request.url
})

morgan.token('body', (request) => {
        return JSON.stringify(request.body);
})

morgan.token('path', (request) => {
  return request.path;
});

const tinyFormat = ':method :path :status :res[content-length] - :response-time ms'
const postFormat = ':method :path :status :res[content-length] - :response-time ms :body'

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    }, {
        id: 2,
        name: "Ada Lovelace",
        number: "29-44-5323523"
    }, {
        id: 3,
        name: "Dan Abramov",
        number: "12-45-233445"
    } , {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', morgan(tinyFormat), (request, response) => {
    response.json(persons)
})

const infoResponse = () => {
    const infoCount = persons.length
    const currentTime = new Date()

    return(
        `Phonebook has info for ${infoCount} people\n\n${currentTime}`)
}

app.get('/info', morgan(tinyFormat), (request, response) => {
    response.end(infoResponse()
    )})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get('/api/persons/:id', morgan(tinyFormat),(request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id',morgan(tinyFormat), (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !==id)

    response.status(204).end()

})

const isDuplicateName = (name) => {
    for(let i = 0;i<persons.length;i++)
    {
        if(persons[i].name === {name}.name) return true;
    }
    return false;

}

const generateId = () => {
    return Math.floor(Math.random() *100000 )
}

app.post('/api/persons',morgan(postFormat), (request, response) => {
    const body = request.body

    if(!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if(!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } 

    if(isDuplicateName(body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    } 
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    response.json(person)
})

