const mongoose = require("mongoose")

const argv = process.argv

if (argv.length < 3) {
  console.log("please give password to the database")
  process.exit(1)
} else if (argv.length === 4) {
  console.log("please provide either only the password of the database to read the contents \nor the password with both the name and the number of the person to be added to the database")
  process.exit(1)
} else if (argv.length > 5) {
  console.log("too many arguments")
  process.exit(1)
}

const password = argv[2]
const url = `mongodb+srv://simoveijola:${password}@cluster0.fpqthvb.mongodb.net/?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model("Person", personSchema)

if (argv.length === 3) {
  console.log("phonebook:")
  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {
  // const id = Math.floor(Math.random() * 1000000)
  const newPerson = new Person({
    name: argv[3],
    number: argv[4],
  })
  newPerson.save().then(() => {
    console.log(`added ${newPerson.name} number ${newPerson.number} to the phonebook`)
    mongoose.connection.close()
  })
}

