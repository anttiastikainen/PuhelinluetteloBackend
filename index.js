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
  return JSON.stringify(request.body)
})

morgan.token('path', (request) => {
  return request.path
})

const tinyFormat = ':method :path :status :res[content-length] - :response-time ms'
const postFormat = ':method :path :status :res[content-length] - :response-time ms :body'

app.get('/api/persons', morgan(tinyFormat), (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

const infoResponse = () => {
  return Person.countDocuments({})
    .then(infoCount => {
      const currentTime = new Date()
      return `Phonebook has info for ${infoCount} people\n\n${currentTime}`
    })
    .catch(() => {
      throw new Error( 'Error counting persons')
    })
}

app.get('/info', morgan(tinyFormat), (request, response, next) => {
  infoResponse()
    .then(info => {
      response.end(info)
    })
    .catch(error => {
      next(error)
    })
})

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
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id',morgan(postFormat), (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
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
/*
// generating id not necessary anymore
const generateId = () => {
  return Math.floor(Math.random() *100000 )
}
*/
app.post('/api/persons',morgan(postFormat), (request, response, next) => {
  const body = request.body
  /*
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

        if(isDuplicateName(body.name)) {
            return response.status(400).json({
                error: 'name must be unique'
            })
        }*/
  const person = new Person( {
    name: body.name,
    number: body.number,
    //id: generateId(),
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

