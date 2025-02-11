const Timetable = require('../models/TimeTable');
const Teacher = require('../models/Teacher');


// Add timetable for a teacher
exports.createTimetable = async (req, res) => {
    const { firstname, lastname, classId, subject, schedule } = req.body;

    try {
        const teacher = await Teacher.findOne({ firstname, lastname });
        
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found.' });
        }

        const newTimetable = new Timetable({
            teacherId: teacher._id,
            classId,
            subject,
            schedule
        });

        await newTimetable.save();
        res.status(201).json(newTimetable);
    } catch (err) {
        console.error('Error adding timetable:', err);
        res.status(500).json({ message: 'Server error while adding timetable.' });
    }
};

// Get timetable by teacher
exports.getTimetableByTeacher = async (req, res) => {
    const { firstname, lastname } = req.params;

    try {
        const teacher = await Teacher.findOne({ firstname, lastname });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found.' });
        }

        const timetable = await Timetable.find({ teacherId: teacher._id }).populate('teacherId', 'firstname lastname');

        if (!timetable.length) {
            return res.status(404).json({ message: 'No timetable found for this teacher.' });
        }

        res.status(200).json(timetable);
    } catch (err) {
        console.error('Error fetching timetable:', err);
        res.status(500).json({ message: 'Server error while fetching timetable.' });
    }
};

// Get overall periods for a day based on class 
exports.getPeriodsByClass = async (req, res) => {
    const { classId } = req.params;

    try {
        const timetables = await Timetable.find({ classId });

        if (!timetables.length) {
            return res.status(404).json({ message: 'No timetable found for this class.' });
        }

        // Group by day
        const groupedByDay = timetables.reduce((acc, curr) => {
            curr.schedule.forEach(schedule => {
                if (!acc[schedule.day]) acc[schedule.day] = [];
                acc[schedule.day].push({
                    subject: curr.subject,
                    startTime: standardizeTimeFormat(schedule.startTime),
                    endTime: standardizeTimeFormat(schedule.endTime)
                });
            });
            return acc;
        }, {});

        // Function to convert time to comparable format
        const convertToComparableTime = (time) => {
            const parts = time.split(':');
            const hours = parseInt(parts[0], 10);
            const minutes = parseInt(parts[1], 10);
            return hours * 60 + minutes; // Convert to total minutes for easy comparison
        };

        // Sort periods and insert breaks
        for (const day in groupedByDay) {
            // Sort periods by start time
            groupedByDay[day].sort((a, b) => convertToComparableTime(a.startTime) - convertToComparableTime(b.startTime));

            // Insert breaks and split continuous periods
            const splitPeriods = [];
            let currentEndTime = 0;

            groupedByDay[day].forEach(period => {
                const periodStart = convertToComparableTime(period.startTime);
                const periodEnd = convertToComparableTime(period.endTime);

                // Insert break before this period if needed
                if (currentEndTime < periodStart) {
                    // Check if a break is needed before this period
                    if (currentEndTime < 630 && periodStart >= 630) { // Before 10:30
                        splitPeriods.push({ subject: 'Break', startTime: '10:30', endTime: '10:45' });
                    }
                    if (currentEndTime < 735 && periodStart >= 735) { // Before 12:15
                        splitPeriods.push({ subject: 'Lunch', startTime: '12:15', endTime: '13:00' });
                    }
                    if (currentEndTime < 945 && periodStart >= 945) { // Before 15:45
                        splitPeriods.push({ subject: 'Break', startTime: '15:45', endTime: '16:00' });
                    }
                }

                splitPeriods.push({
                    subject: period.subject,
                    startTime: formatTime(periodStart),
                    endTime: formatTime(periodEnd)
                });

                currentEndTime = Math.max(currentEndTime, periodEnd);
            });

            // Replace original periods with split periods
            groupedByDay[day] = splitPeriods;
        }

        res.status(200).json(groupedByDay);
    } catch (err) {
        console.error('Error fetching class timetable:', err);
        res.status(500).json({ message: 'Server error while fetching class timetable.' });
    }
};

// Helper function to format time as "HH:mm"
const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Helper function to standardize time format from "HH.MM" to "HH:mm"
const standardizeTimeFormat = (time) => {
    return time.replace('.', ':');
}