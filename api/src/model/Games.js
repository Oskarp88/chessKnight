const mongoose = require('mongoose');

const gamesSchema = new mongoose.Schema(
    {
      gamesId: String,
      pieces: Array,
      piece: {   
        type: Object, 
        default: {} 
      },
      x: Number,
      y: Number,
      turn: String
    },
    {
      timestamps: true, 
    }
  );
  
  const Games = mongoose.model('Game', gamesSchema);
  
  module.exports = Games;
  