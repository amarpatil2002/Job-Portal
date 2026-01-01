const userModel = require("../models/commonAuthModel")
const bcrypt = require('bcrypt')
const companyModel = require("../models/companyModel/companyModel")

exports.registerController = async (req, res) => {
    try {
        const { email, password , confirmPassword, role, companyName } = req.body

        if (!email || !password || !confirmPassword || !role) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        if(!['candidate','company'].includes(role)){
            return res.status(400).json({success:false,message:"invalid job role selected"})
        }

        const emailExists = await userModel.findOne({email})

        if(emailExists){
            return res.status(400).json({ success: false, message: "This email already existed" })
        }

        if(password !== confirmPassword){
            return res.status(400).json({ success: false, message: "password must match" })
        }

        const hashedPassword = bcrypt.hash(password,12)

        const user = await userModel.create({
            email,
            password:hashedPassword,
            role
        })

        if(role === "company"){
            if(!companyName){
                return res.status(400).json({success:false,message:"company name is required"})
            }

            const company = await companyModel.create({
                companyName,
                createdBy:user._id
            })

            user.companyId = company._id
            await user.save()
        }



    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}

exports.loginController = async (req, res) => {

}

exports.forgotPasswordController = async (req, res) => {

}

exports.resetPasswordController = async (req, res) => {

}

exports.refreshTokenController = async (req, res) => {

}

exports.logoutController = async (req, res) => {

}

