const candidateModel = require("../../models/candidateModel/candidateModel")
const profileModel = require("../../models/candidateModel/profileModel")
const fs = require("fs")


exports.createProfile = async (req, res) => {
    try {
        const { summary } = req.body
        const userId = req.user.id

        const candidate = await candidateModel.findOne({ userId })
        if (!candidate) {
            if (req.file) return fs.unlink(req.file.path, () => { })
            return res.status(404).json({ success: false, message: "Candidate not found" })
        }

        if (candidate.profileId) {
            if (req.file) return fs.unlink(req.file.path, () => { })
            return res.status(409).json({ success: false, message: "Profile already exist" })
        }

        const profile = await profileModel.create({
            summary: summary || "",
            profileImage: req.file ? req.file.path : null
        })

        candidate.profileId = profile._id
        await candidate.save()

        res.status(201).json({ success: true, message: "Profile updated successfully" })

    } catch (error) {
        console.log(error);
        if (req.file) fs.unlink(req.file.path, () => { });
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { summary } = req.body
        const userId = req.user.id

        const candidate = await candidateModel.findOne({ userId }).populate("profileId")
        if (!candidate || !candidate.profileId) {
            if (req.file) return fs.unlink(req.file.path, () => { })
            return res.status(404).json({ success: false, message: "Candidate profile not found" })
        }

        const profile = candidate.profileId
        if (summary !== undefined) {
            profile.summary = summary
        }

        if (req.file) {
            if (profile.profileImage) {
                fs.unlink(profile.profileImage, () => { })
            }
            profile.profileImage = req.file.path
        }
        await profile.save()
        return res.status(200).json({ success: true, message: "Profile updated successfully" })
    } catch (error) {
        if (req.file) fs.unlink(req.file.path, () => { });
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id

        const candidate = await candidateModel.findOne({ userId }).populate("profileId")
        if (!candidate || !candidate.profileId) {
            return res.status(404).json({ success: false, message: "Candidate profile not found" })
        }

        const profile = candidate.profileId
        if (profile.profileImage) {
            fs.unlink(profile.profileImage, () => { })
            profile.profileImage = null
        }

        await profile.save()

        return res.status(200).json({ success: true, message: "Profile image deleted" })


    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.getProfile = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}