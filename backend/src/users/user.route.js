const express = require("express");
const User = require("./user.model");
const generateToken = require("../middleware/generateToken");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router()

// Register

router.post("/register", async(req,res)=>{
    try {
        const {username, email, password} = req.body;
        const user = new User({email, username, password})
        await user.save()
        res.status(201).send({
            message: "User registered successfully"
        })
    } catch (error) {
        console.error("Error registering User", error);
        res.status(500).send({message: 'Error registering User'})
    }
})


router.post('/login', async(req,res)=>{
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email})
    if(!user){
        return res.status(404).send({
            message: "User Not Found"
        })
    }
    const isMatch = await user.comparePassword(password)
    if(!isMatch){
        return res.status(404).send({
            message: "Password not matched"
        })
    }
    const token = await generateToken(user._id)
    
    res.cookie('token', token, {httpOnly: true, secure: true, sameSite: "None"})
    res.status(200).send({
        message: "User Logged in",
        token,
        user:{
            _id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            profileImage: user.profileImage,
            bio: user.bio,
            profession: user.profession
        }
    })
    } catch (error) {
        console.error("Error Logged in user", error);
        res.status(500).send({
            message: "Error logged in user"
        })
    }
})

//logout endpoint

router.post("/logout",(req,res)=>{
    res.clearCookie('token');
    res.status(200).send({message : "Logged out successfully"})
})

router.delete("/users/:id", async(req,res)=>{
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id)
        if(!user){
            return res.status(404).send({message: "User Not Found"})
        }
        res.status(200).send({message: "User Deleted successfully"})
    } catch (error) {
        console.error("Error Deleting User", error);
        res.status(500).send({message: 'Error Deleting User'})
    }
})

router.get("/users", async(req,res)=>{
    try {
        const users = await User.find({}, 'id email role').sort({createdAt: -1})
        res.status(201).send({
            message: "Users fetched",
            users
        })
    } catch (error) {
        console.error("Error Fetching Users", error);
        res.status(500).send({message: 'Error Fetching User'})
    }
})

router.put("/user/:id", async(req,res)=>{
    try {
        const {id} = req.params;
        const {role} = req.body;
        const user = await User.findByIdAndUpdate(id, {role}, {new: true})
        if(!user){
            return res.status(404).send({message: "user Not Found"})
        }
        res.status(200).send({message: "User role Updated", user})
    } catch (error) {
        console.error("Error Updating User role", error);
        res.status(500).send({message: 'Error Updating User role'})
    }
})

router.patch("/edit-profile", async(req,res)=>{
    try {
        const {userId, username, profileImage, bio, profession} = req.body;
        if(!userId){
            return res.status(404).send({message: "User ID required"})
        }
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).send({message: "User Not Found"})
        }
        // update profile
        if(username !== undefined) user.username = username;
        if(profileImage !== undefined) user.profileImage = profileImage;
        if(bio !== undefined) user.bio = bio;
        if(profession !== undefined) user.profession = profession;

        await user.save();
        res.status(200).send({
            message: "User profile Updated",
            user:{
                _id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            profileImage: user.profileImage,
            bio: user.bio,
            profession: user.profession
            }
        })
    } catch (error) {
        console.error("Error updating user profile", error);
        res.status(500).send({message: 'Error updating user profile'})
    }
})
module.exports = router;