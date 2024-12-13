const Games = require("../model/Games");
const User = require("../model/User");

exports.gamesPost = async(req,res) => {
  try {
    const {gamesId, pieces, piece, x, y, turn  } = req.body;
    const newGame = new Games({
      gamesId,
      pieces,
      piece,
      x,
      y,
      turn
    });
    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.updateGames = async(req, res)=>{
  try {
    const {gamesId} = req.params;
    const { pieces, piece, x, y, turn } = req.body; 

    // Busca y actualiza el documento por su id
    const updatedGame = await Games.findOneAndUpdate(
      {gamesId},
      {
       $set: {pieces,piece,x,y,turn,}
      },
      { new: true } //devuelve el documento actualizado
    );

    if (!updatedGame) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
// Ruta GET para obtener un juego por su ID
exports.getGameById = async (req, res) => {
  try {
    const { gamesId } = req.params; // El ID se pasará como parámetro en la URL

    // Busca el juego por su ID
    const game = await Games.findOne(gamesId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.status(200).json(game); // Devuelve el juego encontrado
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePartidas = async(req, res) => {
    const { userId } = req.params;
    const {
       opponentId, 
       name,  
       bandera,  
       country, 
       time, 
       game,
       eloUser, 
       eloOpponent, 
       elo, 
       color,
       score } = req.body;
  
      try{

        const user = await User.findById(userId); 
        const userOpponent = await User.findById(opponentId,'-password -partida')
        if (!user) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const eloWinner = elo === 0 ? 15 : 
                          elo >= 1 && elo <= 5 ? 14 : 
                          elo >= 6 && elo <= 10 ? 13 : 
                          elo >= 11 && elo <= 15 ? 11 : 
                          elo >= 16 && elo <= 25 ? 10 :
                          elo >= 26 && elo <= 40 ? 9 :
                          elo >= 41 && elo <= 90 ? 7 :
                          elo >= 91 && elo <= 150 ? 6 :
                          elo >= 151 && elo <= 250 ? 5: 
                          elo >= 251 && elo <= 300 ? 3 :
                          elo >= 301 && elo <= 500 ? 2 : 
                          elo > 500 ? 1 : 
                          elo >= -5 && elo <= -1 ? 14 : 
                          elo >=-10 && elo <= -6 ? 16 :
                          elo >= -15 && elo <= -11 ? 17 :
                          elo >= -20 && elo <= - 16 ? 18 :
                          elo >= -25 && elo <= -21 ? 19: 
                          elo >= -40 && elo <= -26 ? 20 :
                          elo >= -70 && elo <= -41 ? 21 :
                          elo >= -100 && elo <= -71 ? 23 : 
                          elo >= -200 && elo <= -101 ? 25 :
                          elo >= -350 && elo <= -201 ? 28 :
                          elo >= -500 && elo <= -351 ? 30 : 
                          elo >= -800 && elo <=-501 ? 35 :
                          elo < -800 ? 45 : 13;
                        
         const eloLoser = elo === 0 ? -9 : 
                          elo >= 1 && elo <= 5 ? -10 : 
                          elo >= 6 && elo <= 10 ? -11 : 
                          elo >= 11 && elo <= 15 ? -12 : 
                          elo >= 16 && elo <= 25 ? -13 :
                          elo >= 26 && elo <= 40 ? -14 :
                          elo >= 41 && elo <= 90 ? -15 :
                          elo >= 91 && elo <= 150 ? -17 :
                          elo >= 151 && elo <= 250 ? -19: 
                          elo >= 251 && elo <= 300 ? -21 :
                          elo >= 301 && elo <= 500 ? -25 : 
                          elo > 500 ? -28 : 
                          elo >= -5 && elo <= -1 ? -15 : 
                          elo >=-10 && elo <= -6 ? -14 :
                          elo >= -15 && elo <= -11 ? -13:
                          elo >= -20 && elo <= - 16 ? -12:
                          elo >= -25 && elo <= -21 ? -11: 
                          elo >= -40 && elo <= -26 ? -10 :
                          elo >= -70 && elo <= -41 ? -9 :
                          elo >= -100 && elo <= -71 ? -8 : 
                          elo >= -200 && elo <= -101 ? -6 :
                          elo >= -350 && elo <= -201 ? -5 :
                          elo >= -500 && elo <= -351 ? -4 : 
                          elo >= -800 && elo <=-501 ? -2 :
                          elo < -800 ? -9 : null;

        const eloTie = elo === 0 ? 0 : 
                          elo >= 1 && elo <= 18 ? 0 : 
                          elo >= 19 && 25 ? -1 :
                          elo >= 26 && elo <= 90 ? -2 :
                          elo >= 91 && elo <= 250 ? -3 : 
                          elo >= 251 && elo <= 500 ? -4 : 
                          elo > 500 ? -5 : 
                          elo >= -5 && elo <= -1 ? 0 : 
                          elo >=-10 && elo <= -6 ? 1 :
                          elo >= -25 && elo <= -11 ? 2 :
                          elo >= -100 && elo <= -26 ? 3 : 
                          elo >= -350 && elo <= -101 ? 4: 
                          elo >= -800 && elo <=-351 ? 5 :
                          elo < -800 ? 6 : 0;

                          
        
         if(time === 'bullet'){
            let eloChange = 0;
        
            if (game === 'victoria') {
                eloChange = eloWinner;
            } else if (game === 'derrota') {
                eloChange = parseInt(user.eloBullet) - eloLoser <= 0 ? 
                             -(parseInt(user.eloBullet)) : eloLoser;
            } else if (game === 'empate') {
                eloChange = eloTie;
            }
             const userUpdate = await User.findByIdAndUpdate(userId,{
                games: parseInt(user.games) + 1,
                gamesWon: game === 'victoria' && parseInt(user.gamesWon) + 1 || user.gamesWon,
                gamesLost: game === 'derrota' && parseInt(user.gamesLost) + 1 || user.gamesLost,
                gamesTied: game === 'empate' && parseInt(user.gamesTied) + 1 || user.gamesTied,
                gamesBullet: parseInt(user.gamesBullet) + 1,
                gamesWonBullet: game === 'victoria' && parseInt(user.gamesWonBullet) + 1 || user.gamesWonBullet,
                gamesLostBullet: game === 'derrota' && parseInt(user.gamesLostBullet) + 1 || user.gamesLostBullet,
                gamesTiedBullet: game === 'empate' && parseInt(user.gamesTiedBullet) + 1 || user.gamesTiedBullet,
                
                rachaBullet: game === 'victoria' ? parseInt(user.rachaBullet) + 1 : 0 ,
                score: game === 'victoria' ? 
                    parseInt(user.score) + parseInt(score) : game === 'derrota' ?
                    (parseInt(user.score) - parseInt(score)) <= 500 ? 
                       500 : parseInt(user.score) - parseInt(score) : parseInt(user.score),
                eloBullet: parseInt(user.eloBullet) + eloChange,
                $push: {
                    partida: {
                      player: {
                        name,
                        country,
                        bandera,
                        color,
                        estado: game === 'victoria' ? 'won' : game === 'derrota' ? 'lost' : 'tied',
                        elo: eloUser
                      },
                      nameOpponent:{
                        name: userOpponent.username,
                        country: userOpponent.country,
                        bandera: userOpponent.imagenBandera,
                        color: color === 'white' ? 'black' : 'white',
                        estado: game === 'victoria' ? 'lost' : game === 'derrota' ? 'won' : 'tied',
                        elo: eloOpponent
                      },
                      gameType: time, // Usar time en lugar de 'Bullet', 'Blitz', 'Fast'                    
                      
                    }
                   }
             },{new: true});

             await user.save();

             return  res.send({
                success: true,
                message: 'Datos de usuario actualizados correctamente',
                userUpdate
              });
         }

         if (time === 'blitz') {
            let eloChange = 0;
        
            if (game === 'victoria') {
                eloChange = eloWinner;
            } else if (game === 'derrota' && user.eloBlitz > 10) {
                eloChange = parseInt(user.eloBlitz) - eloLoser <= 0 ? 
                -(parseInt(user.eloBlitz)) : eloLoser;;
            } else if (game === 'empate') {
                eloChange = eloTie;
            }

            const userUpdate = await User.findByIdAndUpdate(userId, {
                games: parseInt(user.games) + 1,
                gamesWon: game === 'victoria' ? parseInt(user.gamesWon) + 1 : user.gamesWon,
                gamesLost: game === 'derrota' ? parseInt(user.gamesLost) + 1 : user.gamesLost,
                gamesTied: game === 'empate' ? parseInt(user.gamesTied) + 1 : user.gamesTied,
                gamesBlitz: parseInt(user.gamesBlitz) + 1,
                gamesWonBlitz: game === 'victoria' ? parseInt(user.gamesWonBlitz) + 1 : user.gamesWonBlitz,
                gamesLostBlitz: game === 'derrota' ? parseInt(user.gamesLostBlitz) + 1 : user.gamesLostBlitz,
                gamesTiedBlitz: game === 'empate' ? parseInt(user.gamesTiedBlitz) + 1 : user.gamesTiedBlitz,
                rachaBlitz: game === 'victoria' ? parseInt(user.rachaBlitz) + 1 : 0 ,
                score: game === 'victoria' ? 
                    parseInt(user.score) + parseInt(score) : game === 'derrota' ?
                    (parseInt(user.score) - parseInt(score)) <= 500 ? 
                       500 : parseInt(user.score) - parseInt(score) : parseInt(user.score),
                eloBlitz: parseInt(user.eloBlitz) + eloChange,
                $push: {
                    partida: {
                      player: {
                        name,
                        country,
                        bandera,
                        color,
                        estado: game === 'victoria' ? 'won' : game === 'derrota' ? 'lost' : 'tied',
                        elo: eloUser
                      },
                      nameOpponent:{
                        name: userOpponent.username,
                        country: userOpponent.country,
                        bandera: userOpponent.imagenBandera,
                        color: color === 'white' ? 'black' : 'white',
                        estado: game === 'victoria' ? 'lost' : game === 'derrota' ? 'won' : 'tied',
                        elo: eloOpponent
                      },
                      gameType: time, // Usar time en lugar de 'Bullet', 'Blitz', 'Fast'                    
                      
                    }
                   }
            }, { new: true }, '-photo');
        
            await userUpdate.save();
            console.log('partida',userUpdate);
            return res.send({
                success: true,
                message: 'Datos de usuario actualizados correctamente',
                userUpdate
            });
        }
        

        if(time === 'fast'){
         let eloChange = 0;
        
         if (game === 'victoria') {
             eloChange = eloWinner;
         } else if (game === 'derrota') {
             eloChange = parseInt(user.eloFast) - eloLoser <= 0 ? 
             -(parseInt(user.eloFast)) : eloLoser;
         } else if (game === 'empate') {
             eloChange = eloTie;
         }
            const userUpdate = await User.findByIdAndUpdate(userId,{
               games: parseInt(user.games) + 1,
               gamesWon: game === 'victoria' ? parseInt(user.gamesWon) + 1 : user.gamesWon,
               gamesLost: game === 'derrota' ? parseInt(user.gamesLost) + 1 : user.gamesLost,
               gamesTied: game === 'empate' ? parseInt(user.gamesTied) + 1 : user.gamesTied,
               gamesFast: parseInt(user.gamesFast) + 1,
               gamesWonFast: game === 'victoria' ? parseInt(user.gamesWonFast) + 1 : user.gamesWonFast,
               gamesLostFast: game === 'derrota' ? parseInt(user.gamesLostFast) + 1 : user.gamesLostFast,
               gamesTiedFast: game === 'empate' ? parseInt(user.gamesTiedFast) + 1 : user.gamesTiedFast,
               rachaFast: game === 'victoria' ? parseInt(user.rachaFast) + 1 : 0 ,
               score: game === 'victoria' ? 
                       parseInt(user.score) + parseInt(score) : game === 'derrota' ? 
                       (parseInt(user.score) - parseInt(score)) < 500 ? 
                       500 : parseInt(user.score) - parseInt(score) : parseInt(user.score),
               eloFast:  parseInt(user.eloFast) + eloChange,
               $push: {
                partida: {
                  player: {
                    name,
                    country,
                    bandera,
                    color,
                    estado: game === 'victoria' ? 'won' : game === 'derrota' ? 'lost' : 'tied',
                    elo: eloUser
                  },
                  nameOpponent:{
                    name: userOpponent.username,
                    country: userOpponent.country,
                    bandera: userOpponent.imagenBandera,
                    color: color === 'white' ? 'black' : 'white',
                    estado: game === 'victoria' ? 'lost' : game === 'derrota' ? 'won' : 'tied',
                    elo: eloOpponent
                  },
                  gameType: time, // Usar time en lugar de 'Bullet', 'Blitz', 'Fast'                    
                  
                }
               }
            },{new: true});

          await  user.save();

            return  res.send({
               success: true,
               message: 'Datos de usuario actualizados correctamente',
               userUpdate
             });
        }
      
    } catch (error) {
      console.log('error', error);
      res.status(500).json(error);
    
  }
}

exports.getAllPartidasUser = async(req, res) => {
   try {
    const user = await User.findById(req.params.userId).select('partida');

    if(user){
        console.log('historial', user)
        return res.status(200).send(user);
    }else{
      res.status(404).json({ error: 'partidas no encontradas' });
      console.log('partidas no encontradas')
    }
      
   } catch (error) {
      console.log('error getAllPartidasUser', error);
      res.status(500).json(error);
   }
}