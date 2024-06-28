const express = require('express');
const { updatePartidas, getAllPartidasUser } = require('../controllers/partidaControllers');

const partidaRouter = express.Router();

partidaRouter.put('/user/update/:userId', updatePartidas);
partidaRouter.get('/user/historial/:userId', getAllPartidasUser);

module.exports = partidaRouter;