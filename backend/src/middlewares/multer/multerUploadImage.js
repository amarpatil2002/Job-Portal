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
        const ext = path.extname(file.originalname)
        const name = path.basename(file.originalname, ext)
        const unique = Math.floor(1000 + Math.random() * 9000)
        return cb(null, `${name}-${unique}${ext}`)
    }
})

const imageFilter = (req, file, cb) => {
    const allowedType = ["image/jpeg", "image/png", "image/jpg"]

    if (!allowedType.includes(file.mimetype)) {
        cb(new Error("Only image files allowed"), false)
    }

    cb(null, true)
}

exports.uploadImage = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFilter
})
