const express = require("express")
const { registerController, loginController, forgotPasswordController, resetPasswordController, logoutController, refreshTokenController, getData, verfyUserController, resendVerifyOTP } = require("../controllers/AuthController")
const verifyToken = require("../middlewares/verifyToken")
const { validate } = require("../middlewares/validators")
const { registerSchema, loginSchema } = require("../validators/authValidators")


const router = express.Router()

router.post('/auth/register', validate(registerSchema), registerController)
router.post('/auth/verify-user' , verfyUserController)
router.post('/auth/resend-verify-otp',resendVerifyOTP)
router.post('/auth/login',validate(loginSchema), loginController)
router.post('/auth/refresh-token', refreshTokenController)

router.post('/auth/forgot-password', forgotPasswordController)
router.post('/auth/reset-password', resetPasswordController)

router.get('/getdata', verifyToken, getData)
router.post('logout', verifyToken, logoutController)


module.exports = router