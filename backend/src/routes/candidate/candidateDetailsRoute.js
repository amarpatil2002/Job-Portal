const express = require('express')
const verifyToken = require('../../middlewares/verifyToken')
const { createProfile, updateProfile, deleteProfile, getProfile } = require('../../controllers/candidate/candidateProfileController')
const { uploadImage } = require('../../middlewares/multer/multer')
const { multerErrorHandler } = require('../../middlewares/multer/multerErrorHandler')

const router = express.Router()

// profile routes
router.post('/create-profile', verifyToken, multerErrorHandler(uploadImage.single('profileImage')), createProfile)
router.put('/update-profile', verifyToken, multerErrorHandler(uploadImage.single('profileImage')), updateProfile)
router.delete('/delete-profile', verifyToken, deleteProfile)
router.get('/get-profile', verifyToken, getProfile)

//personal detail route

module.exports = router