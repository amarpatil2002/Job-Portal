const mongoose = require('mongoose')
const { string } = require('yup')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["candidate", "company"],
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        default: null
    },

    refreshToken: { type: String },
    isVerifedUser: { type: Boolean },

}, { timestamps: true })

const userModel = mongoose.model("User", userSchema)

module.exports = userModel

