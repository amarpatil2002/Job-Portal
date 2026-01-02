const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        // await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`)
        await mongoose.connect(`${process.env.ATLAS_URL}`)
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database not connected : " , error);
    }   
}

module.exports = connectDB()