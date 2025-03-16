const {Schema, model} =require("mongoose")
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {type: String, require: true, unique: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    role:{
        type: String, default: 'user'
    },
    profileImage: String,
    bio: {type: String, maxlength: 200},
    profession: String,
    createAt:{
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified('password')) return next();
    const hashedpassword = await bcrypt.hash(user.password, 10)
    user.password = hashedpassword;
    next() 
})

userSchema.methods.comparePassword = function(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password)
}
const User = new model("User", userSchema)

module.exports = User;