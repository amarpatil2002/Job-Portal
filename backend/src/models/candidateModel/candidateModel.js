const mongoose = require('mongoose')

const candidateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    candidatePersonalDetailsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CandidatePersonalDetails"
    },
    candidateEducationDetailsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CandidateEducationDetails"
    },
    candidateWorkDetailsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CandidateWorkDetails"
    }
}, { timestamps: true })

const candidateModel = mongoose.model("Candidate", candidateSchema)

module.exports = candidateModel