
exports.multerErrorHandler = (uploadMiddlerWare) => {
    return (req, res, next) => {
        uploadMiddlerWare(req, res, (error) => {
            if (error) {
                // console.log(error);
                if (error instanceof require('multer').MulterError) {
                    if (error.code === "LIMIT_UNEXPECTED_FILE") {
                        return res.status(400).json({ success: false, message: "Invalid file type" })
                    }
                    if (error.code === "LIMIT_FILE_SIZE") {
                        return res.status(400).json({ success: false, message: "File size must be less than 5MB" })
                    }
                    return res.status(400).json({ success: false, message: error.message || "file upload error" })
                }

                // Generic errors
                return res.status(400).json({
                    success: false,
                    message: error.message || "File upload failed",
                });
            }

            next()
        })
    }
}