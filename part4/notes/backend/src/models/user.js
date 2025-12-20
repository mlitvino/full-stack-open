const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnendObject) => {
    returnendObject.id = returnendObject._id.toString()
    delete returnendObject._id
    delete returnendObject._v
    delete returnendObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
