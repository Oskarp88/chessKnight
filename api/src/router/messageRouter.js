const { messagePost, getMessageChat } = require('../controllers/messageControllers');
const express = require('express');

const messageRouter = express.Router();

messageRouter.post('/', messagePost);

messageRouter.get('/:chatId', getMessageChat);



module.exports = messageRouter;