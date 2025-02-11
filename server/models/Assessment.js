const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
    class: { type: String, required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    chapter: { type: String, required: true },
    email: { type: String, required: true },
    rollNo: { type: String, required: true },
    score: { type: String, required: true } // Change this from Number to String
});

module.exports = mongoose.model('Assessment', AssessmentSchema);