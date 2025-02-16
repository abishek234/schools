const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/send-message', messageController.sendMessage);
router.get('/get-message', messageController.getMessages);
router.get('/get-chatlist', messageController.getChatList);

module.exports = router;