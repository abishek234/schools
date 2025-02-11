// GoogleMeetScheduler.js
import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Box, Button, Typography, TextField, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

export default function GoogleMeetScheduler  () {
    const [eventDetails, setEventDetails] = useState({
        summary: "Parent-Teacher Meeting",
        description: "Discuss student progress and address concerns.",
        location: "Online",
        start: "",
        end: "",
    });
    const [loading, setLoading] = useState(false);
    const [accessToken, setAccessToken] = useState(null);

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            setAccessToken(tokenResponse.access_token);
            toast.success("Google authentication successful!");
        },
        onError: () => toast.error("Google authentication failed."),
        scope: "https://www.googleapis.com/auth/calendar",
    });

    const createGoogleMeet = async () => {
        if (!accessToken) {
            toast.error("Please log in with Google first.");
            return;
        }

        const event = {
            summary: eventDetails.summary,
            location: eventDetails.location,
            description: eventDetails.description,
            start: {
                dateTime: eventDetails.start,
                timeZone: "Asia/Kolkata",
            },
            end: {
                dateTime: eventDetails.end,
                timeZone: "Asia/Kolkata",
            },
            conferenceData: {
                createRequest: {
                    requestId: "sample123",
                    conferenceSolutionKey: { type: "hangoutsMeet" },
                },
            },
        };

        setLoading(true);
        try {
            const response = await axios.post(
                "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
                event,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const meetLink = response.data.hangoutLink;
            toast.success(`Google Meet created successfully! Link: ${meetLink}`);
            console.log("Google Meet Link:", meetLink);
        } catch (error) {
            console.error("Error creating Google Meet:", error);
            toast.error("Failed to create Google Meet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Schedule Parent-Teacher Meeting
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Button variant="contained" onClick={login}>
                    Log in with Google
                </Button>
            </Box>

            <Box sx={{ display: "grid", gap: 2 }}>
                <TextField
                    label="Event Title"
                    value={eventDetails.summary}
                    onChange={(e) =>
                        setEventDetails({ ...eventDetails, summary: e.target.value })
                    }
                    fullWidth
                />
                <TextField
                    label="Description"
                    value={eventDetails.description}
                    onChange={(e) =>
                        setEventDetails({ ...eventDetails, description: e.target.value })
                    }
                    fullWidth
                />
                <TextField
                    label="Start Time"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) =>
                        setEventDetails({ ...eventDetails, start: e.target.value })
                    }
                    fullWidth
                />
                <TextField
                    label="End Time"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) =>
                        setEventDetails({ ...eventDetails, end: e.target.value })
                    }
                    fullWidth
                />
            </Box>

            <Box sx={{ mt: 2 }}>
                <Button
                    variant="contained"
                    onClick={createGoogleMeet}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={20} /> : "Create Google Meet"}
                </Button>
            </Box>
        </Box>
    );
};


