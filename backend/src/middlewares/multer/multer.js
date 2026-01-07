const multer = require("multer")
const path = require('path')
const fs = require('fs')

const fileDirectory = path.join(__dirname, "../../", "upload/profileImages")
if (!fs.existsSync(fileDirectory)) {
    fs.mkdirSync(fileDirectory)
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, fileDirectory)
    },
    filename: (req, file, cb) => {
        const unique = Math.floor(1000 + Math.random() * 9000)
        return cb(null, `${unique + Date.now()}`)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedType = ["image/jpeg", "image/png", "image/jpg"]

    if (!allowedType.includes(file.mimetype)) {
        return cb(new multer.MulterError(
            "LIMIT_UNEXPECTED_FILE",
            "file"
        ), false)
    }

    cb(null, true)
}

exports.uploadImage = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
})
