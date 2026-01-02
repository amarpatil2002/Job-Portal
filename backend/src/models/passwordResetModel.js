const mongoose = require("mongoose")

const passResetSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    otp:{type:String},
    expiresOTP:{type:String},
    resendCount:{type:Number,default:0},

} , {timestamps:true})

const passwordResetModel = mongoose.model("ResetPassword" , passResetSchema)

module.exports = passwordResetModel