const express = require('express');
const multer = require('multer');
const Story = require('../models/Story');
const router = express.Router();

const upload = multer({ dest: 'public/uploads/' });

// Create a Story
router.post('/create', upload.single('image'), (req, res) => {
    const newStory = new Story({
        user: req.user.id,
        image: req.file.path,
        text: req.body.text,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)  // 24 hours expiration
    });

    newStory.save()
        .then(story => res.redirect('/views/stories'))
        .catch(err => res.send(err));
});

module.exports = router;
