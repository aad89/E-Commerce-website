const jwt = require("jsonwebtoken")
const User = require("../users/user.model")
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const generateToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        if(!userId){
            throw new Error("User is not found")
        }

        const token = jwt.sign({userId: user._id , role: user.role}, JWT_SECRET, {expiresIn:"1h"})
        return token;
    } catch (error) {
        
    }
}

module.exports = generateToken;