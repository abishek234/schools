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
import { sub } from 'date-fns';

export default function VideosAddDialog({ open, onClose}) {
  const [videosData, setVideosData] = useState({
    subject: '',
    chapter:'',
    topic: '',
    videoId: '',
    materialId: '',
    class: '',
    form: '',
    teacherId: localStorage.getItem('userId'),
  });

  const handleAddVideos = async () => {
    try {


      // Send a POST request to save the videos
     const response = await axios.post(`http://localhost:9000/api/videos/video`, videosData);
     if(response.status === 200 || response.status === 201){
      alert('videos added successfully');
      onClose(); 
     }
    } catch (error) {
      console.error('Error adding videos:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add videos</DialogTitle>
      <DialogContent>
        <TextField
          label="Subject"
          value={videosData.subject}
          onChange={(e) => setVideosData({ ...videosData, subject: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Chapter"
          value={videosData.chapter}
          onChange={(e) => setVideosData({ ...videosData, chapter: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Topic"
          value={videosData.topic}
          onChange={(e) => setVideosData({ ...videosData, topic: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Video Id"
          value={videosData.videoId}
          onChange={(e) => setVideosData({ ...videosData, videoId: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Material Id"
          value={videosData.materialId}
          onChange={(e) => setVideosData({ ...videosData, MaterialId: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Class"
          value={videosData.class}
          onChange={(e) => setVideosData({ ...videosData, class: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Form"
          value={videosData.form}
          onChange={(e) => setVideosData({ ...videosData, form: e.target.value })}
          fullWidth
          margin="normal"
        />
        </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddVideos}>Save videos</Button>
      </DialogActions>
    </Dialog>
  );
}
