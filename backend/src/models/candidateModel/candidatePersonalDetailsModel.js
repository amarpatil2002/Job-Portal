const mongoose = require('mongoose')

const candidatePersonalDetailsSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    contry: { type: String },
    // email:{type:String},
    contactNumber: { type: String },
    gender: { type: String },
    age: { type: String },
    marriage: { type: String },
    fathersName: { type: String },
    mothersName: { type: String },
    AddharNumber: { type: String },
    PanNumber: { type: String },
    disability: { type: Boolean },
    disabilityName : {type:String}

}, { timestamps: true })

const candidatePersonalDetailsModel = mongoose.model("Compnay", candidatePersonalDetailsSchema)

module.exports = candidatePersonalDetailsModel