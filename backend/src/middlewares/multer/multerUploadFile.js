const multer = require('multer')
const fs = require('fs')
const path = require('path')


const filePath = path.join(__dirname, "../../", 'upload/candidateResume')

if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, filePath)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const name = path.basename(file.originalname, ext)
        const randomNum = Math.floor(1000 + Math.random() * 9000)
        cb(null, `${name}-${randomNum}${ext}`)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedFiles = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    if (!allowedFiles.includes(file.mimetype)) {
        return cb(new Error("Only PDF or Word files allowed"), false)
    }

    cb(null, true)
}

exports.fileUpload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: fileFilter
})