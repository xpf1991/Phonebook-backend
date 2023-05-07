const mongoose = require('mongoose')

/*
if (process.argv.length<3) {
    console.log("Please provide the password at least")
    process.exit(1)
}

const password = process.argv[2]
const url = 
    `mongodb+srv://power:${password}@cluster0.g66fyys.mongodb.net/phoneBookApp?retryWrites=true&w=majority`
*/

const url = process.env.MONGODB_URL

console.log('connecting to ', url)

mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Phone = mongoose.model('Phone', phoneSchema)

if (process.argv.length === 3) {
    console.log('PhoneBook')
    Phone.find({}).then(result => {
        result.forEach(phone => {
            console.log(`${phone.name} ${phone.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    const phone = new Phone({
        name: process.argv[3],
        number: process.argv[4]
    })

    phone.save().then(result => {
        console.log(`added ${phone.name} number ${phone.number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log("Please provide the correct length of parameters")
    process.exit(1)
}