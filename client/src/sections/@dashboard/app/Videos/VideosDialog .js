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
import { vi } from 'date-fns/locale';

VideosDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}


export default function VideosDialog({ open, onClose, videosId,fetchvideos}) {
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
  useEffect(() => {
    if (videosId) {
      // Fetch videos details for editing
      const fetchvideosDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:9000/api/videos/videos/${videosId}`);
          const videos = response.data;

          setVideosData({ ...videos });
          
        } catch (error) {
          console.error("Error fetching videos details:", error);
        }
      };
      fetchvideosDetails();
    }
  }, [videosId]);

  const handleUpdatevideos = async () => {
    try {
      // Update existing videos
     const response = await axios.put(`http://localhost:9000/api/videos/video/${videosId}`, videosData);
      if(response.status === 200 || response.status === 201){
       alert('Videos updated successfully');
      
      fetchvideos(); // Refresh videos list
      onClose(); // Close dialog
      }
    } catch (error) {
      console.error('Error updating videos:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Videos</DialogTitle>
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
        <Button onClick={handleUpdatevideos}>Update Videos</Button>
      </DialogActions>
    </Dialog>
  );
}
