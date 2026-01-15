const express = require('express')
const { addEducation, updateEducation, getEducation, deleteEducation, getAllEducation, addCertificate } = require('../../controllers/candidate/candidateEducationController')
const verifyToken = require('../../middlewares/verifyToken')
const { validate } = require('../../middlewares/validators')
const { candidateUpdateQualification, candidateAddQualification } = require('../../validators/candidate/candidateDetailsValidators')

const router = express.Router()

router.post('/education-details/qualification', verifyToken, validate(candidateAddQualification), addEducation)
router.patch('/education-details/qualification/:qualificationId', verifyToken, validate(candidateUpdateQualification), updateEducation)
router.delete('/education-details/qualification/:qualificationId', verifyToken, deleteEducation)
router.get('/education-details/qualification/:qualificationId', verifyToken, getEducation)
router.get('/education-details/qualification', verifyToken, getAllEducation)

router.post('/education-details/certificate', verifyToken, addCertificate)
router.patch('/education-details/certificate/:certificateId', verifyToken, addCertificate)
router.delete('/education-details/certificate/:certificateId', verifyToken, addCertificate)
router.get('/education-details/certificate', verifyToken, addCertificate)



module.exports = router