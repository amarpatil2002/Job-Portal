const mongoose = require('mongoose')

const candidateEducationDetailsSchema = new mongoose.Schema({
    highestEducation:{type:String},
    certifates:[
        {
            certificateName:{type:String},
            certificateFile:{type:String},
        }
    ],
    education: [
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
            startDate: {
                type: Date
            },
            endDate: {
                type: Date
            },
            grade: {
                type: String
            },
        }
    ]
}, { timestamps: true })

const candidateEducationDetailsModel = mongoose.model("CandidateEducationDetails", candidateEducationDetailsSchema)

module.exports = candidateEducationDetailsModel
