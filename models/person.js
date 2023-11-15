const mongoose = require('mongoose')
/*

if (process.argv.length < 3) {
    console.log("no password given")
    process.exit(1)
} else if (process.argv.length > 5) {
    console.log("too many arguments")
    process.exit(1)
} else if (process.argv.length === 4) {
    console.log("please provide the password and optionally both the name and the number of the person to be added")
    process.exit(1)
}
*/
const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)

console.log('connecting to the database')

mongoose.connect(url).then(result => {
    console.log('connected to the database')
}).catch(error => {
    console.log(`error connecting to the database: ${error}`)
})

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)

/*
if (process.argv.length === 3) {
    console.log("phonebook:")
    Person.find({}).then(res => {
        res.forEach(person => console.log(person.name, person.number))
        mongoose.connection.close()
    })
} else if (process.argv.length < 6) {
    const person = new Person({
        id: Math.floor(Math.random() * 1000000),
        name: process.argv[3],
        number: process.argv[4],
    })
    person.save().then(res => {
        console.log(`Added ${person.name} number ${person.number} to the phonebook`)
        mongoose.connection.close()
    })
}
*/
