const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`)
        // await mongoose.connect(`mongodb://localhost:27017/jihih`)
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database not connected : " , error);
    }   
}

module.exports = connectDB()