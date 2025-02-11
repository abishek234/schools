import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import axios from 'axios';

export default function TimetableAddDialog({ open, onClose }) {
  const [timetableData, setTimetableData] = useState({
    firstname: '',
    lastname: '',
    classId: '',
    subject: '',
    schedule: [{ day: '', startTime: '', endTime: '' }],
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...timetableData.schedule];
    newSchedule[index][field] = value;
    setTimetableData({ ...timetableData, schedule: newSchedule });
  };

  const addScheduleRow = () => {
    setTimetableData({
      ...timetableData,
      schedule: [...timetableData.schedule, { day: '', startTime: '', endTime: '' }],
    });
  };

  const removeScheduleRow = (index) => {
    const newSchedule = timetableData.schedule.filter((_, i) => i !== index);
    setTimetableData({ ...timetableData, schedule: newSchedule });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        'http://localhost:9000/api/timetables/addtimetable',
        timetableData
      );
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage('Timetable added successfully!');
        setError(null);
        onClose(); // Close the dialog
      }
    } catch (err) {
      setError('Failed to add timetable. Please check your input.');
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Timetable</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <TextField
          label="First Name"
          value={timetableData.firstname}
          onChange={(e) =>
            setTimetableData({ ...timetableData, firstname: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          value={timetableData.lastname}
          onChange={(e) =>
            setTimetableData({ ...timetableData, lastname: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Class Id"
          value={timetableData.classId}
          onChange={(e) =>
            setTimetableData({ ...timetableData, classId: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Subject"
          value={timetableData.subject}
          onChange={(e) =>
            setTimetableData({ ...timetableData, subject: e.target.value })
          }
          fullWidth
          margin="normal"
        />

        {/* Render Schedule */}
        {timetableData.schedule.map((item, index) => (
          <Grid container item xs={12} spacing={2} key={index} style={{ marginBottom: '10px' }}>
            <Grid item xs={4}>
              <TextField
                label="Day (e.g., Monday)"
                value={item.day}
                onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Start Time (HH:mm)"
                value={item.startTime}
                onChange={(e) =>
                  handleScheduleChange(index, 'startTime', e.target.value)
                }
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="End Time (HH:mm)"
                value={item.endTime}
                onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={() => removeScheduleRow(index)}
                color="secondary"
                style={{ marginTop: '10px' }}
              >
                Remove Schedule
              </Button>
            </Grid>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Button onClick={addScheduleRow} color="primary" style={{ marginTop: '10px' }}>
            Add Schedule Row
          </Button>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Save Timetable</Button>
      </DialogActions>
    </Dialog>
  );
}
