const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    body: {
        type: String,
        required: true
    },
    tags: [String],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    state: {
        type: String,
        enum: ["draft", "published"], 
        default: "draft"
    },
    read_count: {
        type: Number,
        default: 0
    },
    reading_time: String,
}, {timestamps: true});

module.exports = mongoose.model("Blog", BlogSchema);