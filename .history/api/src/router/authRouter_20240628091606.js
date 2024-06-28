const express = require('express');
const authRouter = express.Router();
const passport = require('passport');
const { login, googleAuth, getIp, getGeo } = require('../controllers/authControllers');
require('dotenv').config();


// Ruta de login
authRouter.post('/login', login);

// Ruta de autenticación de Google
authRouter.post('/google', googleAuth);

authRouter.get('/get-ip', getIp);

authRouter.get('/get-geo/:ip', getGeo );


module.exports = authRouter;
