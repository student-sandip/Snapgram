const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: String,
    caption: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ user: String, comment: String, createdAt: { type: Date, default: Date.now } }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
