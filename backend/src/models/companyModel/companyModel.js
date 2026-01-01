const mongoose = require('mongoose')

const compnySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    descriptin: {
        type: String
    },
    website: {
        type: String
    }
}, { timestamps: true })

const companyModel = mongoose.model("Company", compnySchema)

module.exports = companyModel