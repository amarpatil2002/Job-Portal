const mongoose = require('mongoose')

const candidateEducationDetailsSchema = new mongoose.Schema({
    highestEducation: { type: String },
    certificates: [
        {
            certificateName: { type: String },
            certificateFilePublicId: { type: String },
            certificateFileUrl: { type: String },
        }
    ],
    qualifications: [
        {
            collegeName: {
                type: String
            },
            degree: {
                type: String
            },
            fieldStudy: {
                type: String
            },
            startYear: {
                type: String
            },
            endYear: {
                type: String
            },
            grade: {
                type: String
            },
        }
    ]
}, { timestamps: true })

const candidateEducationDetailsModel = mongoose.model("CandidateEducationDetails", candidateEducationDetailsSchema)

module.exports = candidateEducationDetailsModel
