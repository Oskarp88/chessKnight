const express = require('express');
const { updatePartidas, getAllPartidasUser, gamesPost, updateGames, getGameById } = require('../controllers/partidaControllers');

const partidaRouter = express.Router();

partidaRouter.put('/user/update/:userId', updatePartidas);
partidaRouter.get('/user/historial/:userId', getAllPartidasUser);
partidaRouter.post('/user/games/create', gamesPost);
partidaRouter.put('/user/games/update/:gamesId', updateGames);
partidaRouter.get('/user/games/:gamesId', getGameById);

module.exports = partidaRouter;