const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    summary: {
        type: String
    },
    // just for local storage
    // profileImage: {
    //     type: String
    // },

    profileImage: {
        imageURL: { type: String },
        publicId: { type: String }
    }

}, { timestamps: true })

const profileModel = mongoose.model("Profile", profileSchema)

module.exports = profileModel