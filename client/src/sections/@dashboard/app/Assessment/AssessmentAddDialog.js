import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

export default function AssessmentAddDialog({ open, onClose,fetchassessments }) {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setErrorMessage('');
    setSuccessMessage(''); // Clear success message on file change

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

          const requiredHeaders = ['class', 'subject', 'topic', 'chapter', 'email', 'rollNo', 'score'];
          const missingHeaders = requiredHeaders.filter(header => 
            !Object.prototype.hasOwnProperty.call(jsonData[0], header)
          );

          if (missingHeaders.length > 0) {
            setErrorMessage(`Missing headers: ${missingHeaders.join(', ')}`);
            setFile(null);
          } else {
            console.log("File uploaded successfully!");
            setSuccessMessage('File processed successfully!'); // Show success message on valid file
           
          }
          
        } catch (error) {
          console.error("Error processing file:", error);
          setErrorMessage('An error occurred while processing the file.');
          setFile(null);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:9000/api/assessments/assessment/upload', formData);
      
      // Check for success in response status
        
        alert('File uploaded successfully!'); // Set success message
        setSuccessMessage(''); // Clear success message after 5 seconds
        onClose(); // Close the dialog

        fetchassessments(); // Refresh assessments list
      
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Failed to upload file.");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Upload Assessment File</DialogTitle>
      <DialogContent>
        <TextField
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileChange}
          fullWidth
          required
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpload}>Upload</Button>
      </DialogActions>
    </Dialog>
  );
}
