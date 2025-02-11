import React, { useState } from 'react';
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

export default function StudentAddDialog({ open, onClose}) {
  const [studentData, setStudentData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    rollno: '',
    classid: '',
    phoneNumber: '',
    gender: '',
    password:'',
    dateofbirth: '',
    schoolname: '',
    Address: '',
    State: '',
    City: '',
    Pincode: '',
  });

  const handleAddstudent = async () => {
    try {
      // Send a POST request to save the student
     const response = await axios.post(`http://localhost:9000/api/students/student`, studentData);
     if(response.status === 200 || response.status === 201){
      alert('Student added successfully');
      onClose(); // Close the dialog
     }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Student</DialogTitle>
      <DialogContent>
        <TextField
          label="First Name"
          value={studentData.firstname}
          onChange={(e) => setStudentData({ ...studentData, firstname: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          value={studentData.lastname}
          onChange={(e) => setStudentData({ ...studentData, lastname: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={studentData.email}
          onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Roll Number"
          value={studentData.rollno}
          onChange={(e) => setStudentData({ ...studentData, rollno: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Class ID"
          value={studentData.classid}
          onChange={(e) => setStudentData({ ...studentData, classid: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone Number"
          value={studentData.phoneNumber}
          onChange={(e) => setStudentData({ ...studentData, phoneNumber: e.target.value })}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Gender</InputLabel>
          <Select
            value={studentData.gender}
            onChange={(e) => setStudentData({ ...studentData, gender: e.target.value })}
          >
            <MenuItem value="">Select Gender</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Password"
          type='password'
          value={studentData.password}
          onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date of Birth"
          type="date"
          value={studentData.dateofbirth}
          onChange={(e) => setStudentData({ ...studentData, dateofbirth: e.target.value })}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="School Name"
          value={studentData.schoolname}
          onChange={(e) => setStudentData({ ...studentData, schoolname: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          value={studentData.Address}
          onChange={(e) => setStudentData({ ...studentData, Address: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="State"
          value={studentData.State}
          onChange={(e) => setStudentData({ ...studentData, State: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="City"
          value={studentData.City}
          onChange={(e) => setStudentData({ ...studentData, City: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Pincode"
          value={studentData.Pincode}
          onChange={(e) => setStudentData({ ...studentData, Pincode: e.target.value })}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddstudent}>Save Student</Button>
      </DialogActions>
    </Dialog>
  );
}
