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

export default function TeacherViewDialog({ open, onClose, teacherId }) {
 
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
            firstname: teacher.firstname || '',
            lastname: teacher.lastname || '',
            email: teacher.email || '',
            phoneNumber: teacher.phoneNumber || '',
            gender: teacher.gender || '',
            designation: teacher.designation || '',
            handlingclass: teacher.handlingclass || '',
            dateofbirth: teacher.dateofbirth ? new Date(teacher.dateofbirth).toISOString().split('T')[0] : '', // Format date
            schoolname: teacher.schoolname || '',
            Address: teacher.Address || '',
            State: teacher.State || '',
            City: teacher.City || '',
            Pincode: teacher.Pincode || '',
          });
        } catch (error) {
          console.error("Error fetching teacher details:", error);
        }
      };
      fetchTeacherDetails();
    } else {
      // Reset fields for adding a new teacher
      setTeacherData({
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
    }
  }, [teacherId]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Teacher Details</DialogTitle>
      <DialogContent>
        <TextField
          label="First Name"
          value={teacherData.firstname}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField
          label="Last Name"
          value={teacherData.lastname}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField
          label="Email"
          value={teacherData.email}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField
          label="Phone Number"
          value={teacherData.phoneNumber}
          fullWidth
          margin='normal'
          disabled
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Gender</InputLabel>
          <Select
           value={teacherData.gender}
           disabled
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
          fullWidth
          margin='normal'
          disabled
        />
        <TextField  
          label="Handling Class"
          value={teacherData.handlingclass}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField
          label="School Name"
          value={teacherData.schoolname}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField
          label= "Date of Birth"
          value={teacherData.dateofbirth}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField
         label="Address"
         value={teacherData.Address}
         fullWidth
         margin='normal'
         disabled
         />
         <TextField
         label="City"
         value={teacherData.City}
         fullWidth
         margin='normal'
         disabled
         />
         <TextField
         label="State"
         value={teacherData.State}
         fullWidth
         margin='normal'
         disabled
         />
         <TextField
         label="Pincode"
         value={teacherData.Pincode}
         fullWidth
         margin='normal'
         disabled
         />

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
