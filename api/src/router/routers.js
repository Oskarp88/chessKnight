const authRoutes = require('./authRouter');
const userRouter = require('./userRouter');

const express = require('express');
const chatRouter = require('./chatRouter');
const messageRouter = require('./messageRouter');
const partidaRouter = require('./partidaRouter');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/', userRouter);
router.use('/chat', chatRouter);
router.use('/messages', messageRouter);
router.use('/partida', partidaRouter);



module.exports = router;

