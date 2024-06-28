const User = require("../model/User");

exports.updatePartidas = async(req, res) => {
    const { userId } = req.params;
    const {name, nameOpponent, bandera, banderaOpponent, country, countryOpponent, time, game,eloUser, eloOpponent, elo, color} = req.body;
    console.log('partidaRouter', userId, time, game, elo, color)
  
      try{

        const user = await User.findById(userId); // Encuentra el usuario por su ID en la base de datos
  
        if (!user) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const eloWinner = elo === 0 ? 13 : 
                          elo >= 1 && elo <= 5 ? 12 : 
                          elo >= 6 && elo <= 10 ? 11 : 
                          elo >= 11 && elo <= 15 ? 10 : 
                          elo >= 16 && elo <= 25 ? 9 :
                          elo >= 26 && elo <= 40 ? 8 :
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
                          elo < -800 ? 45 : null;
                        
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
                          elo < -800 ? -1 : null;

        const eloTie = elo === 0 ? 0 : 
                          elo >= 1 && elo <= 5 ? 0 : 
                          elo >= 6 && elo <= 10 ? 0 : 
                          elo >= 11 && 25 ? -1 :
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
                          elo < -800 ? 6 : null;

                          
        
         if(time === 'bullet'){
            let eloChange = 0;
        
            if (game === 'victoria') {
                eloChange = eloWinner;
            } else if (game === 'derrota' && user.eloBullet > 10) {
                eloChange = eloLoser;
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
                        name: nameOpponent,
                        country: countryOpponent,
                        bandera: banderaOpponent,
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
                eloChange = eloLoser;
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
                        name: nameOpponent,
                        country: countryOpponent,
                        bandera: banderaOpponent,
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
         } else if (game === 'derrota' && user.eloFast > 10) {
             eloChange = eloLoser;
         } else if (game === 'empate') {
             eloChange = eloTie;
         }
            const userUpdate = await User.findByIdAndUpdate(userId,{
               games: parseInt(user.games) + 1,
               gamesWon: game === 'victoria' && parseInt(user.gamesWon) + 1 || user.gamesWon,
               gamesLost: game === 'derrota' && parseInt(user.gamesLost) + 1 || user.gamesLost,
               gamesTied: game === 'empate' && parseInt(user.gamesTied) + 1 || user.gamesTied,
               gamesFast: parseInt(user.gamesFast) + 1,
               gamesWonFast: game === 'victoria' && parseInt(user.gamesWonFast) + 1 || user.gamesWonFast,
               gamesLostFast: game === 'derrota' && parseInt(user.gamesLostFast) + 1 || user.gamesLostFast,
               gamesTiedFast: game === 'empate' && parseInt(user.gamesTiedFast) + 1 || user.gamesTiedFast,
               rachaFast: game === 'victoria' ? parseInt(user.rachaFast) + 1 : 0 ,
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
                    name: nameOpponent,
                    country: countryOpponent,
                    bandera: banderaOpponent,
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