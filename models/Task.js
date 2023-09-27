const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema({
  name: String,
  serialNumber: String,
  entryDate: Date,
  departureDate: Date,
  status: Number,
  team: String,
  finishedTime: Date,
  startedTime: Date,
});

module.exports = mongoose.model("Task", taskSchema);
