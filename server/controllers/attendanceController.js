const Attendance = require('../models/Attendance');

// Mark attendance by getting Students' roll numbers which attendance is marked by the teacher for the particular period
exports.markAttendance = async (req, res) => {
    try {
        const { classId, date, periods } = req.body;

        // Create attendance record
        const attendanceRecord = {
            classId,
            date,
            periods: periods.map(period => ({
                periodNumber: period.periodNumber,
                subject: period.subject,
                presentStudents: period.presentStudents, // Array of roll numbers for present students
                absentStudents: period.absentStudents // Array of roll numbers for absent students
            }))
        };

        // Save the attendance record to the database
        await Attendance.create(attendanceRecord); // Use create to insert a single document

        res.status(201).json({ message: 'Attendance marked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Get attendance percentage of a student for a particular date
exports.getStudentAttendancePercentage = async (req, res) => {
    try {
        const { studentId, startDate, endDate } = req.query;
        

        const attendanceRecords = await Attendance.aggregate([
            {
                $match: {
                    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
                },
            },
            {
                $unwind: "$periods", // Deconstruct periods array
            },
            {
                $project: {
                    presentCount: {
                        $cond: [
                            { $in: [studentId, "$periods.presentStudents"] }, // Check if studentId is present
                            1,
                            0,
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPeriods: { $sum: 1 }, // Count total periods
                    presentCount: { $sum: "$presentCount" }, // Sum present counts
                },
            },
        ]);

        const totalPeriods = attendanceRecords.length > 0 ? attendanceRecords[0].totalPeriods : 0;
        const presentCount = attendanceRecords.length > 0 ? attendanceRecords[0].presentCount : 0;

        const percentage = totalPeriods > 0 ? (presentCount / totalPeriods) * 100 : 0;

        res.status(200).json({ percentage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get attendance of all students for a particular date
exports.getAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.query;
        const attendance = await Attendance.find({ date });
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get overall attendance for a student for a day with respect to the total periods
exports.getStudentOverallAttendanceByDate = async (req, res) => {
    try {
        const { studentId, date } = req.query;
        const attendance = await Attendance.findOne({ studentId, date });
        let presentCount = 0;
        let absentCount = 0;
        attendance.periods.forEach((period) => {
            if (period.status === 'present') {
                presentCount++;
            } else {
                absentCount++;
            }
        });
        res.status(200).json({ presentCount, absentCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get overall attendance for a day with respect to the total period
exports.getOverallAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.query;
        const attendance = await Attendance.find({ date });
        let presentCount = 0;
        let absentCount = 0;
        attendance.forEach((student) => {
            student.periods.forEach((period) => {
                if (period.status === 'present') {
                    presentCount++;
                } else {
                    absentCount++;
                }
            });
        });
        res.status(200).json({ presentCount, absentCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get overall attendance for a student in a month/year
exports.getStudentAttendanceByMonth = async (req, res) => {
    try {
        const { studentId, month, year } = req.query;
        const attendance = await Attendance.find({ studentId });
        let presentCount = 0;
        let absentCount = 0;
        attendance.forEach((student) => {
            if (student.date.getMonth() === month && student.date.getFullYear() === year) {
                student.periods.forEach((period) => {
                    if (period.status === 'present') {
                        presentCount++;
                    } else {
                        absentCount++;
                    }
                });
            }
        });
        res.status(200).json({ presentCount, absentCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get overall attendance for a student in a year
exports.getStudentAttendanceByYear = async (req, res) => {
    try {
        const { studentId, year } = req.query;
        const attendance = await Attendance.find({ studentId });
        let presentCount = 0;
        let absentCount = 0;
        attendance.forEach((student) => {
            if (student.date.getFullYear() === year) {
                student.periods.forEach((period) => {
                    if (period.status === 'present') {
                        presentCount++;
                    } else {
                        absentCount++;
                    }
                });
            }
        });
        res.status(200).json({ presentCount, absentCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

