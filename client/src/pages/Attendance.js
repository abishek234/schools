import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Checkbox,
  Tab,
  Tabs,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import { filter,isEmpty } from "lodash";

import { is } from "date-fns/locale";

import SearchNotFound from "../components/SearchNotFound";

export default function Attendance  ()  {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(1); // Default to 1st period
  const [filterName, setFilterName] = useState(""); // For search functionality
  const [page, setPage] = useState(0); // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5); // Items per page

  // Fetch students based on class ID
  const fetchStudents = async () => {
    const classId = localStorage.getItem("userhandlingclass");
    const schoolname = localStorage.getItem("userschool");
    try {
      const response = await axios.get(
        `http://localhost:9000/api/teachers/teacher/class/students?classid=${classId}&schoolname=${schoolname}`
      );
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setErrorMessage("Failed to load students.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle attendance checkbox change
  const handleCheckboxChange = (rollNo) => {
    setAttendanceData((prevData) => ({
      ...prevData,
      [rollNo]: !prevData[rollNo],
    }));
  };

  // Handle period selection change (Tab switch)
  const handlePeriodChange = (event, newValue) => {
    setSelectedPeriod(newValue);
  };

  const handleSubmit = async () => {
    const date = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    const subjects = localStorage.getItem("userhandlingclass");

    // Prepare periods data
    const periods = [
      {
        periodNumber: selectedPeriod, // Use selected period number
        subject: subjects,
        presentStudents: Object.keys(attendanceData).filter(
          (rollNo) => attendanceData[rollNo]
        ), // Collect roll numbers that are marked present
        absentStudents: students
          .map((student) => student.rollno)
          .filter((rollNo) => !attendanceData[rollNo]), // Collect roll numbers that are marked absent
      },
    ];

    try {
      await axios.post("http://localhost:9000/api/attendances/attendance", {
        classId: localStorage.getItem("userhandlingclass"),
        date,
        periods,
      });
      setSuccessMessage("Attendance marked successfully!");
      setErrorMessage("");
      setAttendanceData({});
    } catch (error) {
      console.error("Error marking attendance:", error);
      setErrorMessage(error.response?.data.message || "Failed to mark attendance.");
      setSuccessMessage("");
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Search filter
  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const filteredStudents = filter(students, (student) => {
    return (
      student.firstname.toLowerCase().includes(filterName.toLowerCase()) ||
      student.rollno.toString().toLowerCase().includes(filterName.toLowerCase())
    );
  });

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredStudents.length) : 0;

  return (
    <Container maxWidth="lg" style={{ padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Mark Attendance
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Period Tabs */}
          <Tabs value={selectedPeriod} onChange={handlePeriodChange} centered>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((period) => (
              <Tab label={`Period ${period}`} value={period} key={period} />
            ))}
          </Tabs>

          {/* Search Box */}
          <TextField
            label="Search by Name or Roll No"
            variant="outlined"
            fullWidth
            value={filterName}
            onChange={handleFilterByName}
            style={{ marginBottom: "20px", marginTop: "20px" }}
          />

          {/* Attendance Table */}
          <Card style={{ marginTop: "20px" }}>
            <TableContainer>
              <Table>
                {/* Table Header */}
                <TableRow>
                  <TableCell>Roll No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Present</TableCell>
                </TableRow>
                {/* Table Body */}
                <TableBody>
                  {filteredStudents
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((student) => (
                      <TableRow key={student._id}>
                        <TableCell>{student.rollno}</TableCell>
                        <TableCell>{student.firstname}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={attendanceData[student.rollno] || false}
                            onChange={() => handleCheckboxChange(student.rollno)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={3} />
                    </TableRow>
                  )}
                </TableBody>
                {isEmpty(filteredStudents) && (
            <TableBody>
            <TableRow>
                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <SearchNotFound searchQuery={filterName} />
                </TableCell>
            </TableRow>
        </TableBody>
            )}
              </Table>
            </TableContainer>
          </Card>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStudents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{ marginTop: "20px" }}
          />

  

          {/* Success or Error message */}
          {successMessage && (
            <Alert severity="success" style={{ marginTop: "20px" }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" style={{ marginTop: "20px" }}>
              {errorMessage}
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginTop: "20px" }}
          >
            Submit Attendance
          </Button>
        </>
      )}
    </Container>
  );
};


