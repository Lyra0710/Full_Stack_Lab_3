const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    googleId: String,
    email: String,
    displayName: String,
    password: String
});

// Checking if the password is valid
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;