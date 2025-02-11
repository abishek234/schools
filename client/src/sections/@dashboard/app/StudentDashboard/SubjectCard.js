import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent } from "@mui/material";

export default function SubjectCard({ classId, onSubjectClick }) {
  const [subjects, setSubjects] = useState([]); // Initialize with an empty array

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/videos/videos/subjects/${classId}`
        );
        setSubjects(response.data); // Set the subjects from the response
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, [classId]);

  console.log(subjects);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Subjects
      </Typography>
      {subjects.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            flexWrap: "wrap",
            gap: 4, // Increase spacing between cards
            justifyContent: "center", // Center align the cards
          }}
        >
          {subjects.map((subject, index) => (
            <Card
              key={index} // Use the index as a key since subjects are strings
              sx={{
                width: "90%", // Make the card wider
                maxWidth: 400, // Limit the maximum width
                cursor: "pointer",
                boxShadow: 5,
                "&:hover": { boxShadow: 8 },
                textAlign: "center",
                p: 2, // Add padding to the card
              }}
              onClick={() => onSubjectClick(subject)} // Pass the subject name directly
            >
              <CardContent>
                <Typography
                  variant="h5" // Use a larger text size
                  sx={{ fontWeight: "bold" }}
                >
                  {subject}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No subjects available.
        </Typography>
      )}
    </Box>
  );
}
