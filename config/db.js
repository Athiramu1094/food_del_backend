const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        //await mongoose.connect(process.env.DB_URL);
        await mongoose.connect('mongodb+srv://krishna6athi:EDH29KArNCHPTzB7@cluster0.kyzop.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        console.log("Connected successfully");
    } catch (err) {
        console.error("Connection error", err);
    }
}

module.exports = connectDB;
