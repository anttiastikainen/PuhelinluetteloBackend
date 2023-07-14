require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

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

app.get('/api/persons', morgan(tinyFormat), (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
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

app.get('/api/persons/:id', morgan(tinyFormat),(request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id',morgan(tinyFormat), (request, response, next) => {
   Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))

})

/*
// need to redo this since not using hardcoded persons anymore
const isDuplicateName = (name) => {
    for(let i = 0;i<persons.length;i++)
    {
        if(persons[i].name === {name}.name) return true;
    }
    return false;

}
*/
const generateId = () => {
    return Math.floor(Math.random() *100000 )
}

app.post('/api/persons',morgan(postFormat), (request, response) => {
    const body = request.body

    if(body.name === undefined) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if(body.number === undefined) {
        return response.status(400).json({
            error: 'number missing'
        })
    } 
    /*
        if(isDuplicateName(body.name)) {
            return response.status(400).json({
                error: 'name must be unique'
            })
        }*/ 
        const person = new Person( {
            name: body.name,
            number: body.number,
            id: generateId(),
        })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

