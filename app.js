const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');
require('dotenv').config();
const app = express();

app.use(express.urlencoded({ extended: true }));  
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://127.0.0.1:27017/snap', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));
require('./config/passport')(passport);  
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',  // Session secret, can be stored in .env
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.user || null; 
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


const indexRoutes = require('./routes/suggestedUsers');  // Home route
const authRoutes = require('./routes/auth');  // Authentication routes (login, register, logout)
const postRoutes = require('./routes/post');  // Routes for posts (create, like, comment)
const storyRoutes = require('./routes/story');  // Routes for stories (create, view)
const profileRoutes = require('./routes/profile');  // Routes for profile (view, edit)
const createRoutes = require('./routes/create');  // Routes for chat (view, send)
const chatRoutes = require('./routes/message');  // Routes for chat (view, send)

// Use routes
app.use('/', indexRoutes);  // Home route
app.use('/profile', profileRoutes);  // Home route
app.use('/auth', authRoutes);  // Routes for authentication
app.use('/posts', postRoutes);  // Routes for posts
app.use('/stories', storyRoutes);  // Routes for stories
app.use('/create', createRoutes);  // Routes for chat
app.use('/messages', chatRoutes);  // Routes for chat

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});