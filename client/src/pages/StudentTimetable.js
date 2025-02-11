import React from 'react';
import { Container,Typography } from '@mui/material';
import TimetableCard from '../sections/@dashboard/app/Timetable/TImetableCard';



export default function StudentTimeTable () {
    const classId = localStorage.getItem('userclassid');  
    console.log(classId);  
  return (
    <Container maxWidth="lg" style={{ padding: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
            TimeTable
        </Typography>
        <TimetableCard classId={classId} />
    </Container>
  );
};






