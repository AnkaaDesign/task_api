const express = require('express')

const app = express()

require('dotenv').config();

app.use(express.json())

const connectDB = require('./connectMongo')

connectDB()

const BookModel = require('./models/book.model')

app.get('/', async (req, res) => {
    res.status(200).json({
        msg: "Hi"
    })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
})

app.post('/api/v1/books', async (req, res) => {
    try {
        const { name, author, price, description } = req.body
        const book = new BookModel({
            name, author, price, description
        })
        const data = await book.save()
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

