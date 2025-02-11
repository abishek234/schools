import { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Container, Alert, Card, CardContent } from "@mui/material";

export default function AttendanceTracking() {
  const [studentId, setStudentId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendancePercentage, setAttendancePercentage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message

    try {
      const response = await axios.get(
        `http://localhost:9000/api/attendances/attendance/percentage`,
        {
          params: {
            studentId,
            startDate,
            endDate,
          },
        }
      );
      setAttendancePercentage(response.data.percentage);
    } catch (error) {
      console.error("Error fetching attendance percentage:", error);
      setErrorMessage("Failed to fetch attendance percentage.");
    }
  };

  return (
    <Container maxWidth="lg" style={{ padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Attendance Tracking
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Student ID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <TextField
          label="Start Date"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <TextField
          label="End Date"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Get Attendance Percentage
        </Button>
      </form>

      {/* Show Attendance Percentage inside a Card */}
      {attendancePercentage !== null && (
        <Card style={{ marginTop: "20px" }}>
          <CardContent>
            <Typography variant="h6" align="center">
              Attendance Percentage: {attendancePercentage.toFixed(2)}%
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Show error message */}
      {errorMessage && (
        <Alert severity="error" style={{ marginTop: "20px" }}>
          {errorMessage}
        </Alert>
      )}
    </Container>
  );
}
