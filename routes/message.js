
const express = require('express');
const router = express.Router();
const Chat = require('../models/chat'); // Import Chat model (create it if needed)

// Route to render messages page
router.get('/', async (req, res) => {
    try {
        // Fetch chat data from MongoDB (if you have a Chat model)
        let chats = await Chat.find(); 
        
        // Temporary static data for testing (remove when using database)
        chats = [
            { username: "Techzim Podcast", avatar: "/images/user1.jpg", lastMessage: "Hello!", time: "14:17" },
            { username: "John Doe", avatar: "/images/user2.jpg", lastMessage: "Hey, how are you?", time: "13:45" },
            { username: "Jane Doe", avatar: "/images/user3.jpg", lastMessage: "See you soon!", time: "12:30" }
        ];

        // Render message.ejs and pass the chats array
        res.render('message', { chats });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
