// CreateMeeting.jsx
import { useState } from "react";
import { Button, TextField, Typography, Box,Card } from "@mui/material";
import axios from "axios";


const CreateMeeting = () => {
  const [meetingLink, setMeetingLink] = useState("");
  const [email, setEmail] = useState("");

  const generateLink = () => {
    const link = `${window.location.origin}/meeting/${crypto.randomUUID()}`;
    setMeetingLink(link);
  };

  const sendEmail = () => {
    if (!email || !meetingLink) return alert("Please generate a link and enter an email");
    // Implement email sending logic (e.g., using EmailJS or backend API)
    try {
      const response = axios.post("http://localhost:9000/api/videos/video/meeting", { email, meetingLink });
      alert(`Meeting link sent to ${email}: ${meetingLink}`);
    } catch (error) {
        console.error("Error sending email:", error);
        alert("Error sending email. Please try again.");
        }
  };

  return (
    <Box textAlign="center" p={3}>
      <Typography variant="h5">Create Meeting</Typography>
      <Button variant="contained" color="primary" onClick={generateLink} sx={{ mt: 2 }}>
        Generate Meeting Link
      </Button>
      {meetingLink && (
        <Card sx={{ mt: 2 }}>
            <Typography variant="body1">Meeting Link:</Typography>
            <Typography variant="body2" color="primary">
                {meetingLink}
            </Typography>
        </Card>
      )}
      <TextField
        label="Parent Email"
        variant="outlined"
        fullWidth
        sx={{ mt: 2 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={sendEmail}>
        Send Email
      </Button>
    </Box>
  );
};

export default CreateMeeting;