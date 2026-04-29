require("dotenv").config();
const express = require('express');
const userRoute = require('./routes/userRoute')
const BlogRoute = require('./routes/BlogRoute')
const mongoose = require('mongoose');
const path = require('path');
const cookie_parser = require('cookie-parser');
const checkForAuthenticationCookie = require('./middleware/authentitication');
const Blogs = require('./models/blogModal');

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/blogify'

const app = express();
mongoose.connect(MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));


// 🔄 Middleware order matters!
app.use(cookie_parser());
app.use(express.json());
app.use(express.urlencoded({ extended: false})); // ⬅️ Move this ABOVE the routes
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));

// Routes
app.use("/user", userRoute);
app.use("/blog", BlogRoute);
// View engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Home route
app.get('/', async(req, res) => {
    const allBlogs = await Blogs.find({}).sort({ createdAt: -1 });
    return res.render('home',{
        user:req.user,blogs:allBlogs
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
