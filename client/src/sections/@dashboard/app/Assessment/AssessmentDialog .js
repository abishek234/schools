import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';
import { vi } from 'date-fns/locale';

AssessmentsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}


export default function AssessmentsDialog({ open, onClose, assessmentsId,fetchassessments}) {
  const [assessmentsData, setassessmentsData] = useState({
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

          setassessmentsData({ ...assessments });
          
        } catch (error) {
          console.error("Error fetching assessments details:", error);
        }
      };
      fetchassessmentsDetails();
    }
  }, [assessmentsId]);

  const handleUpdateassessments = async () => {
    try {
      // Update existing assessments
     const response = await axios.put(`http://localhost:9000/api/assessments/assessment/${assessmentsId}`, assessmentsData);
      if(response.status === 200 || response.status === 201){
       alert('assessments updated successfully');
      
      fetchassessments(); // Refresh assessments list
      onClose(); // Close dialog
      }
    } catch (error) {
      console.error('Error updating assessments:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Assessments</DialogTitle>
      <DialogContent>
        <TextField
          label="Roll No"
          value={assessmentsData.rollNo}
          onChange={(e) => setassessmentsData({ ...assessmentsData, rollNo: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={assessmentsData.email}
          onChange={(e) => setassessmentsData({ ...assessmentsData, email: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Class"
          value={assessmentsData.class}
          onChange={(e) => setassessmentsData({ ...assessmentsData, class: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Subject"
          value={assessmentsData.subject}
          onChange={(e) => setassessmentsData({ ...assessmentsData, subject: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Chapter"
          value={assessmentsData.chapter}
          onChange={(e) => setassessmentsData({ ...assessmentsData, chapter: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Topic"
          value={assessmentsData.topic}
          onChange={(e) => setassessmentsData({ ...assessmentsData, topic: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Score"
          value={assessmentsData.score}
          onChange={(e) => setassessmentsData({ ...assessmentsData, score: e.target.value })}
          fullWidth
          margin="normal"
        />
        </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdateassessments}>Update assessments</Button>
      </DialogActions>
    </Dialog>
  );
}
