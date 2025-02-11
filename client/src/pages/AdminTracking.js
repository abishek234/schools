import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Container,
    Typography,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select as MUISelect,
    MenuItem,
    CircularProgress,
    Alert,
    Grid,
  } from '@mui/material';
import Page from '../components/Page';

const AdminTracking = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    

    // Fetch all teachers when the component mounts
    useEffect(() => {
        const fetchTeachers = async () => {
           
            const adminSchoolName = localStorage.getItem('userschool');
            try {
                const response = await axios.get(`http://localhost:9000/api/teachers/teacher?schoolname=${adminSchoolName}`);
                const teacherOptions = response.data.map(t => ({ label: `${t.firstname} ${t.lastname}`, value: t._id }));
                setTeachers(teacherOptions);
                // Optionally set the first teacher as default
                if (teacherOptions.length > 0) {
                    setSelectedTeacher(teacherOptions[0]);
                }

            } catch (err) {
                console.error('Error fetching teachers:', err);
                toast.error('Failed to fetch teachers. Please try again.');
            } 
        };

        fetchTeachers();
    }, []);

    // Fetch subjects whenever selectedTeacher changes
    useEffect(() => {
        if (selectedTeacher) {
            handleFetchSubjects();
        }
    }, [selectedTeacher]);

    // Fetch subjects for the selected teacher
    const handleFetchSubjects = async () => {
        if (!selectedTeacher) {
            toast.error('Please select a teacher.');
            return;
        }
       
        try {
            console.log("Fetching subjects for:", selectedTeacher.label);
            const response = await axios.get(`http://localhost:9000/api/admins/admin/teachers/subject/${selectedTeacher.label.split(' ')[0]}/${selectedTeacher.label.split(' ')[1]}`);
            const subjectOptions = response.data.map(s => ({ label: s ,value: s }));
            console.log(response.data);
            setSubjects(subjectOptions);
            console.log("Subjects:", subjectOptions);
            setSelectedSubject(null);
            setChapters([]);
            setSelectedChapter(null);
            setTopics([]);
            setSelectedTopic(null);
        } catch (err) {
            console.error('Error fetching subjects:', err);
            toast.error('Failed to fetch subjects. Please try again.');
        }
    };

    // Fetch chapters for the selected subject
    useEffect(() => {
        if (selectedSubject) {
            handleFetchChapters();
        }
    }, [selectedSubject]);

    const handleFetchChapters = async () => {
        if (!selectedTeacher || !selectedSubject) {
            toast.error('Please select a teacher and a subject.');
            return;
        }
      
        try {
            console.log("Fetching chapters for:", selectedSubject.value);
            const response = await axios.get(`http://localhost:9000/api/admins/admin/chapters/${selectedTeacher.label.split(' ')[0]}/${selectedTeacher.label.split(' ')[1]}/${selectedSubject.value}`);
            const chapterOptions = response.data.map(chapter => ({ label: chapter.title || chapter, value: chapter._id || chapter }));
            console.log(response.data);
            setChapters(chapterOptions);
            setSelectedChapter(null);
            setTopics([]);
            setSelectedTopic(null);
        } catch (err) {
            console.error('Error fetching chapters:', err);
            toast.error('Failed to fetch chapters. Please try again.');
        }
    };

    // Fetch topics for the selected chapter
    useEffect(() => {
        if (selectedChapter) {
            handleFetchTopics();
        }
    }, [selectedChapter]);

    const handleFetchTopics = async () => {
        if (!selectedChapter.value || !selectedSubject || !selectedTeacher) {
            toast.error('Please select a chapter.');
            return;
        }

        try {
            console.log("Fetching topics for:", selectedChapter.value); // Debugging log
            const response = await axios.get(`http://localhost:9000/api/admins/admin/topics/${selectedTeacher.label.split(' ')[0]}/${selectedTeacher.label.split(' ')[1]}/${selectedSubject.value}/${selectedChapter.value}`);

            console.log("Fetched Topics:", response.data); // Log fetched topics
            const topicOptions = response.data.map(topic => ({ label: topic.title || topic, value: topic._id || topic }));

            setTopics(topicOptions); // Set formatted topics
            setSelectedTopic(null); // Reset selected topic
            setVideos([]); // Reset videos

        } catch (err) {
            console.error('Error fetching topics:', err);
            toast.error('Failed to fetch topics. Please try again.');
        }
    };

    useEffect(() => {
        if (selectedTopic) {
            handleFetchVideos(); // Automatically fetch videos when selectedTopic changes
        }
    }, [selectedTopic]); 

    const handleFetchVideos = async () => {
        // Ensure selectedTopic is valid and has a value
        console.log(selectedTopic, selectedChapter, selectedSubject, selectedTeacher);
        if (!selectedTopic || !selectedChapter || !selectedSubject || !selectedTeacher) {
            toast.error('Please select a topic.');
            return;
        }
        setLoading(true);
        try {
            console.log("Fetching videos for:", selectedTopic.value);
            const response = await axios.get(`http://localhost:9000/api/admins/admin/videos/${selectedTeacher.label.split(' ')[0]}/${selectedTeacher.label.split(' ')[1]}/${selectedSubject.value}/${selectedChapter.value}/${selectedTopic.value}`);
            console.log("Fetched Videos:", response.data);

            // Parse the response data
            const { VideoIds, Materials } = response.data;

            if (!Array.isArray(VideoIds) || !Array.isArray(Materials)) {
                throw new Error('Invalid API response format');
            }

            const parsedVideos = VideoIds.map((videosId, index) => ({
                _id: `${selectedTopic.value}-${index}`,
                subject: selectedSubject.value,
                chapter: selectedChapter.value,
                videoId: videosId,
                materialId: Materials[index]
            }));

            setVideos(parsedVideos);
            setError(null);
        } catch (err) {
            console.error('Error fetching videos:', err);
            toast.error('Failed to fetch videos. Please try again.');
        }finally{   
            setLoading(false);
        }
    };

    const getEmbeddableLink = (link) => {
        const regex = /\/d\/([a-zA-Z0-9_-]+)/;
        const match = link.match(regex);
        return match ? `https://drive.google.com/file/d/${match[1]}/preview` : link; // Return embeddable link or original if not found
    };


    return (
        <Page title="Admin Tracking">
        <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>
            Admin Video Tracking
        </Typography>


        {loading && <CircularProgress style={{ margin: '20px auto', display: 'block' }} />}
        <Card>
            <CardContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Teacher</InputLabel>
                    <MUISelect
                        value={selectedTeacher?.value || ''}
                        onChange={(e) => setSelectedTeacher(teachers.find((t) => t.value === e.target.value))}
                        label="Teacher"
                    >
                        {teachers.map((teacher) => (
                            <MenuItem key={teacher.value} value={teacher.value}>
                                {teacher.label}
                            </MenuItem>
                        ))}
                    </MUISelect>
                </FormControl>
            </CardContent>
        </Card>

        {/* Subject Selection */}
        {selectedTeacher && (
            <Card style={{ marginTop: '16px' }}>
                <CardContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Subject</InputLabel>
                        <MUISelect
                            value={selectedSubject?.value || ''}
                            onChange={(e) => setSelectedSubject(subjects.find((s) => s.value === e.target.value))}
                            label="Subject"
                        >
                            {subjects.map((subject) => (
                                <MenuItem key={subject.value} value={subject.value}>
                                    {subject.label}
                                </MenuItem>
                            ))}
                        </MUISelect>
                    </FormControl>
                </CardContent>
            </Card>
        )}

        {/* Chapter Selection */}
        {selectedSubject && (
            <Card style={{ marginTop: '16px' }}>
                <CardContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Chapter</InputLabel>
                        <MUISelect
                            value={selectedChapter?.value || ''}
                            onChange={(e) => setSelectedChapter(chapters.find((c) => c.value === e.target.value))}
                            label="Chapter"
                        >
                            {chapters.map((chapter) => (
                                <MenuItem key={chapter.value} value={chapter.value}>
                                    {chapter.label}
                                </MenuItem>
                            ))}
                        </MUISelect>
                    </FormControl>
                </CardContent>
            </Card>
        )}
        
        {/* Topic Selection */}
        {selectedChapter && (
    <Card style={{ marginTop: '16px' }}>
        <CardContent>
            <FormControl fullWidth margin="normal">
                <InputLabel>Topic</InputLabel>
                <MUISelect
                    value={selectedTopic?.value || ''}
                    onChange={(e) => setSelectedTopic(topics.find((t) => t.value === e.target.value), () => {
                        if(selectedTopic){
                            handleFetchVideos();
                        }})}
                    
                    label="Topic"
                >
                    {topics.map((topic) => (
                        <MenuItem key={topic.value} value={topic.value}>
                            {topic.label}
                        </MenuItem>
                    ))}
                </MUISelect>
            </FormControl>
        </CardContent>
    </Card>
)}


        {/* Display Videos and Materials */}
        {videos.length > 0 && (
            <>
               <br />
                    {videos.map((video) => (
                        <div key={video._id} style={{ marginBottom: '20px' }}>
                            <Typography variant="h5" gutterBottom align="center" style={{ color: '#333' }}>Study Materials for {selectedTopic?.label}</Typography>
                            <Card style={{ marginBottom: '20px' }}>
                                <CardContent>
                            <iframe
                                width="800"
                                height="315"
                                src={video.videoId}
                                title={`Video ${video._id}`}
                                allowFullScreen
                            />
                            </CardContent>
                            </Card>
                            <Card style={{ marginBottom: '20px' }}>
                                <CardContent>
                            <h4>Material:</h4>
                            <iframe
                                width="800"
                                height="315"
                                src={getEmbeddableLink(video.materialId)}
                                title={`Material for ${video._id}`}
                                allowFullScreen
                            />
                            </CardContent>
                            </Card>
                        </div>
                    ))}
                </>
        )}
    </Container>
    </Page>
    
);
};

export default AdminTracking;
