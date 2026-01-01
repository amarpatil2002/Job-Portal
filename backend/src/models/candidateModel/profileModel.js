const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    profileImage:{
        type:String
    },
    summary:{
        type:String
    }

}, { timestamps: true })

const profileModel = mongoose.model("Profile", profileSchema)

module.exports = profileModel