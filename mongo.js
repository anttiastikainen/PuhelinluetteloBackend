const mongoose = require('mongoose')
const password = process.argv[2]

const url =`mongodb+srv://anttiastikainen:${password}@cluster0.mfhdgnh.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

    const name = process.argv[3]

    const number = process.argv[4]

    console.log(`adding new information ${name} and ${number}`)

    const personSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    const Person = mongoose.model('Person', personSchema)

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
/*
if (process.argv.length==2)
{
    const personSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    const Person = mongoose.model('Person', personSchema)

    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
    })
    
}
*/
