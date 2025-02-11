const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.post('/teacher', teacherController.createTeacher);
router.get('/teachers', teacherController.getAllTeachers);
router.get('/teacher/:id', teacherController.getTeacherById);
router.get('/teacher', teacherController.getTeachersBySchool);
router.put('/teacher/:id', teacherController.updateTeacher);
router.delete('/teacher/:id', teacherController.deleteTeacher);
router.get('/teacher/students/:teacherId', teacherController.getStudentsByClassAndTeacher);
router.get('/teacher/class/students',teacherController.getStudentsByTeacherClass)

module.exports = router;