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

export default function AdminViewDialog({ open, onClose, adminId }) {
 
  const [adminData, setadminData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    gender: '',
    designation: '',
    schoolname: '',
    Address: '',
    State: '',
    City: '',
    Pincode: '',
  });

  useEffect(() => {
    if (adminId) {
      // Fetch admin details for editing
      const fetchadminDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:9000/api/admins/admin/${adminId}`);
          const admin = response.data;

         
          setadminData({
            name: admin.name || '',
            email: admin.email || '',
            phoneNumber: admin.phoneNumber || '',
            gender: admin.gender || '',
            designation: admin.designation || '',
            schoolname: admin.schoolname || '',
            Address: admin.Address || '',
            State: admin.State || '',
            City: admin.City || '',
            Pincode: admin.Pincode || '',
          });
        } catch (error) {
          console.error("Error fetching admin details:", error);
        }
      };
      fetchadminDetails();
    } else {
      // Reset fields for adding a new admin
      setadminData({
        name: '',
        email: '',
        phoneNumber: '',
        gender: '',
        designation: '',
        schoolname: '',
        Address: '',
        State: '',
        City: '',
        Pincode: '',
      });
    }
  }, [adminId]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Admin Details</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={adminData.name}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField
          label="Email"
          value={adminData.email}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField
          label="Phone Number"
          value={adminData.phoneNumber}
          fullWidth
          margin='normal'
          disabled
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Gender</InputLabel>
          <Select
           value={adminData.gender}
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
          value={adminData.designation}
          fullWidth
          margin='normal'
          disabled
        />
 
        <TextField
          label="School Name"
          value={adminData.schoolname}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField
         label="Address"
         value={adminData.Address}
         fullWidth
         margin='normal'
         disabled
         />
         <TextField
         label="City"
         value={adminData.City}
         fullWidth
         margin='normal'
         disabled
         />
         <TextField
         label="State"
         value={adminData.State}
         fullWidth
         margin='normal'
         disabled
         />
         <TextField
         label="Pincode"
         value={adminData.Pincode}
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
