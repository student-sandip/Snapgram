const express = require('express');
const multer = require('multer');
const Post = require('../models/Post');
const { isuserLoggeddIn } = require('../middleware'); // Ensure authentication before posting
const User = require('../models/User');

const router = express.Router();

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Store images in the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique filenames
    }
});

const upload = multer({ storage: storage });

// ✅ GET route to display post creation form
router.get('/', isuserLoggeddIn, (req, res) => {
    res.render('create', { user: req.user, posts: [] }); // Pass an empty array for posts initially
});

// ✅ POST route to handle post creation
router.post('/', isuserLoggeddIn, upload.single('image'), async (req, res) => {
    try {
        const { caption } = req.body;

        // Create a new post
        const newPost = new Post({
            user: req.user.id,
            username: req.user.username,
            userImage: req.user.profileImage,  // Ensure this field exists in the User model
            image: '/uploads/' + req.file.filename,
            caption: caption
        });

        // Save the new post
        await newPost.save();

        // Update the user's posts array by pushing the new post's ID
        const user = await User.findById(req.user.id);
        user.posts.push(newPost._id); // Push the post's ObjectId
        await user.save();  // Save the updated user document

        req.flash('success', 'Post created successfully!');
        res.redirect('/');  // Redirect to homepage after posting
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;