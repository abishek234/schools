import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Alert,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  FormControl,
  InputLabel,
} from "@mui/material";

import axios from "axios";
import { toast } from "react-toastify";
import Iconify from "../components/Iconify";
import { TimetableAddDialog } from "../sections/@dashboard/app";

export default function TimeTableTracking  ()  {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for filtering
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [classId, setClassId] = useState("");

  // Timetable data states
  const [teacherTimetableData, setTeacherTimetableData] = useState([]);
  const [classTimetableData, setClassTimetableData] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);

  // Fetching teachers from the backend
  useEffect(() => {
    const fetchTeachers = async () => {
      const adminSchoolName = localStorage.getItem("userschool");
      try {
        const response = await axios.get(
          `http://localhost:9000/api/teachers/teacher?schoolname=${adminSchoolName}`
        );
        const teacherOptions = response.data.map((t) => ({
          label: `${t.firstname} ${t.lastname}`,
          value: t._id,
        }));
        setTeachers(teacherOptions);
      } catch (err) {
        console.error("Error fetching teachers:", err);
        toast.error("Failed to fetch teachers. Please try again.");
      }
      setLoading(false);
    };
    fetchTeachers();
  }, []);

  // Fetch timetable based on teacher
  const fetchTimetableByTeacher = async () => {
    if (!selectedTeacher) return;

    setError(null);
    setLoading(true);

    try {
      const selectedTeacherData = teachers.find(
        (teacher) => teacher.value === selectedTeacher
      );
      const response = await axios.get(
        `http://localhost:9000/api/timetables/gettimetable/${selectedTeacherData.label.split(" ")[0]}/${selectedTeacherData.label.split(" ")[1]}`
      );

      if (Array.isArray(response.data)) {
        setTeacherTimetableData(response.data);
        setClassTimetableData([]);
      } else {
        setError("Invalid response format for teacher-based fetch");
      }
    } catch (error) {
      console.error("Error fetching timetable by teacher:", error);
      setError("Failed to fetch timetable by teacher.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch timetable based on class ID
  const fetchTimetableByClass = async () => {
    if (!classId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:9000/api/timetables/getperiods/${classId}`
      );

      if (typeof response.data === "object" && response.data !== null) {
        setClassTimetableData(response.data);
        setTeacherTimetableData([]);
      } else {
        setError("Invalid response format for class-based fetch");
      }
    } catch (error) {
      console.error("Error fetching timetable by class:", error);
      setError("Failed to fetch timetable by class.");
    } finally {
      setLoading(false);
    }
  };

    // Open the timetable add dialog
    const handleOpenDialog = () => {
        setOpenDialog(true);
      };
    
      // Close the timetable add dialog
      const handleCloseDialog = () => {
        setOpenDialog(false);
      };

  return (
    <Container maxWidth="lg" style={{ padding: "20px" }}>
             <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Student
                    </Typography>
                    <Button variant="contained" onClick={handleOpenDialog} startIcon={<Iconify icon="eva:plus-fill" />}>
                        New Timetable
                    </Button>
                </Stack>

      {/* Teacher Selection Dropdown */}
      <Grid container spacing={2} style={{ marginBottom: "20px" }}>
        <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel >Select Teacher</InputLabel>
          <Select
            variant="outlined"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            fullWidth
          >
            {teachers.map((teacher) => (
              <MenuItem key={teacher.value} value={teacher.value}>
                {teacher.label}
              </MenuItem>
            ))}
          </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Class ID Input */}
      <TextField
       label="Class ID"
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
        fullWidth
        style={{ marginBottom: "20px" }}
      />

      {/* Buttons to fetch timetable */}
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={fetchTimetableByTeacher}>
            Get Timetable by Teacher
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={fetchTimetableByClass}>
            Get Timetable by Class
          </Button>
        </Grid>
      </Grid>

      {/* Loading and Error Handling */}
      {loading && <CircularProgress style={{ display: "block", margin: "auto", marginTop: "20px" }} />}
      {error && <Alert severity="error" style={{ margin: "20px" }}>{error}</Alert>}

      {/* Displaying Timetable Data in Card Format */}
      {teacherTimetableData.length > 0 && (
        <Card style={{ marginTop: "20px" }}>
          <CardHeader title="Teacher Timetable" />
          <Divider />
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Day</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teacherTimetableData.map((entry) =>
                    entry.schedule.map((period, index) => (
                      <TableRow key={`${entry._id}-${index}`}>
                        <TableCell>{period.day}</TableCell>
                        <TableCell>{entry.subject}</TableCell>
                        <TableCell>{period.startTime}</TableCell>
                        <TableCell>{period.endTime}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {Object.keys(classTimetableData).length > 0 && (
        <Card style={{ marginTop: "20px" }}>
          <CardHeader title="Class Timetable" />
          <Divider />
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Day</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(classTimetableData).map(([day, periods]) =>
                    periods.map((period, index) => (
                      <TableRow key={`${day}-${index}`}>
                        {index === 0 && <TableCell rowSpan={periods.length}>{day}</TableCell>}
                        <TableCell>{period.subject}</TableCell>
                        <TableCell>{period.startTime}</TableCell>
                        <TableCell>{period.endTime}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
      <TimetableAddDialog open={openDialog} onClose={handleCloseDialog} />
    </Container>
  );
};


