const { default: mongoose } = require("mongoose")
const candidateEducationDetailsModel = require("../../models/candidateModel/candidateEducationModel")
const candidateModel = require("../../models/candidateModel/candidateModel")
const uploadFileOnCloudinary = require("../../services/upload")
const cloudinary = require("cloudinary").v2


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

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: "Qualification not created" })
        }

        return res.status(201).json({ success: true, message: "Qualification created successfully", result, data: qualificationData })

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

        console.log(req.body);
        if (!Object.keys(updatedFields).length) {
            return res.status(400).json({ success: false, message: "Noting to update" })
        }
        const updatedEducation = await candidateEducationDetailsModel.updateOne(
            {
                "qualifications._id": qualificationId,
                _id: educationDetailsId
            },
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

        const candidateEducationDetailsId = candidate.candidateEducationDetailsId
        if (!candidateEducationDetailsId) {
            return res.status(404).json({ success: false, message: "Education ID not found" })
        }

        const deletedDoc = await candidateEducationDetailsModel.updateOne(
            { _id: candidateEducationDetailsId },
            {
                $pull: { qualifications: { _id: qualificationId } }
            }
        )

        if (deletedDoc.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "No qualifications found" })
        }

        return res.status(200).json({ success: true, message: "Qualification deleted successfully", data: deletedDoc })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.getEducation = async (req, res) => {
    try {

        const { qualificationId } = req.params
        const userId = req.user.id

        if (!qualificationId) {
            return res.status(404).json({ success: false, message: "Qualification Id not found" })
        }

        const candidate = await candidateModel.findOne({ userId }).populate("candidateEducationDetailsId").lean()
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" })
        }

        const educationDetailsId = candidate.candidateEducationDetailsId
        if (!educationDetailsId) {
            return res.status(404).json({ success: false, message: "Education Id not found" })
        }

        const singleEducation = await candidateEducationDetailsModel.findOne(
            { _id: educationDetailsId },
            {
                qualifications: { $elemMatch: { _id: qualificationId } }
            }
        )

        // 2.
        // const educationDetailDoc = await candidateEducationDetailsModel.findOne({ "qualifications._id": qualificationId }, { "qualifications.$": 1 })

        if (singleEducation.qualifications.length === 0) {
            return res.status(404).json({ success: false, message: "Qualification not found" })
        }

        return res.status(200).json({ success: true, message: "Qualification fetched successfully", data: singleEducation })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.getAllEducation = async (req, res) => {
    try {

        const userId = req.user.id

        const candidate = await candidateModel.findOne({ userId }).populate("candidateEducationDetailsId").lean()
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" })
        }

        const educationDetailsId = candidate.candidateEducationDetailsId
        if (!educationDetailsId) {
            return res.status(404).json({ success: false, message: "Education Id not found" })
        }

        const getAllEducations = await candidateEducationDetailsModel.findOne(
            { _id: educationDetailsId },
            { qualifications: 1 }
        )

        if (getAllEducations.qualifications.length === 0) {
            return res.status(404).json({ success: false, message: "No qualifications found" })
        }

        return res.status(200).json({ success: true, message: "Qualification fetched successfully", data: getAllEducations })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

//for certificate And higher qualification

exports.updateCertificate = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    let newAllCertificates = []

    try {
        const userId = req.user.id
        const { highestEducation } = req.body
        if (!highestEducation) {
            return res.status(400).json({ success: false, message: "Highest education required" })
        }

        const candidate = await candidateModel.findOne({ userId }).session(session)
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" })
        }

        let educationDetailId = candidate.candidateEducationDetailsId
        if (!educationDetailId) {
            const newEducationDetails = await candidateEducationDetailsModel.create(
                [{
                    certifates: []
                }],
                { session }
            )

            await candidateModel.updateOne({ _id: candidate._id }, { candidateEducationDetailsId: newEducationDetails[0]._id }, { session })

            educationDetailId = newEducationDetails[0]._id
        }

        const educationDetails = await candidateEducationDetailsModel.findOne({ _id: educationDetailId })
        const oldCertificates = educationDetails?.certificates || []

        const upload = await Promise.all(
            req.files.map((file) => uploadFileOnCloudinary(file.path, "Candidate-certificate"))
        )

        let names = Array.isArray(req.body.certificateName) ? req.body.certificateName : [req.body.certificateName]

        newAllCertificates = upload.map((file, index) => {
            return {
                certificateName: names[index] || "Unnamed Certificate",
                certificateFilePublicId: file?.publicId,
                certificateFileUrl: file?.imageURL
            }
        })

        const updateCertificate = {
            highestEducation: highestEducation,
            certificates: newAllCertificates
        }

        const updatedEducationData = await candidateEducationDetailsModel.updateOne(
            { _id: educationDetailId },
            {
                $set: updateCertificate
            },
            { session }
        )

        if (updatedEducationData.matchedCount === 0) {
            return res.status(400).json({ success: false, message: "Certificate & Highest qulification not created" })
        }

        await session.commitTransaction()
        session.endSession()


        if (newAllCertificates && oldCertificates) {
            await Promise.all(oldCertificates.map((certificate) =>
                certificate.certificateFilePublicId ? cloudinary.uploader.destroy(certificate.certificateFilePublicId) : null
            ))
        }

        return res.status(200).json({ success: true, message: "Certificate & Highest qulification created successfully", data: updateCertificate })

    } catch (error) {
        console.log(error);

        await session.abortTransaction()
        session.endSession()

        if (req.file) {
            for (let file of req.file) {
                if (file.publicId) {
                    await deleteFromCloudinary(file.publicId)
                }
            }
        }

        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.getCertificate = async (req, res) => {
    try {
        const userId = req.user.id
        const candidate = await candidateModel.findOne({ userId }).populate("candidateEducationDetailsId").lean()
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" })
        }
        const candidateEducationDetailsId = candidate.candidateEducationDetailsId
        if (!candidateEducationDetailsId) {
            return res.status(404).json({ success: false, message: "Education details not found" })
        }

        const updatedData = {
            highestEducation: candidateEducationDetailsId.highestEducation || "",
            certificates: candidateEducationDetailsId.certificates || []

        }
        console.log(updatedData);
        return res.status(200).json({ success: true, message: "Higher and Certificate details fetched successfully", data: updatedData })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}





