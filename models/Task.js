const mongoose = require('mongoose')
const { Schema } = mongoose

const taskSchema = new Schema({
  name: String,
  serialNumber: String,
  entryDate: String,
  departureDate: String,
  status: Number,
  team: String,
  finishedTime: String,
  startedTime: String
})

module.exports = mongoose.model('Task', taskSchema)


