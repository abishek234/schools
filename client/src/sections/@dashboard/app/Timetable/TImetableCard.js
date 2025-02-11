import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const Timetable = ({ classId }) => {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Define fixed time slots
  const fixedTimeSlots = [
    "09:00 - 09:45",
    "09:45 - 10:30",
    "10:30 - 10:45", // Break
    "10:45 - 12:15",
    "12:15 - 13:00", // Lunch
    "13:00 - 13:45",
    "13:45 - 14:30",
    "14:30 - 15:15",
    "15:15 - 15:30", // Break
    "15:30 - 16:30",
  ];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/timetables/getperiods/${classId}`
        );
        setTimetable(response.data);
      } catch (err) {
        setError("Failed to fetch timetable.");
        console.error("Error fetching timetable:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [classId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
        {error}
      </Typography>
    );
  }

  if (!timetable || Object.keys(timetable).length === 0) {
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        No timetable available for this class.
      </Typography>
    );
  }

  const days = Object.keys(timetable); // Dynamically get all days from the response

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Time
            </TableCell>
            {days.map((day) => (
              <TableCell key={day} align="center" sx={{ fontWeight: "bold" }}>
                {day}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {fixedTimeSlots.map((timeSlot, idx) => (
            <TableRow key={idx}>
              <TableCell align="center">{timeSlot}</TableCell>
              {days.map((day) => {
                const periods = timetable[day];
                const filteredPeriods = periods.filter(
                  (p) => `${p.startTime} - ${p.endTime}` === timeSlot
                );

                // Check for breaks or lunch
                if (timeSlot === "10:30 - 10:45") {
                  return (
                    <TableCell key={day} align="center">
                      {"Break"}
                    </TableCell>
                  );
                }
                if (timeSlot === "12:15 - 13:00") {
                  return (
                    <TableCell key={day} align="center">
                      {"Lunch"}
                    </TableCell>
                  );
                }
                if (timeSlot === "15:15 - 15:30") {
                  return (
                    <TableCell key={day} align="center">
                      {"Break"}
                    </TableCell>
                  );
                }

                // If no periods match the time slot, show a dash
                if (filteredPeriods.length === 0) {
                  return (
                    <TableCell key={day} align="center">
                      {"-"}
                    </TableCell>
                  );
                }

                // Handle merging of consecutive periods with the same subject
                const subject = filteredPeriods[0].subject;
                const rowSpan = filteredPeriods.length;

                return (
                  <TableCell key={day} align="center" rowSpan={rowSpan}>
                    {subject}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Timetable;
