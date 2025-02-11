const mongoose = require('mongoose');

const AttendancePeriodSchema = new mongoose.Schema({
    periodNumber: { type: Number, required: true },
    subject: { type: String, required: true }, // Subject for this period
    presentStudents: [{ type: String, required: true }] ,// Array of roll numbers of students present
    absentStudents: [{ type: String, required: true }] // Array of roll numbers of students absent
});

const AttendanceSchema = new mongoose.Schema({
    classId: { type: String, required: true }, 
    date: { type: Date, required: true ,index : true}, // Date for which attendance is marked
    periods: [AttendancePeriodSchema], // Array of periods for the class on that date
});

module.exports = mongoose.model('Attendance', AttendanceSchema);