const { object } = require("yup")
const candidateModel = require("../../models/candidateModel/candidateModel")
const candidatePersonalDetailsModel = require("../../models/candidateModel/candidatePersonalDetailsModel")


// BASIC INFO
// exports.createBasicInfo = async (req, res) => {
//     try {
//         const { name, age, gender, married } = req.body
//         const userId = req.user.id

//         if (!name || !gender || age === undefined || married === undefined) {
//             return res.status(400).json({ success: false, message: "All fiedls are required" })
//         }

//         const candidate = await candidateModel.findOne({ userId }).lean()
//         if (!candidate) {
//             return res.status(404).json({ success: false, message: "Candidate not found" })
//         }

//         if (candidate.candidatePersonalDetailsId) {
//             return res.status(409).json({ success: false, message: "Personal details already exist" })
//         }

//         const personalDetails = await candidatePersonalDetailsModel.create({
//             basicInfo: {
//                 name,
//                 age,
//                 gender,
//                 married
//             }
//         })

//         await candidateModel.updateOne({ _id: candidate._id }, { $set: { candidatePersonalDetailsId: personalDetails._id } })

//         return res.status(201).json({ success: true, message: "Basic details created successfully", basicInfo })

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Internal server error" })
//     }
// }

exports.updateBasicInfo = async (req, res) => {
    try {
        // const { name, age, married, gender } = req.body
        const userId = req.user.id

        // This code completely update/overwrite the entire document even one field is changed
        // if (!name || !gender || age === undefined || married === undefined) {
        //     return res.status(400).json({ success: false, message: "All fiedls are required" })
        // }

        const candidate = await candidateModel.findOne({ userId }).lean()
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" })
        }
        let personalDetailsId = candidate.candidatePersonalDetailsId
        if (!personalDetailsId) {
            const basicDetails = await candidatePersonalDetailsModel.create({ basicInfo: {} })

            await candidateModel.updateOne({ _id: candidate._id }, { $set: { candidatePersonalDetailsId: basicDetails._id } })

            personalDetailsId = basicDetails._id
        }

        //
        const updatedFields = {}
        for (let [field, value] of Object.entries(req.body)) {
            if (value !== undefined) {
                updatedFields[`basicInfo.${field}`] = value
            }
        }

        if (!Object.keys(updatedFields).length) {
            return res.status(400).json({ success: false, message: "Nothing to update" });
        }

        await candidatePersonalDetailsModel.updateOne(
            { _id: personalDetailsId },
            { $set: updatedFields }
        )

        return res.status(200).json({ success: true, message: "Basic details updated successfully", data: updatedFields })


    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}


exports.getBasicInfo = async (req, res) => {
    try {
        const userId = req.user.id
        const candidate = await candidateModel.findOne({ userId })

        if (!candidate || !candidate.candidatePersonalDetailsId) {
            return res.status(404).json({ success: false, message: "Personal details not found" })
        }

        const personalDetails = await candidatePersonalDetailsModel.findById(candidate.candidatePersonalDetailsId).select("basicInfo").lean()

        if (!personalDetails) {
            return res.status(404).json({ success: false, message: "Basic details not found" })
        }

        return res.status(200).json({ success: true, message: "Basic details fetched successfully", data: personalDetails.basicInfo })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}


// CONTACT INFO

exports.updateContactInfo = async (req, res) => {
    try {
        const userId = req.user.id
        const candidate = await candidateModel.findOne({ userId })
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" })
        }

        let candidatePersonalDetailsId = candidate.candidatePersonalDetailsId
        if (!candidatePersonalDetailsId) {
            const contactDetails = await candidatePersonalDetailsModel.create(
                {
                    contactInfo: {}
                }
            )

            await candidateModel.updateOne({ _id: candidate._id }, { $set: { candidatePersonalDetailsId: contactDetails._id } })

            candidatePersonalDetailsId = contactDetails._id
        }

        const updatedFields = {}
        for (let [field, value] of Object.entries(req.body)) {
            if (value !== undefined) {
                updatedFields[`contactInfo.${field}`] = value
            }
        }

        if (!updatedFields) {
            return res.status(404).json({ success: false, message: "Nothing to update" })
        }

        const contactDetails = await candidatePersonalDetailsModel.updateOne(
            { _id: candidate.candidatePersonalDetailsId },
            { $set: updatedFields }
        )
        if (!contactDetails) {
            return res.status(404).json({ success: false, message: "Contact details not found" })
        }

        return res.status(200).json({ success: true, message: "Basic details updated successfully", data: updatedFields })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}


exports.getContactInfo = async (req, res) => {
    try {
        const userId = req.user.id
        const candidate = await candidateModel.findOne({ userId })
        if (!candidate || !candidate.candidatePersonalDetailsId) {
            return res.status(404).json({ success: false, message: "Personal details not found" })
        }

        const personalDetails = await candidatePersonalDetailsModel.findById(candidate.candidatePersonalDetailsId).select("contactInfo").lean()
        if (!personalDetails) {
            return res.status(404).json({ success: false, message: "Contact details not found" })
        }

        return res.status(200).json({ success: true, message: "Contact details fetched successfully", data: personalDetails.contactInfo })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}




// IDENTITY INFO (Sensitive)

exports.updateIdentityInfo = async (req, res) => {
    try {
        const userId = req.user.id
        const candidate = await candidateModel.findOne({ userId })
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" })
        }

        let candidatePersonalDetailsId = candidate.candidatePersonalDetailsId

        if (!candidatePersonalDetailsId) {
            const identityDetails = await candidatePersonalDetailsModel.create({ identityInfo: {} })

            await candidateModel.updateOne({ _id: candidate._id }, { $set: { candidatePersonalDetailsId: identityDetails._ids } })

            candidatePersonalDetailsId = identityDetails._id
        }

        const updatedFields = {}
        for (let [field, value] of Object.entries(req.body)) {
            if (value !== undefined) {
                updatedFields[`identityInfo.${field}`] = value
            }
        }

        if (!updatedFields) {
            return res.status(400).json({ success: false, message: "Nothing to update" })
        }

        const personalDetails = await candidatePersonalDetailsModel.updateOne(
            { _id: candidate.candidatePersonalDetailsId },
            { $set: updatedFields }
        )

        return res.status(200).json({ success: true, message: "Identity details updated successfully", data: personalDetails.identityInfo })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}


exports.getIdentityInfo = async (req, res) => {
    try {
        const userId = req.user.id

        const candidate = await candidateModel.findOne({ userId })
        if (!candidate || !candidate.candidatePersonalDetailsId) {
            return res.status(404).json({ success: false, message: "Personal details not found" })
        }

        const personalDetails = await candidatePersonalDetailsModel.findById(candidate.candidatePersonalDetailsId).select("identityInfo").lean()

        if (!personalDetails) {
            return res.status(404).json({ success: false, message: "Identity details not found" })
        }

        return res.status(200).json({ success: true, message: "Identity details fetched successfully", data: personalDetails.identityInfo })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}