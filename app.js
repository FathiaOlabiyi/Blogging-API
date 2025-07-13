const express = require('express');
const passport = require("passport");
const bodyParser = require("body-parser");

require("dotenv").config();
require("./config/db").connectToDb();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());


app.use(bodyParser.urlencoded({ extended: false }));
// Import routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

// Use routes
app.use(passport.initialize());
app.use('/', authRoutes);
app.use('/blogs', blogRoutes);

// HOMEPAGE
app.get("/", (req, res) => {
    res.json({
        messages: "Welcome to my Blogging API",
        profile: {
            signup: "POST /signup",
            login: "POST /login",
            getPublished: "GET /blogs",
            getBlogById: "GET /blogs/:id",
            createBlog: "POST /blogs (auth)"
        }
    })
});



// Error Handlling
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500);
    res.json({error: err.message});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})