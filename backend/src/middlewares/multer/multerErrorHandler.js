
// exports.multerErrorBaseHandler = (uploadMiddlerWare, options = {}) => {
//     return (req, res, next) => {
//         uploadMiddlerWare(req, res, (error) => {
//             if (error) {
//                 // console.log(error);
//                 if (error instanceof require('multer').MulterError) {
//                     if (error.code === "LIMIT_UNEXPECTED_FILE") {
//                         return res.status(400).json({ success: false, message: options.invalidType || "Invalid file type" })
//                     }
//                     if (error.code === "LIMIT_FILE_SIZE") {
//                         return res.status(400).json({ success: false, message: options.sizeLimit || "File size must be less than 5MB" })
//                     }
//                     return res.status(400).json({ success: false, message: error.message || "file upload error" })
//                 }

//                 // Generic errors
//                 return res.status(400).json({
//                     success: false,
//                     message: error.message || "File upload failed",
//                 });
//             }

//             next()
//         })
//     }
// }


const multer = require("multer");

exports.multerErrorBaseHandler = (uploadMiddleware, options = {}) => {
    return (req, res, next) => {
        uploadMiddleware(req, res, (error) => {
            if (!error) return next();

            if (error instanceof multer.MulterError) {
                console.log(error);
                if (error.code === "LIMIT_UNEXPECTED_FILE") {
                    return res.status(400).json({
                        success: false,
                        message: options.invalidType || "Invalid file type"
                    });
                }

                if (error.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({
                        success: false,
                        message: options.sizeLimit || "File too large"
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(400).json({
                success: false,
                message: error.message || "File upload failed"
            });
        });
    };
}