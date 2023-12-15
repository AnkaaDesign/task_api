const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema({
  name: String,
  serialNumber: String,
  team: String,
  color: Object,
  status: Number,
  departureDate: Date,
  entryDate: Date,
  finishedTime: Date,
  startedTime: Date,
});

module.exports = mongoose.model("Task", taskSchema);
