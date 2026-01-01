const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Access token missing" })
        }
        let decode;
        const token = authHeader.split(" ")[1]
        try {
            decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(400).json({ success: false, message: "Token is expired" })
            }
        }
        req.user = decode
        // console.log(req.user);
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

module.exports = verifyToken