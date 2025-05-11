const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    },
    posts: [{
        type: Schema.Types.ObjectId, 
        ref: 'Post'
    }],
    profilePicture: {
        type: String,  // The profile picture will store the file path to the image
        default: '/uploads/blank-profile-picture-973460_640.webp'  // You can use a default image path if there's no profile pic
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
