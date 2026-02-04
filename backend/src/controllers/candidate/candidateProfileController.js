const candidateModel = require("../../models/candidateModel/candidateModel")
const profileModel = require("../../models/candidateModel/profileModel")
const fs = require("fs")
const cloudinary = require("cloudinary").v2
const uploadFileOnCloudinary = require("../../services/upload")
const { default: mongoose } = require("mongoose")


// store the images on local storage

// exports.createProfile = async (req, res) => {
//     try {
//         const { summary } = req.body
//         const userId = req.user.id
//         const candidate = await candidateModel.findOne({ userId })
//         if (!candidate) {
//             if (req.file) return fs.unlink(req.file.path, () => { })
//             return res.status(404).json({ success: false, message: "Candidate not found" })
//         }

//         if (candidate.profileId) {
//             if (req.file) return fs.unlink(req.file.path, () => { })
//             return res.status(409).json({ success: false, message: "Profile already exist" })
//         }

//         const profile = await profileModel.create({
//             summary: summary || "",
//             profileImage: req.file ? req.file.path : null
//         })

//         candidate.profileId = profile._id
//         await candidate.save()

//         res.status(201).json({ success: true, message: "Profile updated successfully" })

//     } catch (error) {
//         console.log(error);
//         if (req.file) fs.unlink(req.file.path, () => { });
//         return res.status(500).json({ success: false, message: "Internal server error" })
//     }
// }

// exports.updateProfile = async (req, res) => {
// let newUpdateImage = null
//     try {
//         const { summary } = req.body
//         const userId = req.user.id

//         const candidate = await candidateModel.findOne({ userId }).populate("profileId")
//         if (!candidate || !candidate.profileId) {
//             if (req.file) return fs.unlink(req.file.path, () => { })
//             return res.status(404).json({ success: false, message: "Candidate profile not found" })
//         }

//         const profile = candidate.profileId
//         if (summary !== undefined) {
//             profile.summary = summary
//         }

//         if (req.file) {
//             if (profile.profileImage) {
//                 fs.unlink(profile.profileImage, () => { })
//             }
//             newUpdateImage = req.file.path
//         }
//          profile.profileImage = newUpdateImage
//         await profile.save()
//         return res.status(200).json({ success: true, message: "Profile updated successfully" })
//     } catch (error) {
//         console.log(error);
//         if (req.file) fs.unlink(req.file.path, () => { });
//         return res.status(500).json({ success: false, message: "Internal server error" })
//     }
// }

// exports.deleteProfileImage = async (req, res) => {
//     try {
//         const userId = req.user.id

//         const candidate = await candidateModel.findOne({ userId }).populate("profileId")
//         if (!candidate || !candidate.profileId) {
//             return res.status(404).json({ success: false, message: "Candidate profile not found" })
//         }

//         const profile = candidate.profileId
//         if (profile.profileImage) {
//             fs.unlink(profile.profileImage, () => { })
//             profile.profileImage = null
//         }

//         await profile.save()

//         return res.status(200).json({ success: true, message: "Profile image deleted" })


//     } catch (error) {
//         return res.status(500).json({ success: false, message: "Internal server error" })
//     }
// }



// Upload file on cloudinary using diskstorage


exports.updateProfile = async (req, res) => {
    const session = await mongoose.startSession()
    let newUploadImage = null
    try {
        session.startTransaction()

        const { summary } = req.body
        const userId = req.user.id

        const candidate = await candidateModel.findOne({ userId }).populate("profileId").session(session)
        if (!candidate) {
            // return res.status(400).json({ success: false, message: "Candidate not found" })
            throw new Error("Candidate not found")
        }
        let profile = candidate.profileId
        if (!profile) {
            const createProfile = await profileModel.create([{ summary, profileImage: {} }, { session }])

            await candidateModel.updateOne({ _id: candidate._id }, { profileId: createProfile[0]._id }, { session })

            profile = createProfile[0]._id
        }

        const oldImagePublicId = profile.profileImage?.publicId || null
        if (req.file) {
            newUploadImage = await uploadFileOnCloudinary(req.file?.path, "profile-images")
        }

        const updatePayload = {}
        console.log(summary);
        if (summary !== undefined) {
            updatePayload.summary = summary
        }
        if (newUploadImage) {
            updatePayload.profileImage = {
                imageURL: newUploadImage.imageURL,
                publicId: newUploadImage.publicId
            }
        }


        await profileModel.updateOne(
            { _id: profile },
            { $set: updatePayload },
            { session }
        )
        await session.commitTransaction()

        if (newUploadImage && oldImagePublicId) {
            await cloudinary.uploader.destroy(oldImagePublicId)
        }

        return res.status(200).json({ success: true, message: "Profile Updated Successfully", updatePayload })

    } catch (error) {
        console.log(error);
        await session.abortTransaction()

        if (newUploadImage?.publicId) {
            await cloudinary.uploader.destroy(newUploadImage.publicId)
        }

        return res.status(500).json({ success: false, message: "Internal server error" })
    } finally {
        session.endSession()
    }
}

exports.deleteProfileImage = async (req, res) => {
    const session = await mongoose.startSession()
    try {
        const userId = req.user.id
        session.startTransaction()
        const candidate = await candidateModel.findOne({ userId }).populate("profileId").session(session)
        if (!candidate) {

            // return res.status(400).json({ success: false, message: "Candidate not found" })
            throw new Error("Candidate not found")
        }

        const profile = candidate.profileId
        if (!profile) {
            // return res.status(400).json({ success: false, message: "Candidate profile not found" })
            throw new Error("Candidate profile not found")
        }
        const imagePublicId = profile?.profileImage?.publicId
        profile.profileImage = {
            publicId: null,
            imageURL: null
        }

        await profile.save({ session })
        await session.commitTransaction()

        if (imagePublicId) {
            await cloudinary.uploader.destroy(imagePublicId)
        }

        return res.status(200).json({ success: true, message: "Profile image deleted successfully" })

    } catch (error) {
        await session.abortTransaction()
        return res.status(500).json({ success: false, message: "Internal server error" })
    } finally {
        session.endSession()
    }
}

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id

        // const candidate = await candidateModel.findOne({ userId }).populate("profileId")
        // if (!candidate) {
        //     return res.status(400).json({ success: false, message: "Candidate not found" })
        // }
        // const profile = candidate.profileId
        // if (!profile) {
        //     return res.status(400).json({ success: false, message: "Candidate profile not found" })
        // }

        // This is fine if profile data is always required.
        // But for high-traffic APIs, better approach:

        const candidate = await candidateModel.findOne({ userId })
        if (!candidate) {
            return res.status(400).json({ success: false, message: "Candidate not found" })
        }
        const profile = await profileModel.findOne({ _id: candidate.profileId })
        if (!profile) {
            return res.status(400).json({ success: false, message: "Candidate profile not found" })
        }

        return res.status(200).json({ success: true, message: "Profile details fetched", profile })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}