
const SuperAdmin = require('../models/SuperAdmin');
const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendOtp } = require('../utils/mailer');

// Unified Login Function
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check all user types in order
        let user = await SuperAdmin.findOne({ email });
        if (!user) user = await Admin.findOne({ email });
        if (!user) user = await Teacher.findOne({ email });
        if (!user) user = await Student.findOne({ email });
        if (!user) user = await Parent.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password credentials' });
        }


        //prepare the response data
        const responseData = {
            id: user._id,
            email: user.email,
            role: user.role
        };

          // Add role-specific data
          if (user.role === 'student') {
            responseData.classid = user.classid; // Assuming classId exists in the student model
        } else if(user.role === 'admin'){
            responseData.schoolname = user.schoolname;
        }
        else if (user.role === 'teacher') {
            responseData.schoolname = user.schoolname; // Assuming schoolName exists in the teacher model
            responseData.designation = user.designation; // Assuming subject exists in the teacher model
            responseData.handlingclass = user.handlingclass; // Assuming handlingClass exists in the teacher model
        }

        // Create a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with user data
        res.status(200).json({ token, responseData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.id);
       let user = await SuperAdmin.findById(userId).select('-password');
       if  (!user) user = await Admin.findById(userId).select('-password');
       if  (!user) user = await Teacher.findById(userId).select('-password');
       if  (!user) user = await Student.findById(userId).select('-password');

       if (!user) return res.status(404).json({ message: 'User not found' });

       res.json(user);
    }catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

let otp;

exports.otp = async (req, res) => {
    try {
        const { email } = req.body;
    
        // Generate a random OTP
        otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    
        try {

            // Send the OTP to the user's email
            await sendOtp(email, otp);

            res.status(200).json({ message: 'OTP sent to your email.' });
        } catch (error) {
            console.error("Error sending email:", error);
            res.status(500).json({ message: 'Error sending OTP.' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error generating OTP', error });
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { userOtp } = req.body;
    
        if (userOtp === otp) {
            res.status(200).json({ message: 'OTP verified successfully.' });
        } else {
            res.status(400).json({ message: 'Invalid OTP.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error });
    }
}

exports.changePassword = async (req, res) => {
    const { email, currentPassword, newPassword, otp } = req.body;

    if (otp !== req.body.otp) {
        return res.status(400).json({ message: 'Invalid OTP.' });
    }

    try {
        // Find the user by email
        let user = await SuperAdmin.findOne({ email });
        if (!user) user = await Admin.findOne({ email });
        if (!user) user = await Teacher.findOne({ email });
        if (!user) user = await Student.findOne({ email });

        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect.' });
        }

        // Update the user's password
        user.password = newPassword; // Hashing will be handled in pre-save hook
        await user.save();

        res.status(200).json({ message: 'Password changed successfully!' });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: 'Error changing password.' });
    }
};

exports.parentregister = async (req, res) => {
    try {
        const parent = new Parent(req.body);
        await parent.save();
        res.status(201).json(parent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
 
}