const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');


router.post('/login', loginController.login);
router.get('/user/:id', loginController.getUserProfile);
router.post('/request-otp', loginController.otp);
router.post('/verify-otp', loginController.verifyOtp);
router.post('/change-password', loginController.changePassword);
router.get('/profile/:id', loginController.getUserProfile);


module.exports = router;