
const SuperAdmin = require('../models/SuperAdmin'); // Adjust the path as necessary
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');


exports.createSuperAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the SuperAdmin already exists
        const existingAdmin = await SuperAdmin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'SuperAdmin already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const superAdmin = new SuperAdmin({
            email,
            password: hashedPassword,
        });

        await superAdmin.save();
        res.status(201).json(superAdmin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all SuperAdmins
exports.getAllSuperAdmins = async (req, res) => {
    try {
        const superAdmins = await SuperAdmin.find();
        res.status(200).json(superAdmins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Get All Schools
exports.getAllSchools = async (req, res) => {
    try {
        const schools = await Admin.find().select('schoolname');
        res.status(200).json(schools);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single SuperAdmin by ID
exports.getSuperAdminById = async (req, res) => {
    try {
        const superAdmin = await SuperAdmin.findById(req.params.id);
        if (!superAdmin) return res.status(404).json({ message: 'SuperAdmin not found' });
        res.status(200).json(superAdmin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//Get data for specific school
exports.getSchoolData = async (req, res) => {
    const schoolName = req.params.schoolname;


    try {
        // Fetch the school admin's details
        const schoolAdmin = await Admin.findOne({ schoolname: schoolName });

        if (!schoolAdmin) {
            return res.status(404).json({ message: 'School admin not found' });
        }

        const schoolAdminName = schoolAdmin.name;

        // Fetch student statistics
        const students = await Student.find({ schoolname: schoolName });
        const totalStudents = students.length;
        const boysCount = students.filter(student => student.gender === 'Male').length;
        const girlsCount = students.filter(student => student.gender === 'Female').length;

        // Fetch teacher statistics
        const teachers = await Teacher.find({ schoolname: schoolName });
        const totalTeachers = teachers.length;
        const maleTeachersCount = teachers.filter(teacher => teacher.gender === 'Male').length;
        const femaleTeachersCount = teachers.filter(teacher => teacher.gender === 'Female').length;

        // Prepare response data
        const responseData = {
            schoolAdminName,
            totalStudents,
            boysCount,
            girlsCount,
            totalTeachers,
            maleTeachersCount,
            femaleTeachersCount,
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};






//Get data for Super admin dashboard
exports.getOverallData = async (req, res) => {
    try {
        // Fetch all admins
        const admins = await Admin.find();
        const totalAdmins = admins.length;

        // Fetch all students
        const students = await Student.find();
        const totalStudents = students.length;
        const boysCount = students.filter(student => student.gender === 'Male').length;
        const girlsCount = students.filter(student => student.gender === 'Female').length;

        // Fetch all teachers
        const teachers = await Teacher.find();
        const totalTeachers = teachers.length;
        const maleTeachersCount = teachers.filter(teacher => teacher.gender === 'Male').length;
        const femaleTeachersCount = teachers.filter(teacher => teacher.gender === 'Female').length;

        // Fetch distinct school names to count total schools
        const schoolsSet = new Set(admins.map(admin => admin.schoolname));
        const totalSchools = schoolsSet.size;

        // Prepare response data
        const responseData = {
            totalSchools,
            totalAdmins,
            totalStudents,
            boysCount,
            girlsCount,
            totalTeachers,
            maleTeachersCount,
            femaleTeachersCount,
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }

};
