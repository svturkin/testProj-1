const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  phone: String,
  name: String
})

module.exports = mongoose.model('User', UserSchema)
