import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";

export default function TopicCard({ className, subject, chapter, onTopicClick, onBackClick }) {
  const [topics, setTopics] = useState([]); // Initialize with an empty array

  useEffect(() => {
    const fetchtopics = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const response = await axios.get(
          `http://localhost:9000/api/videos/videos/${userId}/${className}/${subject}/${chapter}`
        );
        setTopics(response.data); // Set the topics from the response
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchtopics();
  }, [className, subject, chapter]);

  console.log(topics);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Topics
      </Typography>
      <Button variant="contained" onClick={onBackClick} style={{ marginBottom: "10px" }}>
        Back
      </Button>
      {topics.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 4, // Increase spacing between cards
            justifyContent: "center", // Center align the cards
          }}
        >
          {topics.map((topicData, index) => {
            const { topic, isCompleted } = topicData;

            // Determine if the "Read Now" button should be shown
            const showReadNowButton =
              index === 0 || (topics[index - 1] && topics[index - 1].isCompleted);

            return (
              <Card
                key={index} // Use the index as a key since topics are strings
                sx={{
                  width: "90%", // Make the card wider
                  maxWidth: 400, // Limit the maximum width
                  boxShadow: 5,
                  "&:hover": { boxShadow: 8 },
                  textAlign: "center",
                  p: 2, // Add padding to the card
                }}
              >
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {topic}
                  </Typography>
                  {showReadNowButton && (
                    <Button
                      variant="contained"
                      onClick={() => onTopicClick(topic)}
                      style={{ marginTop: "10px" }}
                    >
                      Read Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No topics available.
        </Typography>
      )}
    </Box>
  );
}
