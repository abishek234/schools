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

AdminDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  adminId: PropTypes.string,
  fetchadmins: PropTypes.func.isRequired,
};


export default function AdminDialog({ open, onClose, adminId, fetchadmins }) {
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
            ...admin,
            dateofbirth: admin.dateofbirth
              ? new Date(admin.dateofbirth).toISOString().split('T')[0]
              : '',
          });
        } catch (error) {
          console.error("Error fetching admin details:", error);
        }
      };
      fetchadminDetails();
    }
  }, [adminId]);

  const handleUpdateadmin = async () => {
    try {
   // Update existing admin
      const response = await axios.put(`http://localhost:9000/api/admins/admin/${adminId}`, adminData);
      if(response.status === 200){
        alert("Admin Updated Successfully");
      } 

      fetchadmins(); // Refresh admin list
      onClose(); // Close dialog
    } catch (error) {
      console.error('Error updating admin:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Admin</DialogTitle>
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
        <Button onClick={handleUpdateadmin}>Update Admin</Button>
      </DialogActions>
    </Dialog>
  );
}
