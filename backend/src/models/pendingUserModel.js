const mongoose = require('mongoose')

const pendingUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
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
    companyName: { type: String},
    otp: {type: String,required: true},
    otpExpiresAt: {type: Date, required: true},
    resendCount:{type:Number,default:0},
    pendingUserCleanupsAt: {type: Date, required: true},

}, { timestamps: true })

/* ✅ TTL INDEX (AUTO DELETE EXPIRED RECORDS) */
pendingUserSchema.index(
  { pendingUserCleanupsAt: 1},
  { expireAfterSeconds: 0 }
);

exports.pendingUserModel = mongoose.model("PendingUser", pendingUserSchema)

