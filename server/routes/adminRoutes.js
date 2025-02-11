const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/admin', adminController.createAdmin);
router.get('/admin', adminController.getAllAdmins);
router.get('/admin/:id', adminController.getAdminById);
router.put('/admin/:id', adminController.updateAdmin);
router.delete('/admin/:id', adminController.deleteAdmin);
router.get('/admin/school/:adminId', adminController.getDetailsBySchool);
router.get('/admin/teachers/subject/:firstname/:lastname', adminController.getSubjectsByTeacher);
router.get('/admin/chapters/:firstname/:lastname/:subject', adminController.getChaptersByTeacher);
router.get('/admin/topics/:firstname/:lastname/:subject/:chapter', adminController.getTopicsByTeacher);
router.get('/admin/videos/:firstname/:lastname/:subject/:chapter/:topic', adminController.getVideosByTeacher);


module.exports = router;