const express = require("express")
const cookieParser = require('cookie-parser')
require('dotenv').config()
require('./src/config/db')
const Candidaterouter = require("./src/routes/candidate/candidateRoute")
const authRoute = require('./src/routes/authRoute')


const app = express()
const port = process.env.PORT || 7001

app.use(express.json())
app.use(cookieParser())

app.use('/api' , authRoute)
app.use('/api',Candidaterouter)


app.listen(port , () => {
    console.log(`Server is listening at port ${port}`);
})