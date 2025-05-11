const express = require('express');
const router = express.Router();
const { isuserLoggeddIn } = require('../middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

router.get('/', isuserLoggeddIn, async(req, res) => {
    let user = await User.findById(req.user._id).populate('posts');
    
    
    res.render('profile', { user: user });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

router.post('/update', isuserLoggeddIn, upload.single('profilePic'), async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
    }
    try {
        const { username } = req.body;
        const profilePic = req.file ? `/uploads/${req.file.filename}` : undefined;
        const updatedData = {};
        if (username) updatedData.username = username;
        if (profilePic) updatedData.profilePicture = profilePic;
        const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedData, { new: true });
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while updating the profile');
    }
});

module.exports = router;
