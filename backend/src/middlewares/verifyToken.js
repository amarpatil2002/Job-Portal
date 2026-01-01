const jwt = require('jsonwebtoken')
const User = require('../models/commonAuthModel')

const verifyToken = async(req,res,next) => {
    try {
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startWith("Bearer ")){
            return res.status(401).json({success:false,message:"Unauthorized user"})
        }
        const token = authHeader.split(" ")[1]
        const payload = jwt.verify(token ,process.env.ACCESS_TOKEN_SECRET )

        const user = await User.findById({_id:payload._id})
        console.log(user);
        
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}

module.exports = verifyToken