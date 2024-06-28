const mongoose = require('mongoose');

const partidaSchema = new mongoose.Schema(
    {
    members: Array,
    },
    {
    timestamps: true, 
    }
);

const Partida = mongoose.model('Partida', partidaSchema);

module.exports = Partida;