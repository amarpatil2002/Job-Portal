const userModel = require("../models/commonAuthModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require("mongoose")
const companyModel = require("../models/companyModel/companyModel")
const candidateModel = require("../models/candidateModel/candidateModel")
const passwordResetModel = require("../models/passwordResetModel")
const { setResetOtpEmail, veriyUserEmail } = require("../services/sendEmailService")
const { pendingUserModel } = require("../models/pendingUserModel")


exports.registerController = async (req, res) => {
    const session = await mongoose.startSession()

    try {
        // console.log(req.body);
        const { email, password, confirmPassword, role, companyName } = req.body

        if (!email || !password || !confirmPassword || !role) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        if (!['candidate', 'company'].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role selected" })
        }

        if (role === "company" && !companyName) {
            return res.status(400).json({ success: false, message: "Company name is required" })
        }

        const emailExists = await userModel.findOne({ email })
        // console.log(emailExists);

        if (emailExists) {
            return res.status(400).json({ success: false, message: "Email already registered" })
        }

        session.startTransaction()
        //delete all pending user
        await pendingUserModel.deleteMany({ email }).session(session)

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        //verify user
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const hashedOTP = await bcrypt.hash(otp, 10)
        const otpExpiresAt = new Date(Date.now() + Number(process.env.OTP_EXPIRATION_MINUTES) * 60 * 1000)

        // cleanup the database every certain time like - 2 min
        const pendingUserCleanupsAt = new Date(Date.now() + 5 * 60 * 1000)

        await pendingUserModel.findOneAndUpdate(
            { email },
            {
                email,
                password: hashedPassword,
                role,
                companyName,
                otp: hashedOTP,
                otpExpiresAt: otpExpiresAt,
                pendingUserCleanupsAt: pendingUserCleanupsAt,
            },
            { upsert: true, new: true, session }
        )

        await session.commitTransaction()
        session.endSession()

        await veriyUserEmail({ email, otp })

        res.status(200).json({ success: true, message: "verification email sent" })

    } catch (error) {
        await session.abortTransaction()
        session.endSession()

        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.verfyUserController = async (req, res) => {

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { email, otp } = req.body
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const pendingUser = await pendingUserModel.findOne({ email }).sort({ createdAt: -1 }).session(session)
        if (!pendingUser) {
            return res.status(400).json({ success: false, message: "OTP expired or invalid" })
        }

        if (new Date() > pendingUser.otpExpiresAt) {
            return res.status(400).json({ success: false, message: "OTP expired" })
        }

        const isvalidOTP = await bcrypt.compare(otp, pendingUser.otp)
        if (!isvalidOTP) {
            return res.status(400).json({ success: false, message: "Invalid OTP" })
        }

        // prevent duplicate users
        const alreadyVerifiedUser = await userModel.findOne({ email }).session(session);
        if (alreadyVerifiedUser) {
            return res.status(409).json({ message: "User already verified" });
        }

        const user = await userModel.create([{
            email: pendingUser.email,
            password: pendingUser.password,
            role: pendingUser.role,
            isVerifedUser: true
        }],
            { session }
        )

        if (pendingUser.role === "candidate") {
            const candidate = await candidateModel.create([{
                userId: user[0]._id
            }],
                { session }
            )
            await candidate[0].save()
        }

        if (pendingUser.role === "company") {
            if (!pendingUser.companyName) {
                // throw new Error("Company name required")
                return res.status(400).json({ success: false, message: "Company name is required for company registration", });
            }
            const company = await companyModel.create(
                [{
                    companyName: pendingUser.companyName,
                    createdBy: user[0]._id
                }],
                { session }
            )

            user[0].companyId = company[0]._id
            await user[0].save({ session })
        }

        await pendingUserModel.deleteMany({ email }, { session })

        await session.commitTransaction()
        session.endSession()

        res.status(201).json({ success: true, message: "Registration completed successfully", })

    } catch (error) {

        await session.abortTransaction()
        session.endSession()

        console.log(error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" })
    }
}

exports.resendVerifyOTP = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" })
        }

        const pendingUser = await pendingUserModel.findOne({ email })
        // console.log(pendingUser);
        if (!pendingUser) {
            return res.status(400).json({ success: false, message: "Session Expired , Please try after some time" })
        }

        if (pendingUser.resendCount > 2) {
            return res.status(429).json({ success: false, message: "OTP resend limit reached,Please try agian later" })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const hashedOTP = await bcrypt.hash(otp, 10)
        const expiryMinutes = Number(process.env.OTP_EXPIRATION_MINUTES) || 2
        const expiresOTP = new Date(Date.now() + expiryMinutes * 60 * 1000)
        const cleanupsAt = new Date(Date.now() + 5 * 60 * 1000)

        pendingUser.otp = hashedOTP
        pendingUser.otpExpiresAt = expiresOTP
        pendingUser.pendingUserCleanupsAt = cleanupsAt
        pendingUser.resendCount += 1

        await pendingUser.save()

        await veriyUserEmail({ otp, email })

        return res.status(200).json({ success: true, message: "OTP resent successfully" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const userExists = await userModel.findOne({ email })

        if (!userExists) {
            return res.status(401).json({ success: false, message: "Email not registered" })
        }

        const isMatchPassword = await bcrypt.compare(password, userExists.password)
        if (!isMatchPassword) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        const user = {
            id: userExists._id,
            email: userExists.email,
            role: userExists.role
        }

        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION })
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION })

        userExists.refreshToken = refreshToken
        await userExists.save()

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/"
        })
        res.status(200).json({ success: true, message: "Login successfull", accessToken, user })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.refreshTokenController = async (req, res) => {
    try {
        // console.log(req.cookies);
        const token = req.cookies?.refreshToken

        if (!token) {
            return res.status(401).json({ success: false, message: "Refresh token missing" })
        }

        // console.log(token);
        const tokenExistsInDB = await userModel.findOne({ refreshToken: token })
        // console.log(tokenExistsInDB);
        if (!tokenExistsInDB) {
            return res.status(401).json({ success: false, message: "Invalid refresh token" })
        }

        await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (error, decode) => {
            if (error) {
                tokenExistsInDB.refreshToken = null
                await tokenExistsInDB.save()

                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'lax',
                    path: '/'
                })

                return res.status(401).json({ success: false, message: "Expired refresh token" })
            }

            const newAccessToken = await jwt.sign({ id: decode.id, email: decode.email, role: decode.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION })
            return res.status(200).json({ success: true, message: "success", accessToken: newAccessToken })
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" })
        }

        const userExists = await userModel.findOne({ email })

        if (!userExists) {
            return res.status(400).json({ success: false, message: "If the email exists, an OTP has been sent" })
        }

        //  Remove old reset requests
        await passwordResetModel.deleteMany({ userId: userExists._id });

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const hashedOTP = await bcrypt.hash(otp, 10)
        const expiryMinutes = Number(process.env.OTP_EXPIRATION_MINUTES) || 2
        const expiresOTP = new Date(Date.now() + expiryMinutes * 60 * 1000)

        await passwordResetModel.create(
            {
                userId: userExists._id,
                otp: hashedOTP,
                expiresOTP: expiresOTP,
            }
        )

        await setResetOtpEmail({ email, otp })

        res.status(200).json({ success: true, message: "OTP sent successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.otpResendPasswordController = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" })
        }

        const userExists = await userModel.findOne({ email })

        if (!userExists) {
            return res.status(400).json({ success: false, message: "If the email exists, an OTP has been sent" })
        }
        // console.log(userExists);
        const resetPasswordUser = await passwordResetModel.findOne({ userId: userExists._id })
        // console.log(resetPasswordUser);

        if (resetPasswordUser.resendCount > 2) {
            return res.status(429).json({ success: false, message: "OTP resend limit reached,Please try agian later" })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const hashedOTP = await bcrypt.hash(otp, 10)
        const expiryMinutes = Number(process.env.OTP_EXPIRATION_MINUTES) || 2
        const expiresOTP = new Date(Date.now() + expiryMinutes * 60 * 1000)

        resetPasswordUser.otp = hashedOTP,
            resetPasswordUser.expiresOTP = expiresOTP,
            resetPasswordUser.resendCount += 1

        await setResetOtpEmail({ otp, email })

        await resetPasswordUser.save()

        return res.status(200).json({ success: true, message: "OTP resent successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.resetPasswordController = async (req, res) => {
    try {
        const { email, otp, password, confirmPassword } = req.body

        if (!email || !otp || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid OTP or expired" })
        }

        const resetPasswordDoc = await passwordResetModel.findOne({ userId: user._id })
        if (!resetPasswordDoc) {
            return res.status(400).json({ success: false, message: "OTP expired or Invalid" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Password do not match" })
        }

        // console.log(new Date());
        // console.log(resetPasswordDoc.expiresOTP);
        if (new Date() > resetPasswordDoc.expiresOTP) {
            return res.status(400).json({ success: false, message: "OTP expired" })
        }

        const isMatchOTP = await bcrypt.compare(otp, resetPasswordDoc.otp)
        if (!isMatchOTP) {
            return res.status(400).json({ success: false, message: "Invalid OTP" })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        user.password = hashedPassword
        await user.save()

        await passwordResetModel.deleteMany({ userId: user._id })

        return res.status(200).json({ success: true, message: "Password changed successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.logoutController = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken
        // console.log(token);
        if (!token) {
            return res.status(200).json({ success: true, message: "Logged out successfully" })
        }

        //
        // const user = await userModel.findOne({refreshToken:token})
        // console.log(user);
        // if(!user){
        //     return res.status(400).json({success:false,message:"Invalid or Expired refresh token"})
        // }

        await userModel.findOneAndUpdate(
            { refreshToken: token },
            { $unset: { refreshToken: "" } }
        )

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/'
        })

        res.status(200).json({ success: true, message: "Logged out successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })

    }
}

exports.getUser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await userModel.findById(userId).select("_id role email")
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        return res.status(200).json({ success: true, message: "Data fetched successfully", user })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }

}



