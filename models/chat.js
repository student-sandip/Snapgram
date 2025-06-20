const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    username: { type: String, required: true },  
    avatar: { type: String, default: '/images/default-avatar.png' },  
    lastMessage: { type: String, required: true }, 
    time: { type: String, required: true } 
});

const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
