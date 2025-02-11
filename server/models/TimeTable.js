const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    classId: {
        type: Number,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    schedule: [
        {
            day: {
                type: String, // e.g., "Monday", "Tuesday"
                required: true,
            },
            startTime: {
                type: String, // e.g., "09:00"
                required: true,
            },
            endTime: {
                type: String, // e.g., "10:00"
                required: true,
            },
        }
    ],
});

module.exports = mongoose.model('Timetable', TimetableSchema);