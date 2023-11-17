const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url).then(result => {
    console.log('connected to the database')
}).catch(error => {
    console.log(`error connecting to the database: ${error.message}`)
})

const personSchema = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function (v) {
                return /\d{2,3}-\d{1,8}/.test(v)
            },
            message: "Incorrect number format. Accepted formats: xx-yyyyyy... and xxx-yyyyy..."
        },
        required: true,
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
