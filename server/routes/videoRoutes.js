const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.post('/video', videoController.createVideo);

router.get('/videos/subjects/:class', videoController.getSubjectsByClass);

router.get('/videos/chapters/:class/:subject', videoController.getChaptersBySubject);


router.get('/video/:id', videoController.getVideosByTeacher);

router.put('/video/:id', videoController.updateVideo);

router.delete('/video/:id', videoController.deleteVideo);

router.put('/video/mark/:id', videoController.markVideoAsCompleted);

router.get('/video/:videoId/completed/:userId', videoController.getCompletedVideos);

router.get('/video/:firstName/:lastName', videoController.getVideosByTeacherName);

router.get('/videos/:id/:class/:subject/:chapter', videoController.getTopicsByChapter );

router.get('/videos/:class/:subject/:chapter/:topic/videos', videoController.getVideosByTopic);

router.get('/videos/:id', videoController.getVideosById);



module.exports = router;