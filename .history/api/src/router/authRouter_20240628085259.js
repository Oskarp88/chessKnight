const express = require('express');
const authRouter = express.Router();
const passport = require('passport');
const { login, googleAuth } = require('../controllers/authControllers');
require('dotenv').config();


// Ruta de login
authRouter.post('/login', login);

// Ruta de autenticación de Google
authRouter.get('/google', googleAuth);


module.exports = authRouter;
