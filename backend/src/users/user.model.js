const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs"); // Change to bcryptjs

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 6; // Minimum password length
      },
      message: props => `${props.value} is too short! Password must be at least 6 characters.`
    }
  },
  role: { type: String, default: 'user' },
  profileImage: String,
  bio: { type: String, maxlength: 200 },
  profession: String,
  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  const user = this;
  try {
    if (!user.isModified('password')) return next();

    // Hash the password using bcryptjs
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (err) {
    next(err); // Pass error to next middleware
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password); // Compare using bcryptjs
  } catch (err) {
    throw new Error('Password comparison failed');
  }
};

const User = model("User", userSchema);

module.exports = User;
