const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    username: { type: String, required: true },  // User's name
    avatar: { type: String, default: '/images/default-avatar.png' },  // User avatar
    lastMessage: { type: String, required: true },  // Last message text
    time: { type: String, required: true }  // Time of last message
});

const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
