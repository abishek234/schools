const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/student', studentController.createStudent);
router.get('/students', studentController.getAllStudents);
router.get('/student',studentController.getStudentsBySchoolClass)
router.get('/student/school',studentController.getStudentsBySchool)
router.get('/student/:id', studentController.getStudentById);
router.put('/student/:id', studentController.updateStudent);
router.delete('/student/:id', studentController.deleteStudent);

module.exports = router;