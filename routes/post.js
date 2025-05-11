// Express Routes Update
const express = require('express');
const multer = require('multer');
const Post = require('../models/Post');
const router = express.Router();
const upload = multer({ dest: 'public/uploads/' });
const User = require("../models/User");

// Create a Post
router.post('/create', upload.single('image'), (req, res) => {
    const { caption } = req.body;
    const newPost = new Post({
        user: req.user.id,
        image: req.file.path,
        caption: caption,
        likes: []
    });

    newPost.save()
        .then(post => res.redirect('/'))
        .catch(err => res.send(err));
});

// Add a comment to a post
router.post('/:postId/comment', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).send('Post not found');

        post.comments.push({ user: req.user.username, comment: req.body.comment });
        await post.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error);
    }
});

// Like a post
router.post('/:postId/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).send('Post not found');

        const index = post.likes.indexOf(req.user.id);
        if (index !== -1) {
            post.likes.splice(index, 1); // Unlike
        } else {
            post.likes.push(req.user.id); // Like
        }

        await post.save();
        res.json({ likes: post.likes.length });
    } catch (error) {
        res.status(500).send(error);
    }
});


router.post("/upload-voice/:id",upload.single('audio'), async (req, res) => {
    const postId = req.params.id;
try {
    const audioPath = '/uploads/' + req.file.filename;
    const timestamp = new Date().toLocaleTimeString();

    const post = await Post.findById(postId);
    if (!post) return res.status(404).send('Post not found');
    post.comments.push({ user: req.user.username, comment: audioPath });
    await post.save();
    res.status(200).json({ message: 'Voice uploaded successfully', path: audioPath });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ message: 'Upload failed' });
  }    
});

router.post('/delete-post/:id/:userId', async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.params.userId;
    await Post.findByIdAndDelete(postId);
    await User.findByIdAndUpdate(userId, {
      $pull: { posts: postId }
    });
    res.redirect('/profile');
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
