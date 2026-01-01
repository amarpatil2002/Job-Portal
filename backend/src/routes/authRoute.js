const express = require("express")
const { registerController, loginController, forgotPasswordController, resetPasswordController, logoutController } = require("../controllers/AuthController")

const router = express.Router()

router.post('/auth/register' , registerController)
router.post('/auth/login' , loginController)
router.post('/auth/refresh-token' , registerController )

router.post('/auth/forgot-password' , forgotPasswordController)
router.post('/auth/reset-password' , resetPasswordController)

router.post('logout' , verifyToken,  logoutController)


module.exports = router