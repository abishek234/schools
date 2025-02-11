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

export default function StudentDialog({ open, onClose, studentId, fetchstudents }) {
  const [studentData, setstudentData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    rollno: '',
    classid: '',
    phoneNumber: '',
    gender: '',
    dateofbirth: '',
    schoolname: '',
    Address: '',
    State: '',
    City: '',
    Pincode: '',
  });

  useEffect(() => {
    if (studentId) {
      // Fetch student details for editing
      const fetchstudentDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:9000/api/students/student/${studentId}`);
          const student = response.data;

          setstudentData({
            ...student,
            dateofbirth: student.dateofbirth
              ? new Date(student.dateofbirth).toISOString().split('T')[0]
              : '',
          });
        } catch (error) {
          console.error("Error fetching student details:", error);
        }
      };
      fetchstudentDetails();
    }
  }, [studentId]);

  const handleUpdatestudent = async () => {
    try {
  
      const response = await axios.put(`http://localhost:9000/api/students/student/${studentId}`, studentData);
      if (response.status === 200 || response.status === 201) {
      fetchstudents(); // Refresh student list
      onClose(); // Close dialog
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Student</DialogTitle>
      <DialogContent>
        <TextField
          label="First Name"
          value={studentData.firstname}
          onChange={(e) => setstudentData({ ...studentData, firstname: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          value={studentData.lastname}
          onChange={(e) => setstudentData({ ...studentData, lastname: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={studentData.email}
          onChange={(e) => setstudentData({ ...studentData, email: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Roll Number"
          value={studentData.rollno}
          onChange={(e) => setstudentData({ ...studentData, rollno: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Class ID"
          value={studentData.classid}
          onChange={(e) => setstudentData({ ...studentData, classid: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone Number"
          value={studentData.phoneNumber}
          onChange={(e) => setstudentData({ ...studentData, phoneNumber: e.target.value })}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Gender</InputLabel>
          <Select
            value={studentData.gender}
            onChange={(e) => setstudentData({ ...studentData, gender: e.target.value })}
          >
            <MenuItem value="">Select Gender</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Date of Birth"
          type="date"
          value={studentData.dateofbirth}
          onChange={(e) => setstudentData({ ...studentData, dateofbirth: e.target.value })}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="School Name"
          value={studentData.schoolname}
          onChange={(e) => setstudentData({ ...studentData, schoolname: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          value={studentData.Address}
          onChange={(e) => setstudentData({ ...studentData, Address: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="State"
          value={studentData.State}
          onChange={(e) => setstudentData({ ...studentData, State: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="City"
          value={studentData.City}
          onChange={(e) => setstudentData({ ...studentData, City: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Pincode"
          value={studentData.Pincode}
          onChange={(e) => setstudentData({ ...studentData, Pincode: e.target.value })}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdatestudent}>Update Student</Button>
      </DialogActions>
    </Dialog>
  );
}
