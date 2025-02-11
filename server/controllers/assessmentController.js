
const Assessment = require('../models/Assessment');



// Get all assessments
exports.getAllAssessments = async (req, res) => {
    try {
        const assessments = await Assessment.find();
        res.status(200).json(assessments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an assessment by ID
exports.updateAssessment = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAssessment = await Assessment.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedAssessment) return res.status(404).json({ message: 'Assessment not found' });
        res.status(200).json(updatedAssessment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an assessment by ID
exports.deleteAssessment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAssessment = await Assessment.findByIdAndDelete(id);
        if (!deletedAssessment) return res.status(404).json({ message: 'Assessment not found' });
        res.status(204).send(); // No content to send back
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  Get data based on the class 
exports.getAssessmentByClass = async (req, res) => {
    try {
        const { class: className ,subject} = req.params;
        const assessments = await Assessment.find({ class: className ,subject : subject });
        res.status(200).json(assessments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



//Get email of students who have taken the assessment
exports.getAssessmentByStudent = async (req, res) => {
    try {
        const { email,className,subject,chapter,topic} = req.params;
        
            // Check if any parameter is undefined
            if (!email || !className || !subject || !chapter || !topic) {
                return res.status(400).json({ message: "Missing required parameters." });
            }
        
        const assessments = await Assessment.find({email,class:className,subject : subject,chapter : chapter, topic:topic}).select('email');
        
        if (assessments.length === 0) {
            console.log(`No assessments found for email: ${email}`); // Log if no assessments found
        } else {
            console.log(`Found ${assessments.length} assessments for email: ${email}`); // Log number of assessments found
        }

        res.status(200).json(assessments);
    } catch (error) {
        console.error("Error fetching assessments:", error); // Log the error
        res.status(500).json({ message: error.message });
    }
}; 

exports.getAssessmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const assessment = await Assessment.findById(id);
        if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
        res.status(200).json(assessment);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}