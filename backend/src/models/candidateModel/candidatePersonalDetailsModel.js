const mongoose = require('mongoose')

const candidatePersonalDetailsSchema = new mongoose.Schema({

    basicInfo: {
        name: { type: String, required: true },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true
        },
        age: { type: Number },
        marriage: { type: Boolean }
    },

    contactInfo: {
        contactNumber: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String }
    },

    identityInfo: {
        fathersName: { type: String },
        mothersName: { type: String },
        addharNumber: { type: String },
        panNumber: { type: String },
        disability: { type: Boolean },
        disabilityName: { type: String }
    }

}, { timestamps: true })

const candidatePersonalDetailsModel = mongoose.model("CandidatePersonalDetails", candidatePersonalDetailsSchema)

module.exports = candidatePersonalDetailsModel