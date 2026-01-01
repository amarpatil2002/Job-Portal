const mongoose = require('mongoose')

const candidateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    profileDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    candidatePersonalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CandidatePersonalDetails"
    },
    candidateEducationDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CandidateEducationDetails"
    },
    candidateWorkDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CandidateWorkDetails"
    }
}, { timestamps: true })

const candidateModel = mongoose.model("Candidate", candidateSchema)

module.exports = candidateModel