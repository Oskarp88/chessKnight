const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  photo:{
    data:Buffer,
    contentType:String
},
  imagenBandera: String,
  role: String,
  score: { type: Number, default: 0 },
  deleted: { type: Boolean, default: false },
  games: { type: Number, default: 0 },
  gamesWon: { type: Number, default: 0 },
  gamesLost: { type: Number, default: 0 },
  gamesTied: { type: Number, default: 0 },
  gamesBullet: { type: Number, default: 0 },
  gamesWonBullet: { type: Number, default: 0 },
  gamesLostBullet: { type: Number, default: 0 },
  gamesTiedBullet: { type: Number, default: 0 },
  gamesBlitz: { type: Number, default: 0 },
  gamesWonBlitz: { type: Number, default: 0 },
  gamesLostBlitz: { type: Number, default: 0 },
  gamesTiedBlitz: { type: Number, default: 0 },
  gamesFast: { type: Number, default: 0 },
  gamesWonFast: { type: Number, default: 0 },
  gamesLostFast: { type: Number, default: 0 },
  gamesTiedFast: { type: Number, default: 0 },
  rachaBullet: {type: Number, default: 0},
  rachaBlitz: {type: Number, default: 0},
  rachaFast: {type: Number, default: 0},
  eloBullet: {type: Number, default: 0},
  eloBlitz: {type: Number, default: 0},
  eloFast: {type: Number, default: 0},
  country: String,
  resetToken: String,
  resetTokenExpiration: Date,
  rango: String,
  insignia: String,
  partida: [{
    player: {
      name: String,
      color: String,
      estado: String,
      country: String,
      bandera: String,
      elo: Number
    },
    nameOpponent: {
      name: String,
      color: String,
      estado: String,
      country: String,
      bandera: String,
      elo: Number
    },
    gameType: String,
  }]
});

module.exports = mongoose.model('User', userSchema);
