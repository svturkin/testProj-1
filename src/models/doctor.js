const mongoose = require('mongoose')

const DoctorSchema = new mongoose.Schema({
  name: String,
  spec: String,
  slots: Array
})

module.exports = mongoose.model('Doctor', DoctorSchema)
