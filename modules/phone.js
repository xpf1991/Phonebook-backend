const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

mongoose.connect(url)
    .then((resulet)=>{
        console.log('mongodb connected')
    })
    .catch(error =>{
        console.log('error in connecting to mongoDB,', error.message)
    })

const phoneSchema = mongoose.Schema({
    name: String,
    number: String
})

phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Phone', phoneSchema)