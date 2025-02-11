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

export default function StudentViewDialog({ open, onClose, studentId }) {
 
  const [studentData, setStudentData] = useState({
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

         
          setStudentData({
            firstname: student.firstname || '',
            lastname: student.lastname || '',
            email: student.email || '',
            rollno: student.rollno || '',
            classid: student.classid || '',
            phoneNumber: student.phoneNumber || '',
            gender: student.gender || '',
            dateofbirth: student.dateofbirth ? new Date(student.dateofbirth).toISOString().split('T')[0] : '', // Format date
            schoolname: student.schoolname || '',
            Address: student.Address || '',
            State: student.State || '',
            City: student.City || '',
            Pincode: student.Pincode || '',
          });
        } catch (error) {
          console.error("Error fetching student details:", error);
        }
      };
      fetchstudentDetails();
    } else {
      // Reset fields for adding a new student
      setStudentData({
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
    }
  }, [studentId]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Student Details</DialogTitle>
      <DialogContent>
        <TextField
          label="First Name"
          value={studentData.firstname}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField
          label="Last Name"
          value={studentData.lastname}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField
          label="Email"
          value={studentData.email}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField
        label="Roll Number"
        value={studentData.rollno}
        fullWidth
        margin='normal'
        disabled
        />
        <TextField
        label="Class ID"
        value={studentData.classid}
        fullWidth
        margin='normal'
        disabled
        />
        <TextField
          label="Phone Number"
          value={studentData.phoneNumber}
          fullWidth
          margin='normal'
          disabled
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Gender</InputLabel>
          <Select
           value={studentData.gender}
           disabled
           >
            <MenuItem value="">Select Gender</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="School Name"
          value={studentData.schoolname}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField
          label= "Date of Birth"
          value={studentData.dateofbirth}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField
         label="Address"
         value={studentData.Address}
         fullWidth
         margin='normal'
         disabled
         />
         <TextField
         label="City"
         value={studentData.City}
         fullWidth
         margin='normal'
         disabled
         />
         <TextField
         label="State"
         value={studentData.State}
         fullWidth
         margin='normal'
         disabled
         />
         <TextField
         label="Pincode"
         value={studentData.Pincode}
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
