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

export default function VideosViewDialog({ open, onClose, videosId }) {
 
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

         
          setVideosData({
            subject: videos.subject || '',
            chapter: videos.chapter || '',
            topic: videos.topic || '',
            videoId: videos.videoId || '',
            materialId: videos.materialId || '',
            class: videos.class || '',
            form: videos.form || '',
          });
        } catch (error) {
          console.error("Error fetching videos details:", error);
        }
      };
      fetchvideosDetails();
    } else {
      // Reset fields for adding a new videos
      setVideosData({
        subject: '',
        chapter:'',
        topic: '',
        videoId: '',
        materialId: '',
        class: '',
        form: '',
        teacherId: localStorage.getItem('userId'),
      })
    }
  }, [videosId]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Videos Details</DialogTitle>
      <DialogContent>
        <TextField
          label="Subject"
          value={videosData.subject}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Chapter"
          value={videosData.chapter}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Topic"
          value={videosData.topic}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Video Id"
          value={videosData.videoId}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Material Id"
          value={videosData.materialId}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Class"
          value={videosData.class}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Form"
          value={videosData.form}
          fullWidth
          margin="normal"
          disabled
        />
        
        </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
