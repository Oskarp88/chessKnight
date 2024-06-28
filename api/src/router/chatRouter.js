const express = require('express');
const { chatPost, getUserChat, getChat } = require('../controllers/chatRouter');

const chatRouter = express.Router();

chatRouter.post('/', chatPost);

chatRouter.get('/:userId', getUserChat);

chatRouter.get('/find/:firstId/:secondId', getChat);

module.exports = chatRouter;