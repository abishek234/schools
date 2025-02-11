// routes/superAdminRoutes.js
const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');

// Define the routes for SuperAdmin
router.post('/superAdmin', superAdminController.createSuperAdmin); // Create a new SuperAdmin
router.get('/superAdmin', superAdminController.getAllSuperAdmins); // Get all SuperAdmins
router.get('/superAdmin/:id', superAdminController.getSuperAdminById); // Get a single SuperAdmin by ID
router.get('/superAdmins/data', superAdminController.getOverallData); // Get data for  overallschool
router.get('/superAdmins/school/:schoolname', superAdminController.getSchoolData); // Get data for specific school
router.get('/superAdmins/schools', superAdminController.getAllSchools); // Get all schools

module.exports = router;