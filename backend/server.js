const express = require("express")
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()
require('./src/config/db')
const candidateDetailsRouter = require("./src/routes/candidate/candidateDetailsRoute")
const authRoute = require('./src/routes/authRoute')


const app = express()
const port = process.env.PORT || 7001

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))                                             // enables cross-origin requests
app.use(express.urlencoded({ extended: true })) // parse form data
app.use(express.json())                         // parses JSON requests
app.use(cookieParser())                         //used for reads cookie

app.use('/api', authRoute)
app.use('/api', candidateDetailsRouter)


app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
})