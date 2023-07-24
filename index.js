const express = require('express')

const app = express()

require('dotenv').config();

app.use(express.json())

const connectDB = require('./connectMongo')

connectDB()

const TaskModel = require('./models/Task')

app.get('/', async (req, res) => {
    res.status(200).json({
        msg: "Hi"
    })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
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
        const { name, author, price, description } = req.body
        const { id } = req.params

        const data = await TaskModel.findByIdAndUpdate(id, {
            name, serialNumber, entryDate, departureDate, status, team
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

