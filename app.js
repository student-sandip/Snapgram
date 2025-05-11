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

mongoose.connect('mongodb://127.0.0.1:27017/snap', { 
    useNewUrlParser: true, useUnifiedTopology: true
 })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));
require('./config/passport')(passport);  
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',  
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


const indexRoutes = require('./routes/suggestedUsers');
const authRoutes = require('./routes/auth'); 
const postRoutes = require('./routes/post'); 
const storyRoutes = require('./routes/story'); 
const profileRoutes = require('./routes/profile');  
const createRoutes = require('./routes/create');
const chatRoutes = require('./routes/message');  

app.use('/', indexRoutes);  
app.use('/profile', profileRoutes);  
app.use('/auth', authRoutes);  
app.use('/posts', postRoutes);  
app.use('/stories', storyRoutes);
app.use('/create', createRoutes); 
app.use('/messages', chatRoutes); 

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});