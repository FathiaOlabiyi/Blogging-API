const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

//connect to mongodb

function connectToDb() {
    mongoose.connect(MONGODB_URI);

    mongoose.connection.on("connected", () => {
        console.log("Connection to database successful");
    });

    mongoose.connection.on("error", (err) => {
        console.log("Connection to database failed", err)
    });
}

module.exports = {connectToDb};