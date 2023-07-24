const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
const connectDB = async () => {
    mongoose.connect(process.env.MONGODB_CONNECT_URl, {

        useNewUrlParser: true,

        useUnifiedTopology: true

    }, err => {
        if (err) throw err;
        console.log('Connected to MongoDB!!!')
    });
}


module.exports = connectDB