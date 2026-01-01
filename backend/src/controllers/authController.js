const userModel = require("../models/commonAuthModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const companyModel = require("../models/companyModel/companyModel")
const candidateModel = require("../models/candidateModel/candidateModel")
const { json } = require("express")

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
        console.log(emailExists);
        
        if (emailExists) {
            return res.status(400).json({ success: false, message: "Email already registered" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Password must match" })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await userModel.create({
            email,
            password: hashedPassword,
            role
        })

        if(role === "candidate"){
            const candidate = await candidateModel.create({
                userId:user._id
            })
            await candidate.save()
        }

        if (role === "company") {
            if (!companyName) {
                return res.status(400).json({success: false,message: "Company name is required for company registration",});
            }
            const company = await companyModel.create({
                companyName,
                createdBy: user._id
            })

            user.companyId = company._id
            await user.save()
        }

        res.status(201).json({ success: true, message: "Registration successfull",user })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.loginController = async (req, res) => {
    try {
        const {email,password} = req.body

        if(!email || !password){
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const userExists = await userModel.findOne({email})

        if(!userExists){
            return res.status(401).json({ success: false, message: "Email not registered" })
        }

        const isMatchPassword = await bcrypt.compare(password,userExists.password)
        if(!isMatchPassword){
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        const tokenPayload = {
            id:userExists._id,
            email:userExists.email,
            role:userExists.role
        }

        const accessToken = jwt.sign(tokenPayload ,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1m"})
        const refreshToken = jwt.sign(tokenPayload ,process.env.REFRESH_TOKEN_SECRET,{expiresIn:"5m"})

        userExists.refreshToken = refreshToken
        await userExists.save()

        res.cookie("refreshToken" , refreshToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            path: "/api/auth/refresh-token"
        })
        res.status(200).json({success:true,message:"Login successfull",accessToken,tokenPayload})

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}

exports.refreshTokenController = async (req, res) => {
    try {
        // console.log(req.cookies);
        const token = req.cookies?.refreshToken

        if(!token){
            return res.status(401).json({success:false,message:"Refresh token missing"})
        }

        console.log(token);
        const tokenExistsInDB = await userModel.findOne({refreshToken:token})
        console.log(tokenExistsInDB);
        if(!tokenExistsInDB){
            return res.status(400).json({success:false,message:"Invalid refresh token"})
        }

        jwt.verify(token , process.env.REFRESH_TOKEN_SECRET , async(error,decode) => {
            if(error){
                tokenExistsInDB.refreshToken = null
                await tokenExistsInDB.save()
                res.clearCookie("refreshToken",{
                    httpOnly:true,
                    secure:process.env.NODE_ENV === "production",
                    sameSite:"strict",
                    path:"/api/auth/refresh-token"
                })

                return res.status(401).json({success:false,message:"Expired refresh token"})
            }

            const newAccessToken = jwt.sign({id:decode.id,email:decode.email,role:decode.role} , process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1m"})
            res.status(200).json({success:true,message:"success" , accessToken:newAccessToken})
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}

exports.forgotPasswordController = async (req, res) => {

}

exports.resetPasswordController = async (req, res) => {

}

exports.logoutController = async (req, res) => {

}

exports.getData = async (req, res) => {
    res.status(200).json({success:true,message:"Data fetched successfully"})
}



