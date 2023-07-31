const express = require('express')
var cors = require('cors')
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express()

app.use(bodyParser.json());
app.use(cors())
app.use(express.json())

const connectDB = require('./connectMongo')

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

connectDB()

const TaskModel = require('./models/Task')

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
})

app.get('/api/task', async (req, res) => {
    try {
        const task = await TaskModel.find()
        res.status(200).json(task);

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
})

app.post('/api/task', async (req, res) => {
    try {
        const { name, serialNumber, entryDate, departureDate, status, team } = req.body
        const task = new TaskModel({
            name, serialNumber, entryDate, departureDate, status, team
        })
        const data = await task.save()
        return res.status(200).json({
            msg: 'Ok',
            data
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
})
app.put('/api/task/:id', async (req, res) => {
    try {
        const { name, serialNumber, entryDate, departureDate, status, team, finishedTime } = req.body
        const { id } = req.params

        const data = await TaskModel.findByIdAndUpdate(id, {
            name, serialNumber, entryDate, departureDate, status, team, finishedTime
        }, { new: true })

        return res.status(200).json({
            msg: 'Ok',
            data
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
})

app.delete('/api/TASK/:id', async (req, res) => {
    try {
        await TaskModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            msg: 'Ok',
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
})

