const express = require('express')
const { addEducation, updateEducation, getEducation, deleteEducation } = require('../../controllers/candidate/candidateEducationController')
const verifyToken = require('../../middlewares/verifyToken')
const { validate } = require('../../middlewares/validators')
const { candidateUpdateQualification, candidateAddQualification } = require('../../validators/candidate/candidateDetailsValidators')

const router = express.Router()

router.get('/education-details/qualification', verifyToken, getEducation)
router.post('/education-details/qualification', verifyToken, validate(candidateAddQualification), addEducation)
router.patch('/education-details/qualification/:qualificationId', verifyToken, validate(candidateUpdateQualification), updateEducation)
router.delete('/education-details/qualification/:qualificationId', verifyToken, deleteEducation)


module.exports = router