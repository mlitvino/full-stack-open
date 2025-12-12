const mongoose = require(`mongoose`)

mongoose.set(`strictQuery`, false)
mongoose.set('runValidators', true)

const url = process.env.MONGODB_URL

console.log(`connecting to `, url)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log(`connected to MongoDB`)
  })
  .catch(error => {
    console.log(`error connecting to MongoDB:`, error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 1,
  },
  number: {
    type: String,
    minLength: 2,
    validate: {
      validator: (value) => {
        return /\d{2,3}-\d{6,}/.test(value)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, "User phone number required"]
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model(`Person`, personSchema)
