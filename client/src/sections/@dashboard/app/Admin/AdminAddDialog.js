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

export default function AdminAddDialog({ open, onClose}) {
  const [adminData, setadminData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    gender: '',
    password: '',
    designation: '',
    schoolname: '',
    Address: '',
    State: '',
    City: '',
    Pincode: '',
  });

  const handleAddadmin = async () => {
    try {
      console.log('adminData:', adminData);
 
      // Send a POST request to save the admin
      const response = await axios.post(`http://localhost:9000/api/admins/admin`, adminData);
      if (response.status === 200 || response.status === 201){alert('Admin added successfully');
      onClose(); // Close the dialog
      }
    } catch (error) {
      console.error('Error adding admin:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Admin</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={adminData.name}
          onChange={(e) => setadminData({ ...adminData, name: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={adminData.email}
          onChange={(e) => setadminData({ ...adminData, email: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone Number"
          value={adminData.phoneNumber}
          onChange={(e) => setadminData({ ...adminData, phoneNumber: e.target.value })}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Gender</InputLabel>
          <Select
            value={adminData.gender}
            onChange={(e) => setadminData({ ...adminData, gender: e.target.value })}
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
          value={adminData.password}
          onChange={(e) => setadminData({ ...adminData, password: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Designation"
          value={adminData.designation}
          onChange={(e) => setadminData({ ...adminData, designation: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="School Name"
          value={adminData.schoolname}
          onChange={(e) => setadminData({ ...adminData, schoolname: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          value={adminData.Address}
          onChange={(e) => setadminData({ ...adminData, Address: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="State"
          value={adminData.State}
          onChange={(e) => setadminData({ ...adminData, State: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="City"
          value={adminData.City}
          onChange={(e) => setadminData({ ...adminData, City: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Pincode"
          value={adminData.Pincode}
          onChange={(e) => setadminData({ ...adminData, Pincode: e.target.value })}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddadmin}>Save Admin</Button>
      </DialogActions>
    </Dialog>
  );
}
