const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

mongoose.connect(url)
    .then(() => {
        console.log('mongodb connected')
    })
    .catch(error => {
        console.log('error in connecting to mongoDB,', error.message)
    })

const phoneSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    number: {
        type: String,
        validate: {
            validator: function (v) {
                return /\d{2,3}-\d{1,}/.test(v)
            },
            message: props => `${props.value} is not a valid phone number`,
        },
        required: [true, 'user number required']
    }
})

phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Phone', phoneSchema)