const Student = require('../models/Student'); // Adjust the path as necessary

// Create a new student
exports.createStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStudentsBySchoolClass = async (req, res) => {
    try {
        const schoolName = req.query.schoolname; // Ensure this matches the query parameter used in the frontend
        const handlingClass = req.query.classid; // Get the handling class from the query parameters

        // Fetch students based on school name and class id
        const students = await Student.find({ schoolname: schoolName, classid: handlingClass });
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error.message); // Log the error message
        res.status(500).json({ message: error.message });
    }
};


exports.getStudentsBySchool = async (req, res) => {
    try {
        const schoolName = req.query.schoolname; // Ensure this matches the query parameter used in the frontend
      
        const students = await Student.find({ schoolname: schoolName });
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error.message); // Log the error message
        res.status(500).json({ message: error.message });
    }
}


// Update a student
exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};