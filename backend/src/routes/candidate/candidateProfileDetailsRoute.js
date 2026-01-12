const express = require('express')
const verifyToken = require('../../middlewares/verifyToken')
const { uploadImage } = require('../../middlewares/multer/multer')
const { multerErrorHandler } = require('../../middlewares/multer/multerErrorHandler')
const { validate } = require('../../middlewares/validators')
const {
    createProfile,
    updateProfile,
    deleteProfileImage,
    getProfile } = require('../../controllers/candidate/candidateProfileController')
const { createBasicInfo,
    getBasicInfo,
    updateBasicInfo,
    getContactInfo,
    updateContactInfo,
    getIdentityInfo,
    updateIdentityInfo } = require('../../controllers/candidate/candidatePersonalDetailsController')
const { candidatebasicInfo,
    candidatContactInfo,
    candidatIdentityInfo,
    candidatebasicInfoupdate } = require('../../validators/candidateValidators')

const router = express.Router()

// profile routes for image & summary
router.post('/create-profile', verifyToken, multerErrorHandler(uploadImage.single('profileImage')), createProfile)
router.get('/get-profile', verifyToken, getProfile)
router.put('/update-profile', verifyToken, multerErrorHandler(uploadImage.single('profileImage')), updateProfile)
router.delete('/delete-profile-image', verifyToken, deleteProfileImage)


// BASIC INFO
router.post('/personal-details/basic', validate(candidatebasicInfo), verifyToken, createBasicInfo)
router.get('/personal-details/basic', verifyToken, getBasicInfo)
router.patch('/personal-details/basic', validate(candidatebasicInfoupdate), verifyToken, updateBasicInfo)

// CONTACT INFO
router.get('/personal-details/contact', verifyToken, getContactInfo)
router.patch('/personal-details/contact', validate(candidatContactInfo), verifyToken, updateContactInfo)

// IDENTITY INFO (Sensitive)
router.get('/personal-details/identity', verifyToken, getIdentityInfo)
router.patch('/personal-details/identity', validate(candidatIdentityInfo), verifyToken, updateIdentityInfo)


module.exports = router