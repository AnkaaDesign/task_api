const express = require("express");
const moment = require("moment");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

const connectDB = require("./connectMongo");

connectDB();

const TaskModel = require("./models/Task");

const PORT = process.env.PORT;

app.use(bodyParser.json());
const corsOptions = {
  origin: "https://ankaa-design.netlify.app/",
};

app.use(cors(corsOptions)); // Use this after the variable declaration

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

app.get("/api/task", async (req, res) => {
  try {
    const tasks = await TaskModel.find();
    res.status(200).json(tasks);
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
  try {
    const { id } = req.params;
    const { team } = req.body;

    await TaskModel.findByIdAndUpdate(id, {
      startedTime: startedTime,
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
      finishedTime: finishedTime,
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

    const updatedTask = await TaskModel.findByIdAndUpdate(
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

app.get("/api/task/:month/:team", async (req, res) => {
  try {
    const { month, team } = req.params;

    const lastMonth = moment()
      .month(month - 2)
      .date(20);
    const givenMonth = moment()
      .month(month - 1)
      .date(20);

    let query = {
      finishedTime: {
        $gte: lastMonth,
        $lt: givenMonth,
      },
    };

    if (team) {
      query.team = team;
    }

    const count = await TaskModel.countDocuments(query);

    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
