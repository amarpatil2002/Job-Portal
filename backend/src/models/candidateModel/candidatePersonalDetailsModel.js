const mongoose = require('mongoose')

const candidatePersonalDetailsSchema = new mongoose.Schema({

    basicInfo: {
        name: { type: String, required: true },
        gender: { type: String },
        age: { type: Number },
        marriage: { type: String }
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
        aadharNumber: { type: String },
        panNumber: { type: String },
        disability: { type: Boolean },
        disabilityName: { type: String }
    }

}, { timestamps: true })

const candidatePersonalDetailsModel = mongoose.model("Compnay", candidatePersonalDetailsSchema)

module.exports = candidatePersonalDetailsModel