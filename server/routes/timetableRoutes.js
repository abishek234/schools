const express =  require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');

// Add timetable for a teacher
router.post('/addtimetable', timetableController.createTimetable);

// Get timetable by teacher
router.get('/gettimetable/:firstname/:lastname', timetableController.getTimetableByTeacher);

// Get overall periods for a day based on class
router.get('/getperiods/:classId', timetableController.getPeriodsByClass);

module.exports = router;