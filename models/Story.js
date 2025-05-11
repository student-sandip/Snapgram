const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: String,
    text: String,
    views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date,
});

module.exports = mongoose.model('Story', storySchema);
