const express = require('express')
const { registerCandidate } = require('../../controllers/candidate/candidate_credentials')

const router = express.Router()

router.get('/register' , registerCandidate)

module.exports = router