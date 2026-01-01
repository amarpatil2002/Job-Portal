const mongoose = require('mongoose')

const candidateWorkDetailsSchema = new mongoose.Schema({

    currentDesignation: {
        type: String
    },
    workExperience: {
        type: Number
    },
    notice_period: {
        type: String
    },
    resume: {
        type: String
    },
    skills: {
        type: Array
    },
    preferredLocation: {
        type: String
    },
    experience: [
        {
            designation: {
                type: String
            },
            companyName: {
                type: String
            },
            CTC: {
                type: Number
            },
            location: {
                type: String
            },
            employeeType: {
                type: String
            },
        }
    ],
    projects: [
        {
            projectTitle: {
                type: String
            },
            ProjectStatus: {
                type: String
            },
            ProjectDuration: {
                type: String
            },
            projectDetails: {
                type: String
            },
            role: {
                type: String
            },
            skillsUsed: {
                type: String
            },
            projectUrl: {
                type: String
            }
        }
    ]
}, { timestamps: true })

const candidateWorkDetailsModel = mongoose.model("CandidateWorkDetails", candidateWorkDetailsSchema)

module.exports = candidateWorkDetailsModel
