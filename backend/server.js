const express = require("express")
const Candidaterouter = require("./src/routes/candidate/candidateRoute")
require('dotenv').config()
require('./src/config/db')

const app = express()

const port = process.env.PORT || 7001

app.use('/api',Candidaterouter)

app.listen(port , () => {
    console.log(`Server is listening at port ${port}`);
})