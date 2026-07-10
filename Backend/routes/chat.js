const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getChatHistory, sendMessage } = require('../controllers/chatController');
const { crisisInterceptor } = require('../middleware/crisisInterceptor');

const chatRouter = express.Router();

chatRouter.get('/', authenticate, getChatHistory);
chatRouter.post('/send', authenticate, crisisInterceptor('chat'), sendMessage);

module.exports = chatRouter;