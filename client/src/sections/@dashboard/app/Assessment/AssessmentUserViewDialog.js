import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

export default function AssessmentsViewDialog({ open, onClose, assessmentsId }) {
 
  const [assessmentsData, setAssessmentsData] = useState({
    rollNo:'',
    email:'',
    class:'',
    subject:'',
    chapter:'',
    topic:'',
    score:'',
  });

  useEffect(() => {
    if (assessmentsId) {
      // Fetch assessments details for editing
      const fetchassessmentsDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:9000/api/assessments/assessment/${assessmentsId}`);
          const assessments = response.data;

         
          setAssessmentsData({
            rollNo: assessments.rollNo || '',
            email: assessments.email || '',
            class: assessments.class || '',
            subject: assessments.subject || '',
            chapter: assessments.chapter || '',
            topic: assessments.topic || '',
            score: assessments.score || '',
          });
        } catch (error) {
          console.error("Error fetching assessments details:", error);
        }
      };
      fetchassessmentsDetails();
    } else {
      // Reset fields for adding a new assessments
      setAssessmentsData({
        rollNo:'',
        email:'',
        class:'',
        subject:'',
        chapter:'',
        topic:'',
        score:'',
      })
    }
  }, [assessmentsId]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Assessments Details</DialogTitle>
      <DialogContent>
        <TextField
          label="Roll No"
          value={assessmentsData.rollNo}
          onChange={(e) => setAssessmentsData({ ...assessmentsData, rollNo: e.target.value })}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Email"
          value={assessmentsData.email}
          onChange={(e) => setAssessmentsData({ ...assessmentsData, email: e.target.value })}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Class"
          value={assessmentsData.class}
          onChange={(e) => setAssessmentsData({ ...assessmentsData, class: e.target.value })}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Subject"
          value={assessmentsData.subject}
          onChange={(e) => setAssessmentsData({ ...assessmentsData, subject: e.target.value })}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Chapter"
          value={assessmentsData.chapter}
          onChange={(e) => setAssessmentsData({ ...assessmentsData, chapter: e.target.value })}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Topic"
          value={assessmentsData.topic}
          onChange={(e) => setAssessmentsData({ ...assessmentsData, topic: e.target.value })}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Score"
          value={assessmentsData.score}
          onChange={(e) => setAssessmentsData({ ...assessmentsData, score: e.target.value })}
          fullWidth
          margin="normal"
          disabled
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
