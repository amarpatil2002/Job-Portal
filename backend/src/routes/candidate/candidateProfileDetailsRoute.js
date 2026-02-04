const express = require('express')
const verifyToken = require('../../middlewares/verifyToken')
const { multerProfileImageHandler } = require('../../middlewares/multer/multerHandle')
const { validate } = require('../../middlewares/validators')
const {
    createProfile,
    updateProfile,
    deleteProfileImage,
    getProfile } = require('../../controllers/candidate/candidateProfileController')
const {
    getBasicInfo,
    updateBasicInfo,
    getContactInfo,
    updateContactInfo,
    getIdentityInfo,
    updateIdentityInfo } = require('../../controllers/candidate/candidatePersonalDetailsController')
const {
    candidatContactInfo,
    candidatIdentityInfo,
    candidatebasicInfoupdate } = require('../../validators/candidate/candidateDetailsValidators')

const router = express.Router()

// profile routes for image & summary
// router.post('/create-profile', verifyToken, multerProfileImageHandler, createProfile)
router.get('/get-profile', verifyToken, getProfile)
router.put('/update-profile', verifyToken, multerProfileImageHandler, updateProfile)
router.delete('/delete-profile-image', verifyToken, deleteProfileImage)

// BASIC INFO
router.get('/personal-details/basic', verifyToken, getBasicInfo)
router.patch('/personal-details/basic', verifyToken, validate(candidatebasicInfoupdate), updateBasicInfo)

// CONTACT INFO
router.get('/personal-details/contact', verifyToken, getContactInfo)
router.patch('/personal-details/contact', verifyToken, validate(candidatContactInfo), updateContactInfo)

// IDENTITY INFO (Sensitive)
router.get('/personal-details/identity', verifyToken, getIdentityInfo)
router.patch('/personal-details/identity', verifyToken, validate(candidatIdentityInfo), updateIdentityInfo)


module.exports = router