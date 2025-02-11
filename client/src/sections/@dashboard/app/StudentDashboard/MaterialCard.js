import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, Button, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const MaterialCard = ({ className, subject, chapter, topic, onBackClick }) => {
    const [videoIds, setVideoIds] = useState([]);
    const [loadingDownload, setLoadingDownload] = useState(false);
    const [userId] = useState(localStorage.getItem('userId'));
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [openform, setOpenForm] = useState(false);

    useEffect(() => { 
        fetchVideoIds();
    }, [className, subject, chapter, topic]);

    const fetchVideoIds = async () => {
        try {
            const response = await axios.get(
                `http://localhost:9000/api/videos/videos/${className}/${subject}/${chapter}/${topic}/videos`
            );
            const videosWithCompletion = response.data.map(video => ({
                ...video,
                completedBy: video.completedBy || [],
                form: video.form || null, // Ensure the form property exists
            }));
            console.log("Fetched Videos:", videosWithCompletion); // Debugging
            setVideoIds(videosWithCompletion);
            await fetchCompletionStatus(videosWithCompletion);
        } catch (error) {
            console.error('Error fetching video IDs:', error);
            toast.error('Failed to fetch video IDs.');
        }
    };
    
    const fetchCompletionStatus = async videos => {
        try {
            const completionPromises = videos.map(video =>
                axios.get(`http://localhost:9000/api/videos/video/${video._id}/completed/${userId}`)
            );
            const completionResults = await Promise.all(completionPromises);
            const updatedVideos = videos.map((video, index) => ({
                ...video,
                isCompleted: completionResults[index].data.isCompleted,
            }));
            setVideoIds(updatedVideos);
        } catch (error) {
            console.error('Error fetching completion status:', error);
            toast.error('Failed to fetch completion status.');
        }
    };

    const handleOpenForm = (videoId) => {
        console.log("form");
        const video = videoIds.find(video => video._id === videoId);
        if (video?.form) { // Ensure the video exists and has a form
            setOpenForm(true);
            setSelectedVideoId(videoId);
        } else {
            toast.error('Form not available for this video.');
        }
    };
    

    const handleDownload = materialId => {
        setLoadingDownload(true);
        const downloadLink = `https://drive.google.com/uc?export=download&id=${materialId.split('/')[5]}`;
        window.open(downloadLink, '_blank');
        setTimeout(() => setLoadingDownload(false), 1000);
    };

    useEffect(() => {
        if (selectedVideoId) {
            document.body.style.userSelect = 'none';
            const disableContextMenu = e => e.preventDefault();
            document.addEventListener('contextmenu', disableContextMenu);

            return () => {
                document.body.style.userSelect = '';
                document.removeEventListener('contextmenu', disableContextMenu);
            };
        }
    }, [selectedVideoId]);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Materials
            </Typography>
            <Button variant="contained" onClick={onBackClick} sx={{ marginBottom: 2 }}>
                Back
            </Button>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 4,
                }}
            >
                {videoIds.map(video => (
                    <Card key={video._id} sx={{ padding: 3, boxShadow: 5 }}>
                        <iframe
                            width="100%"
                            height="250"
                            src={video.videoId}
                            title={chapter}
                            frameBorder="0"
                            allowFullScreen
                        />
                        <Box mt={2}>
                        <Button
    variant="contained"
    color={video.isCompleted ? 'success' : 'primary'}
    onClick={() => handleOpenForm(video._id)}
    disabled={video.isCompleted}
>
    {video.isCompleted ? 'Completed' : 'Mark as Completed'}
</Button>

                        </Box>
                        {video.materialId && (
                            <Box mt={2}>
                                <Typography variant="subtitle1">Material PDF:</Typography>
                                {loadingDownload ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleDownload(video.materialId)}
                                        sx={{ marginTop: 1 }}
                                    >
                                        Download
                                    </Button>
                                )}
                            </Box>
                        )}
{openform && selectedVideoId === video._id && video.form && (
    <Box mt={2}>
        <Typography variant="h6">Please fill out this form:</Typography>
        <iframe
            src={video.form}
            width="100%"
            height="400"
            style={{ border: 'none' }}
            title="Google Form"
        />
        <Button
            variant="contained"
            color="primary"
            onClick={() => {
                setOpenForm(false); // Close the form
                setSelectedVideoId(null);
            }}
            sx={{ marginTop: 2 }}
        >
            Close Form
        </Button>
    </Box>
)}



                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default MaterialCard;
