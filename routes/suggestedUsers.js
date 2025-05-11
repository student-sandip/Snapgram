const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const { isuserLoggeddIn } = require('../middleware');

router.get('/', isuserLoggeddIn ,async (req, res) => {
    try {
        const posts = await Post.find().populate('user').exec();
        const stories = []; // Fetch stories from the database
        const suggestedUsers = await User.find().limit(5).exec(); // Fetch suggested users from the database        
        res.render('index', {
            user: req.user,
            posts: posts,
            stories: stories,
            suggestedUsers: suggestedUsers
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;