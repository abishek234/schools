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

export default function TeacherAddDialog({ open, onClose}) {
  const [teacherData, setTeacherData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    gender: '',
    password: '',
    designation: '',
    handlingclass: '',
    dateofbirth: '',
    schoolname: '',
    Address: '',
    State: '',
    City: '',
    Pincode: '',
  });

  const handleAddTeacher = async () => {
    try {


      // Send a POST request to save the teacher
     const response = await axios.post(`http://localhost:9000/api/teachers/teacher`, teacherData);
     if(response.status === 200 || response.status === 201){
      alert('Teacher added successfully');
      onClose(); // Close the dialog
     }
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Teacher</DialogTitle>
      <DialogContent>
        <TextField
          label="First Name"
          value={teacherData.firstname}
          onChange={(e) => setTeacherData({ ...teacherData, firstname: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          value={teacherData.lastname}
          onChange={(e) => setTeacherData({ ...teacherData, lastname: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={teacherData.email}
          onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone Number"
          value={teacherData.phoneNumber}
          onChange={(e) => setTeacherData({ ...teacherData, phoneNumber: e.target.value })}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Gender</InputLabel>
          <Select
            value={teacherData.gender}
            onChange={(e) => setTeacherData({ ...teacherData, gender: e.target.value })}
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
            value={teacherData.password}
            onChange={(e) => setTeacherData({ ...teacherData, password: e.target.value })}
            fullWidth
            margin="normal"
            />
        <TextField
          label="Designation"
          value={teacherData.designation}
          onChange={(e) => setTeacherData({ ...teacherData, designation: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Handling Class"
          value={teacherData.handlingclass}
          onChange={(e) => setTeacherData({ ...teacherData, handlingclass: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date of Birth"
          type="date"
          value={teacherData.dateofbirth}
          onChange={(e) => setTeacherData({ ...teacherData, dateofbirth: e.target.value })}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="School Name"
          value={teacherData.schoolname}
          onChange={(e) => setTeacherData({ ...teacherData, schoolname: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          value={teacherData.Address}
          onChange={(e) => setTeacherData({ ...teacherData, Address: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="State"
          value={teacherData.State}
          onChange={(e) => setTeacherData({ ...teacherData, State: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="City"
          value={teacherData.City}
          onChange={(e) => setTeacherData({ ...teacherData, City: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Pincode"
          value={teacherData.Pincode}
          onChange={(e) => setTeacherData({ ...teacherData, Pincode: e.target.value })}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddTeacher}>Save Teacher</Button>
      </DialogActions>
    </Dialog>
  );
}
