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

TeacherDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  teacherId: PropTypes.string,
  fetchTeachers: PropTypes.func.isRequired,
};


export default function TeacherDialog({ open, onClose, teacherId, fetchTeachers }) {
  const [teacherData, setTeacherData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    gender: '',
    designation: '',
    handlingclass: '',
    dateofbirth: '',
    schoolname: '',
    Address: '',
    State: '',
    City: '',
    Pincode: '',
  });

  useEffect(() => {
    if (teacherId) {
      // Fetch teacher details for editing
      const fetchTeacherDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:9000/api/teachers/teacher/${teacherId}`);
          const teacher = response.data;

          setTeacherData({
            ...teacher,
            dateofbirth: teacher.dateofbirth
              ? new Date(teacher.dateofbirth).toISOString().split('T')[0]
              : '',
          });
        } catch (error) {
          console.error("Error fetching teacher details:", error);
        }
      };
      fetchTeacherDetails();
    }
  }, [teacherId]);

  const handleUpdateTeacher = async () => {
    try {
      // Update existing teacher
     const response = await axios.put(`http://localhost:9000/api/teachers/teacher/${teacherId}`, teacherData);
      if(response.status === 200 || response.status === 201){
       alert('Teacher updated successfully');
      
      fetchTeachers(); // Refresh teacher list
      onClose(); // Close dialog
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Teacher</DialogTitle>
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
        <Button onClick={handleUpdateTeacher}>Update Teacher</Button>
      </DialogActions>
    </Dialog>
  );
}
