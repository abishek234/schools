    const Teacher = require('../models/Teacher'); // Adjust the path as necessary
    const Student = require('../models/Student');
    const Video = require('../models/Video');

    // Create a new teacher
    exports.createTeacher = async (req, res) => {
        try {
            const teacher = new Teacher(req.body);
            await teacher.save();
            res.status(201).json(teacher);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Get all teachers based on the school name
    exports.getAllTeachers = async (req, res) => {
        try {
            const teachers = await Teacher.find() || []; ;
            res.status(200).json(teachers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    // Get students based on the teacher's handling class
    exports.getStudentsByTeacherClass = async (req, res) => {
        try {
            
            const {classid,schoolname} = req.query
           
    
            // Fetch students based on the classid
            const students = await Student.find({classid: classid,schoolname:schoolname});
            
            // Return students or a message if none found
            if (students.length === 0) {
                return res.status(404).json({ message: "No students found for this class." });
            }
    
            res.status(200).json(students);
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({ message: error.message });
        }
    };

    // Get a single teacher by ID
    exports.getTeacherById = async (req, res) => {
        try {
            const teacher = await Teacher.findById(req.params.id);
            if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
            res.status(200).json(teacher);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    exports.getTeachersBySchool = async (req, res) => {
        try {
            const schoolName = req.query.schoolname; // Ensure this matches the query parameter used in the frontend
          
            const teachers = await Teacher.find({ schoolname: schoolName });
            res.status(200).json(teachers);
        } catch (error) {
            console.error('Error fetching teachers:', error.message); // Log the error message
            res.status(500).json({ message: error.message });
        }
    };
    // Update a teacher
    exports.updateTeacher = async (req, res) => {
        try {
            const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
            res.status(200).json(teacher);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Delete a teacher
    exports.deleteTeacher = async (req, res) => {
        try {
            const teacher = await Teacher.findByIdAndDelete(req.params.id);
            if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
            res.status(204).json();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };


// Get student details based on teacher handling class
exports.getStudentsByClassAndTeacher = async (req, res) => {
    const { teacherId } = req.params;
    
    

    try {
        // Find the teacher to get the handling class
        const teacher = await Teacher.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const handlingClass = teacher.handlingclass;
        const designation = teacher.designation; 
        const schoolname = teacher.schoolname;

        // Fetch all students in that class
        const students = await Student.find({ classid: handlingClass,schoolname:schoolname});

        // Initialize counts
        const totalStudents = students.length;
        const boysCount = students.filter(student => student.gender === 'Male').length;
        const girlsCount = students.filter(student => student.gender === 'Female').length;
        

        // Fetch all videos for that class
        const videos = await Video.find({ class: handlingClass });
       

        // Trim whitespace from designation and log it
        const trimmedDesignation = designation.trim();
        

        // Fetch videos by subject (designation)
        const videosBySubject = await Video.find({ subject: trimmedDesignation,teacherId:teacherId });
        

        // Calculate video completion stats for all videos in class
        const completedVideosCount = await Promise.all(videosBySubject.map(async (video) => {
            return video.completedBy.length; // Count how many students have completed this video
        }));

        const totalCompletedVideos = completedVideosCount.reduce((acc, count) => acc + count, 0);
        
        // Calculate total not completed videos
        const totalNotCompletedVideos = (totalStudents * videosBySubject.length) - totalCompletedVideos;

        // Prepare response data
        const responseData = {
            totalStudents,
            boysCount,
            girlsCount,
            totalVideos: videosBySubject.length,  // Total number of videos by subject
            totalChapters: new Set(videosBySubject.map(video => video.chapter)).size , // Unique chapters from fetched videos by subject
            totalCompletedVideos,
            totalNotCompletedVideos,
          
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).json({ error: 'Failed to fetch student details' });
    }
};


