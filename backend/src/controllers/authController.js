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
    try {
        // console.log(req.body);
        const { email, password, confirmPassword, role, companyName } = req.body

        if (!email || !password || !confirmPassword || !role) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        if (!['candidate', 'company'].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role selected" })
        }

        const emailExists = await userModel.findOne({ email })
        // console.log(emailExists);

        if (emailExists) {
            return res.status(400).json({ success: false, message: "Email already registered" })
        }

        //delete all pending user
        await pendingUserModel.deleteMany({ email })

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        //verify user
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const hashedOTP = await bcrypt.hash(otp, 10)
        const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000)

        // cleanup the database every certain time like - 2 min
        const pendingUserCleanupsAt = new Date(Date.now() + 5 * 60 * 1000)

        const pendingUser = await pendingUserModel.findOneAndUpdate(
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
            { upsert: true, new: true }
        )

        await veriyUserEmail({ email, otp })

        res.status(200).json({ success: true, message: "Email sent for email verification" })

    } catch (error) {
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

        if (Date.now() > pendingUser.otpExpiresAt) {
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

        if (!pendingUser) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        if(pendingUser.resendCount > 3){
            return res.status(400).json({ success: false, message: "Re-send limit reached,Please try agian later" })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const hashedOTP = await bcrypt.hash(otp, 10)
        const expiresOTP = new Date(Date.now() + 1 * 60 * 1000)
        const cleanupsAt = new Date(Date.now() + 5 * 60 * 1000)

        pendingUser.otp = hashedOTP
        pendingUser.otpExpiresAt = expiresOTP
        pendingUser.pendingUserCleanupsAt=cleanupsAt
        pendingUser.resendCount += 1

        await pendingUser.save()

        await veriyUserEmail({ otp, email })

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

        const tokenPayload = {
            id: userExists._id,
            email: userExists.email,
            role: userExists.role
        }

        const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" })
        const refreshToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "5m" })

        userExists.refreshToken = refreshToken
        await userExists.save()

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/auth/refresh-token"
        })
        res.status(200).json({ success: true, message: "Login successfull", accessToken, tokenPayload })

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

        console.log(token);
        const tokenExistsInDB = await userModel.findOne({ refreshToken: token })
        console.log(tokenExistsInDB);
        if (!tokenExistsInDB) {
            return res.status(400).json({ success: false, message: "Invalid refresh token" })
        }

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (error, decode) => {
            if (error) {
                tokenExistsInDB.refreshToken = null
                await tokenExistsInDB.save()
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/api/auth/refresh-token"
                })

                return res.status(401).json({ success: false, message: "Expired refresh token" })
            }

            const newAccessToken = jwt.sign({ id: decode.id, email: decode.email, role: decode.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" })
            res.status(200).json({ success: true, message: "success", accessToken: newAccessToken })
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

        const emailExists = await userModel.findOne({ email })

        if (!emailExists) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const hashedOTP = await bcrypt.hash(otp, 10)
        const expiresOTP = new Date(Date.now() + 2 * 60 * 1000)

        await passwordResetModel.create(
            {
                userId: emailExists._id,
                otp: hashedOTP,
                expiresOTP: expiresOTP,
                attempts: 0
            }
        )

        await setResetOtpEmail(email, otp)

        await emailExists.save()

        res.status(200).json({ success: true, message: "OTP sent successfully", hashedOTP, expiresOTP, current: new Date(Date.now()) })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.resetPasswordController = async (req, res) => {

}

exports.logoutController = async (req, res) => {

}

exports.getData = async (req, res) => {
    res.status(200).json({ success: true, message: "Data fetched successfully" })
}



