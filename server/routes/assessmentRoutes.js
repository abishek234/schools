// routes/assessment.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx'); 
const fs = require('fs');
const Assessment = require('../models/Assessment');
const Student = require('../models/Student');
const Video = require('../models/Video');
const AssessmentController = require('../controllers/assessmentController');


const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files


// GET endpoint to retrieve all assessments
router.get('/assessment/upload', AssessmentController.getAllAssessments);

// PUT endpoint to update an assessment by ID
router.put('/assessment/:id', AssessmentController.updateAssessment);

// DELETE endpoint to delete an assessment by ID
router.delete('/assessment/:id', AssessmentController.deleteAssessment);

// POST endpoint to upload CSV and save scores to the database
router.post('/assessment/upload', upload.single('file'), async (req, res) => {
    const results = [];
    const requiredFields = ['class', 'subject', 'chapter', 'topic', 'email', 'rollNo', 'score'];

    try {
        // Read the uploaded Excel file
        const workbook = XLSX.readFile(req.file.path);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        for (const data of jsonData) {
            if (!data) continue; // Skip empty rows
            if (data['class'] === undefined || data['subject'] === undefined || data['chapter'] === undefined || data['topic'] === undefined || data['email'] === undefined || data['rollNo'] === undefined || data['score'] === undefined) {
                console.warn("Missing required fields in row:", data);
                continue; // Skip rows with missing fields
            }

            // Not store existing data
            const existingAssessment = await Assessment.findOne({ email: data.email, class: data.class, subject: data.subject, chapter: data.chapter, topic: data.topic });
            if (existingAssessment) {
                return res.status(400).json({message : "Assessment already exists "});
                continue; // Skip to the next row if assessment already exists
            } else {  
                const assessmentData = {
                    class: data.class,
                    subject: data.subject,
                    chapter: data.chapter,
                    topic: data.topic,
                    email: data.email,
                    rollNo: data.rollNo,
                    score: (data.score || data['score']).toString() // Ensure score is stored as a string
                };

                // Check if all required fields are present
                const hasRequiredFields = requiredFields.every(field => assessmentData[field] !== undefined && assessmentData[field] !== null);

                if (hasRequiredFields) {
                    results.push(assessmentData);
                } else {
                    console.warn("Missing required fields in row:", assessmentData);
                }
            }
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'No valid assessment records found in the uploaded file.' });
        }

        // Save each record to the database
        await Assessment.insertMany(results);

        // Automatically check students' emails and update completedBy in videos
        for (const result of results) {
            const students = await Student.find({ email: result.email }); // Assuming you have a Student model

            for (const student of students) {
                let percentageScore;
            

                // Ensure score is treated as a string before checking for "X/Y" format
                if (typeof result.score === 'string' || result.score.includes('/')) {
                   
                    percentageScore = (result.score /  10) * 100;
                } else {
                    // If it's just a number, assume full marks are 10 for percentage calculation
                    percentageScore = Number(result.score); // Adjust as needed for full marks
                }

                

                // Only proceed if the student's percentage score is greater than 50%
                if (percentageScore > 50) { 
                    const existingVideo = await Video.findOne({ completedBy: result.email });
                    if (existingVideo) {
                        console.log(`Assessment already completed by ${result.email}`);
                        continue; // Skip to the next student if already completed
                    } else {
                        // Find associated video based on class, subject, chapter, and topic
                        const video = await Video.findOne({
                            class: result.class,
                            subject: result.subject,
                            chapter: result.chapter,
                            topic: result.topic
                        });

                        if (video && !video.completedBy.includes(student.email)) {
                            video.completedBy.push(student.email); // Add student's email to completedBy array
                            await video.save(); // Save updated video
                        }
                    }
                }
            }
        }

        res.status(200).json({ message: 'Data uploaded successfully!', data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing the uploaded file.' });
    } finally {
        // Remove the uploaded file after processing
        fs.unlinkSync(req.file.path);
    }
});
//Get data based on the class
router.get('/assessment/:class/:subject', AssessmentController.getAssessmentByClass);


//Get email of students who have taken the assessment
router.get('/assessment/:email/:className/:subject/:chapter/:topic/', AssessmentController.getAssessmentByStudent);

//Get a single assessment by ID
router.get('/assessment/:id', AssessmentController.getAssessmentById);



module.exports = router;