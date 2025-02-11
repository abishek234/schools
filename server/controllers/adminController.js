const Admin = require('../models/Admin'); 
const Teacher = require('../models/Teacher');
const Videos = require('../models/Video');
const Student = require('../models/Student');

// Create a new admin
exports.createAdmin = async (req, res) => {
    try {
        const admin = new Admin(req.body);
        await admin.save();
        res.status(201).json(admin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single admin by ID
exports.getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an admin
exports.updateAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        res.status(200).json(admin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an admin
exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get data based on admin's school
exports.getDetailsBySchool = async (req, res) => {
    const { adminId } = req.params;

    try {
        // Fetch the admin to get their school name
        const admin = await Admin.findById(adminId); // Ensure you have an Admin model
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const schoolName = admin.schoolname;

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
}

//Get subject by the specific teacher
exports.getSubjectsByTeacher = async (req, res) => {
    const { firstname,lastname } = req.params;
    console.log(firstname,lastname);
    try {
        // Find the teacher
        const teacher = await Teacher.find({ firstname,lastname });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const subjects =  teacher.map(t => t.designation);

        res.json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
};


// Get Chapters by the specific teacher subject
    exports.getChaptersByTeacher = async (req, res) => {
        const { firstname, lastname, subject } = req.params;

        try {
            // Find the teacher to get the handling class
            const teachers = await Teacher.find({ firstname, lastname });

            // Check if any teacher was found
            if (!teachers || teachers.length === 0) {
                return res.status(404).json({ message: 'Teacher not found' });
            }

            // Access the first teacher in the array
            const teacher = teachers[0];
            
            
            const handlingClass = teacher.handlingclass;
         

            // Fetch all chapters in that subject
            const chapters = await Videos.find({ class: handlingClass, subject });
            
            const Chapters = [...new Set(chapters.map(video => video.chapter))]; // Get distinct chapters manually

            res.json(Chapters);
        } catch (error) {
            console.error('Error fetching chapters:', error);
            res.status(500).json({ error: 'Failed to fetch chapters' });
        }
    };

//Get topic by the specific teacher subject chapter
exports.getTopicsByTeacher = async (req, res) => {
    const { firstname,lastname, subject, chapter } = req.params;

    try {
        // Find the teacher to get the handling class
        const teacher = await Teacher.find({firstname,lastname });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const handlingClass = teacher.handlingclass;

        // Fetch all topics in that chapter
        const topics = await Videos.find({ classid: handlingClass, subject, chapter });

        const Topics = [...new Set(topics.map(video => video.topic))]; // Get distinct chapters manually

        res.json(Topics);
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ error: 'Failed to fetch topics' });
    }
};

//Get videos by the specific teacher subject chapter topic
exports.getVideosByTeacher = async (req, res) => {
    const { firstname,lastname, subject, chapter, topic } = req.params;

    try {
        // Find the teacher to get the handling class
        const teacher = await Teacher.find({firstname,lastname });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const handlingClass = teacher.handlingclass;

        // Fetch all videos in that topic
        const videos = await Videos.find({ classid: handlingClass, subject, chapter, topic });
         // Get distinct videosand materials manually
        const VideoIds =  [...new Set(videos.map(video => video.videoId))];
        const Materials =  [...new Set(videos.map(video => video.materialId))];

        res.json({VideoIds,Materials});
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
};