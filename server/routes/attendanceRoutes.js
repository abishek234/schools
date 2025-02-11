const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Route to mark attendance
router.post('/attendance', attendanceController.markAttendance);

// Route to get attendance percentage for a student
router.get('/attendance/percentage', attendanceController.getStudentAttendancePercentage);

// Route to get attendance of all students for a particular date
router.get('/attendance/date', attendanceController.getAttendanceByDate);

// Route to get overall attendance for a student for a specific date
router.get('/attendance/student/date', attendanceController.getStudentOverallAttendanceByDate);

// Route to get overall attendance for all students on a specific date
router.get('/attendance/overall/date', attendanceController.getOverallAttendanceByDate);

// Route to get overall attendance for a student in a month
router.get('/attendance/student/month', attendanceController.getStudentAttendanceByMonth);

// Route to get overall attendance for a student in a year
router.get('/attendance/student/year', attendanceController.getStudentAttendanceByYear);

module.exports = router;