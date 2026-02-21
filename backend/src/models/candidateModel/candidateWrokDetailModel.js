const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
    {
        designation: { type: String, trim: true, default: '' },
        companyName: { type: String, trim: true, default: '' },
        CTC: { type: Number, default: 0 },
        location: { type: String, trim: true, default: '' },
        employeeType: { type: String, trim: true, default: '' },
    },
    { _id: true }
);

const projectSchema = new mongoose.Schema(
    {
        projectTitle: { type: String, trim: true, default: '' },
        projectStatus: { type: String, trim: true, default: '' },
        projectDuration: { type: String, trim: true, default: '' },
        projectDetails: { type: String, trim: true, default: '' },
        role: { type: String, trim: true, default: '' },
        skillsUsed: { type: String, trim: true, default: '' },
        projectUrl: { type: String, trim: true, default: '' },
    },
    { _id: true }
);

/* ---------- Main Schema ---------- */

const candidateWorkDetailsSchema = new mongoose.Schema(
    {
        experience: {
            type: [experienceSchema],
            default: [],
        },

        projects: {
            type: [projectSchema],
            default: [],
        },
    },
    { timestamps: true }
);

const candidateWorkDetailsModel = mongoose.model(
    'CandidateWorkDetails',
    candidateWorkDetailsSchema
);

module.exports = candidateWorkDetailsModel;