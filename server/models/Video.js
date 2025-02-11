// models/Video.js
const mongoose = require('mongoose');   

const VideoSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    chapter: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    videoId: {
        type: String,
        required: true,
    },
    materialId: {
        type: String,
        required: true,
    },
    class: {
        type: String,
        required: true, // e.g., 'LKG', 'UKG', '1', '2', ..., '12'
    },
    form:{
        type: String,
        required : true,
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Teacher', // Reference to the Teacher model
    },
    completedBy: {
        type: [String],
        default: [],// Array of student IDs who have completed this video
    },
});

module.exports = mongoose.model('Video', VideoSchema);