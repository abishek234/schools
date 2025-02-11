import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography ,Button} from '@mui/material';
// components
import axios from 'axios';
import Page from '../components/Page';
import Iconify from '../components/Iconify';

// sections
import { SubjectCard,ChapterCard,TopicCard,MaterialCard} from '../sections/@dashboard/app'



export default function StudentDashboardApp() {
    const theme = useTheme();
    const userclassid = localStorage.getItem('userclassid');
    
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);

    const [showChapterCards, setShowChapterCards] = useState(false);
    const [showTopicCards, setShowTopicCards] = useState(false);
    const [showVideoPlayer, setShowVideoPlayer] = useState(false);

    const handleSubjectClick = (subject) => {
        setSelectedSubject(subject);
        setShowChapterCards(true);
        setShowTopicCards(false);
        setShowVideoPlayer(false);
    };

    const handleChapterClick = (chapter) => {
        setSelectedChapter(chapter);
        setShowChapterCards(false);
        setShowTopicCards(true); // Show topic cards when a chapter is selected
        setShowVideoPlayer(false); // Hide video player
    };

    const handleTopicClick = (topic) => {
        setSelectedTopic(topic);
        setShowTopicCards(false); // Hide topic cards when a topic is selected
        setShowVideoPlayer(true); // Show video player for the selected topic
    };

    const handleBackToSubjects = () => {
        // Reset all selections and show subject cards again
        setSelectedSubject(null);
        setSelectedChapter(null);
        setSelectedTopic(null);
        setShowChapterCards(false);
        setShowVideoPlayer(false);
        setShowTopicCards(false); // Reset all states
    };

    const handleBackToChapters = () => {
        // Go back to show chapter cards
        setShowVideoPlayer(false); // Hide video player
        setShowTopicCards(false); // Show topic cards again
        setShowChapterCards(true); // Show chapter cards again

    };

    const handleBackToTopics = () => {
        // Go back to show topic cards
        setShowVideoPlayer(false); // Hide video player
        setShowTopicCards(true); // Show topic cards again
    }

    return(
        <Page title="Dashboard">
            <Container maxWidth="lg">
                <Grid item xs={12} sm={6} md={4}>
                {!showChapterCards && !showVideoPlayer && !showTopicCards && (
                    <SubjectCard classId={userclassid} onSubjectClick={handleSubjectClick} />
                )}
                      {showChapterCards && (
                    <>
                       
                        <ChapterCard className={userclassid} subject={selectedSubject} onChapterClick={handleChapterClick} onBackClick={handleBackToSubjects}/>
                    </>
                )}
                     {showTopicCards && (
                    <>
                        
                        <TopicCard className={userclassid} subject={selectedSubject} chapter={selectedChapter} onTopicClick={handleTopicClick} onBackClick={handleBackToChapters}/>
                    </>
                )}
                        {showVideoPlayer && (
                        <>
                            
                            <MaterialCard className={userclassid} subject={selectedSubject} chapter={selectedChapter} topic={selectedTopic} onBackClick={handleBackToTopics}/>
                        </>
                    )}
                    
                </Grid>
            </Container>
        </Page>
    )
}


