const mongoose = require('mongoose')

const password = process.argv[2]

const url =`mongodb+srv://anttiastikainen:${password}@cluster0.mfhdgnh.mongodb.net/phonebook?retryWrites=true&w=majority`

const name = process.argv[3]

const number = process.argv[4]


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose.set('strictQuery', false)

if(name!=undefined && number!=undefined){
    mongoose.connect(url)

    console.log(`adding new information ${name} and ${number}`)
    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()

    })
}
else
{
    console.log("reading database...")
 //   const Person = mongoose.model('Person', personSchema)
    mongoose.connect(url)
    Person.find({}).then(result => {
console.log(`phonebook:`)
        result.forEach(person => {
           console.log( person.name +` `+ person.number)
        })
        mongoose.connection.close()
    })
}
