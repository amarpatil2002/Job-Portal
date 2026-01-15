const { multerErrorBaseHandler } = require("./multerErrorHandler");
const { fileUpload } = require("./multerUploadFile");
const { uploadImage } = require("./multerUploadImage");


exports.multerProfileImageHandler = multerErrorBaseHandler(
    uploadImage.single('profileImage'),
    {
        invalidType: "Only image files allowed",
        sizeLimit: "Image must be under 2MB"
    }
)

exports.multerCandidateCertifiateHandler = multerErrorBaseHandler(
    fileUpload.array('certificates', 5),
    {
        invalidType: "Only PDF or Word files allowed",
        sizeLimit: "Each file must be under 2MB"
    }
)