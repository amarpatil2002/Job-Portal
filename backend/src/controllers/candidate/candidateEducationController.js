const candidateEducationDetailsModel = require("../../models/candidateModel/candidateEducationModel")
const candidateModel = require("../../models/candidateModel/candidateModel")


exports.addEducation = async (req, res) => {
    try {
        const { collegeName, degree, fieldStudy, startYear, endYear, grade } = req.body
        const userId = req.user.id

        if (!collegeName || !degree || !fieldStudy || !startYear || !endYear || !grade) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        if (parseInt(endYear) <= parseInt(startYear)) {
            return res.status(404).json({ success: false, message: "Passout year should be greater than start year" })
        }

        const candidate = await candidateModel.findOne({ userId })
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" })
        }

        let candidateEducationDetailsId = candidate.candidateEducationDetailsId

        if (!candidateEducationDetailsId) {
            const educationDetails = await candidateEducationDetailsModel.create(
                {
                    qualifications: []
                }
            )

            await candidateModel.updateOne({ _id: candidate._id }, { $set: { candidateEducationDetailsId: educationDetails._id } })

            candidateEducationDetailsId = educationDetails._id
        }

        const qualificationData = {
            collegeName,
            degree,
            fieldStudy,
            startYear,
            endYear,
            grade
        }

        const result = await candidateEducationDetailsModel.updateOne(
            { _id: candidateEducationDetailsId },
            { $push: { qualifications: qualificationData } }
        )

        if (updatedEducation.matchedCount === 0) {
            return res.status(404).json({ success: false, message: "Qualification not found" })
        }

        return res.status(201).json({ success: true, message: "Qualification created successfully", data: qualificationData })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.updateEducation = async (req, res) => {
    try {
        const userId = req.user.id
        const { qualificationId } = req.params

        if (!qualificationId) {
            return res.status(400).json({ success: false, message: "Qualification Id not provided" })
        }

        const candidate = await candidateModel.findOne({ userId })
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" })
        }

        const educationDetailsId = candidate.candidateEducationDetailsId

        const educationDetailExist = await candidateEducationDetailsModel.findById(educationDetailsId)
        if (!educationDetailExist) {
            return res.status(404).json({ success: false, message: "Candidate education details not found" })
        }
        const updatedFields = {}
        for (let [field, value] of Object.entries(req.body)) {
            if (value !== undefined) {
                updatedFields[`qualifications.$.${field}`] = value
            }
        }

        if (!Object.keys(updatedFields).length) {
            return res.status(400).json({ success: false, message: "Noting to update" })
        }
        const updatedEducation = await candidateEducationDetailsModel.updateOne(
            { "qualifications._id": qualificationId },
            { $set: updatedFields }
        )

        if (updatedEducation.matchedCount === 0) {
            return res.status(404).json({ success: false, message: "Qualification not found" })
        }

        return res.status(200).json({ success: true, message: "Qualification details updated successfully", data: updatedFields })


    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.deleteEducation = async (req, res) => {
    try {
        const userId = req.user.id
        const { qualificationId } = req.params
        if (!qualificationId) {
            return res.status(400).json({ success: false, message: "Qualification Id not provided" })
        }

        const candidate = await candidateModel.findOne({ userId })
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" })
        }

        const educationDetailsdoc = candidate.candidateEducationDetailsId
        if (!educationDetailsdoc) {
            return res.status(404).json({ success: false, message: "Education ID not found" })
        }

        const deletedDoc = await candidateEducationDetailsModel.deleteOne({ "qualifications._id": qualificationId })

        if (deletedDoc.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Qualification not found" })
        }

        return res.status(200).json({ success: true, message: "Qualification deleted successfully", data: deletedDoc })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.getEducation = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

//for certificate And higher qualification

exports.addCertificate = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.updateCertificate = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.deleteCertificate = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.getCertificate = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}





