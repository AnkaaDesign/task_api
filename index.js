const express = require("express");
const moment = require("moment");
var cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const connectDB = require("./connectMongo");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

connectDB();

const TaskModel = require("./models/Task");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

app.get("/api/task", async (req, res) => {
  try {
    const task = await TaskModel.find();
    res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});

app.post("/api/task", async (req, res) => {
  try {
    const {
      name,
      serialNumber,
      entryDate,
      departureDate,
      status,
      team,
      color,
      startedTime,
    } = req.body;
    const task = new TaskModel({
      name,
      serialNumber,
      entryDate,
      departureDate,
      status,
      team,
      color,
      startedTime,
    });
    await task.save();
    return res.status(200).json({
      result: "success",
    });
  } catch (error) {
    return res.status(500).json({
      result: "error",
    });
  }
});

app.put("/api/task/start/:id", async (req, res) => {
  const { team } = req.body;
  try {
    const { id } = req.params;

    await TaskModel.findByIdAndUpdate(id, {
      startedTime: new Date(),
      status: 2,
      team,
    });

    return res.status(200).json({
      result: "success",
    });
  } catch (error) {
    return res.status(500).json({
      result: "error",
    });
  }
});

app.put("/api/task/finish/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await TaskModel.findByIdAndUpdate(id, {
      finishedTime: new Date(),
      status: 3,
    });

    return res.status(200).json({
      result: "success",
    });
  } catch (error) {
    return res.status(500).json({
      result: "error",
    });
  }
});
app.put("/api/task/:id", async (req, res) => {
  try {
    const {
      name,
      serialNumber,
      entryDate,
      departureDate,
      status,
      color,
      team,
      finishedTime,
      startedTime,
    } = req.body;
    const { id } = req.params;

    const data = await TaskModel.findByIdAndUpdate(
      id,
      {
        name,
        serialNumber,
        entryDate,
        departureDate,
        status,
        color,
        team,
        finishedTime,
        startedTime,
      },
      { new: true }
    );

    return res.status(200).json({
      result: "success",
    });
  } catch (error) {
    return res.status(500).json({
      result: "error",
    });
  }
});

app.delete("/api/task/:id", async (req, res) => {
  try {
    await TaskModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      result: "success",
    });
  } catch (error) {
    return res.status(500).json({
      result: "error",
    });
  }
});

app.get("/api/task/:month", async (req, res) => {
  try {
    const { month } = req.params;
    const lastMonth = new Date();
    lastMonth.setMonth(month - 1);
    lastMonth.setDate(20);

    const givenMonth = new Date();
    givenMonth.setDate(20);
    givenMonth.setMonth(month);

    console.log(lastMonth);
    console.log(givenMonth);

    const count = await TaskModel.countDocuments({
      finishedTime: {
        $gte: lastMonth,
        $lt: givenMonth,
      },
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
