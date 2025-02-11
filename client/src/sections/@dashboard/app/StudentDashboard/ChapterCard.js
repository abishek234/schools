import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent,Button } from "@mui/material";

export default function ChapterCard({ className, subject,onChapterClick,onBackClick }) {
  const [chapters, setChapters] = useState([]); // Initialize with an empty array

  useEffect(() => {
    const fetchchapters = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/api/videos/videos/chapters/${className}/${subject}`);
        setChapters(response.data); // Set the chapters from the response
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchchapters();
  }, [className,subject]);

  console.log(chapters);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Chapters
      </Typography>
        <Button variant="contained" onClick={onBackClick} style={{marginBottom: "10px"}}>Back</Button>
      {chapters.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            flexWrap: "wrap",
            gap: 4, // Increase spacing between cards
            justifyContent: "center", // Center align the cards
          }}
        >
          {chapters.map((chapter, index) => (
            <Card
              key={index} // Use the index as a key since chapters are strings
              sx={{
                width: "90%", // Make the card wider
                maxWidth: 400, // Limit the maximum width
                cursor: "pointer",
                boxShadow: 5,
                "&:hover": { boxShadow: 8 },
                textAlign: "center",
                p: 2, // Add padding to the card
              }}
              onClick={() => onChapterClick(chapter)} // Pass the chapter name directly
            >
              <CardContent>
                <Typography
                  variant="h5" // Use a larger text size
                  sx={{ fontWeight: "bold" }}
                >
                  {chapter}
                  <Button variant="contained" onClick={() => onChapterClick(chapter)} style={{marginTop: "10px"}}>Read Now</Button>
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No chapters available.
        </Typography>
      )}
    </Box>
  );
}
