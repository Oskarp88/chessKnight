const express = require('express');
const authRouter = express.Router();
const passport = require('passport');
const { login } = require('../controllers/authControllers');
require('dotenv').config();


// Ruta de login
authRouter.post('/login', login);

// Ruta de autenticación de Google
authRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de callback de Google para obtener los datos del usuario
authRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Aquí puedes redirigir al usuario a la página principal o hacer cualquier otra acción necesaria
  res.redirect('/');
});

// Ruta de autenticación de Facebook
authRouter.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Ruta de callback de Facebook para obtener los datos del usuario
authRouter.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  // Aquí puedes redirigir al usuario a la página principal o hacer cualquier otra acción necesaria
  res.redirect('/');
});

// Estrategia de autenticación de Google
// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: '/auth/google/callback'
//   },
//   (accessToken, refreshToken, profile, done) => {
//     // Aquí puedes guardar los datos del usuario en la base de datos o realizar cualquier acción necesaria
//     User.findOne({ googleId: profile.id })
//       .then(existingUser => {
//         if (existingUser) {
//           return done(null, existingUser);
//         }
        
//         const newUser = new User({
//           googleId: profile.id,
//           username: profile.displayName
//         });

//         newUser.save()
//           .then(user => {
//             done(null, user);
//           })
//           .catch(error => {
//             done(error, null);
//           });
//       })
//       .catch(error => {
//         done(error, null);
//       });
//   }
// ));

// // Estrategia de autenticación de Facebook
// passport.use(new FacebookStrategy({
//     clientID: FACEBOOK_CLIENT_ID,
//     clientSecret: FACEBOOK_CLIENT_SECRET,
//     callbackURL: '/auth/facebook/callback',
//     profileFields: ['id', 'displayName', 'email']
//   },
//   (accessToken, refreshToken, profile, done) => {
//     // Aquí puedes guardar los datos del usuario en la base de datos o realizar cualquier acción necesaria
//     User.findOne({ facebookId: profile.id })
//       .then(existingUser => {
//         if (existingUser) {
//           return done(null, existingUser);
//         }
        
//         const newUser = new User({
//           facebookId: profile.id,
//           username: profile.displayName
//         });

//         newUser.save()
//           .then(user => {
//             done(null, user);
//           })
//           .catch(error => {
//             done(error, null);
//           });
//       })
//       .catch(error => {
//         done(error, null);
//       });
//   }
// ));


module.exports = authRouter;
