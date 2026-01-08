const cloudinary = require('cloudinary').v2
const fs = require("fs")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadFileOnCloudinary = async (filePath, folder = "upload") => {
    try {
        if (!filePath) return null
        const result = await cloudinary.uploader.upload(filePath, { folder, resource_type: "auto" })
        fs.unlinkSync(filePath)
        return { publicId: result.public_id, imageURL: result.secure_url }
    } catch (error) {
        console.log(error);
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
        throw new Error("Cloudinary upload failed")
    }
}

module.exports = uploadFileOnCloudinary