const connectDB  = require('./src/config/db');
const router = require('./src/router/routers');
const dotenv = require('dotenv');
const express = require('express');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const {Server} = require('socket.io');
const Games = require('./src/model/Games');

dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: ["https://chessfive.vercel.app","http://localhost:3000"],  // Permitir solicitudes desde este origen
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  credentials: true,  // Si necesitas usar cookies o autenticación
}));

app.use(morgan('dev'));
app.use('/api', router);


const io = new Server(server, {
  cors: {
    origin:["https://chessfive.vercel.app","http://localhost:3000"],
    method: ["GET", "POST",'PUT', 'DELETE'],
  }
});

let onlineUser = [];
let onlineUserGame = [];
let partidas = [];
let games = {};
let userDisconnect={}

function DisconnectUser(gameId){
   userDisconnect[gameId]={
      user: false,
      userOpponent: false,
   }
}

function createGames(gameId, time) {
  games[gameId] = {
    currenTurn: 'white',
    timers: {
      white: time,
      black: time
    },
    lastUpdate: Date.now(),
    intervalId: null
  }
}

function updateGameTimers(gameId) {
  const game = games[gameId];
  if (!game) return;

  const now = Date.now();
  const elapsed = Math.floor((now - game.lastUpdate) / 1000);

  if (elapsed > 0) {  // Solo actualizar si ha pasado al menos un segundo
    game.timers[game.currenTurn] -= elapsed;
    game.lastUpdate = now;

    if (game.timers[game.currenTurn] <= -1) {
      io.to(gameId).emit('gameOver', { winner: game.currenTurn === 'white' ? 'black' : 'white' });
      delete games[gameId];
    } else {
      io.to(gameId).emit('timerUpdate', game);
      console.log('game time', games);
    }
  }
}

function changeTurn(gameId, turn) {
  const game = games[gameId];
  if (!game) return;

  if (game.currenTurn !== turn) { // Solo cambiar si es un turno diferente
    updateGameTimers(gameId); // Llamar antes de cambiar el turno
    game.currenTurn = turn;
    game.lastUpdate = Date.now(); // Reiniciar la última actualización para el nuevo turno
    io.to(gameId).emit('turnChange', game);
  }
}

setInterval(()=>{
  Object.keys(games).forEach((gameId) => updateGameTimers(gameId));
},1000)

io.on("connection", (socket) => {
  console.log("User Connected: ",socket.id);

  socket.on('addNewUser', (userId) => {
     !onlineUser.some(user => user.userId === userId) &&
     onlineUser.push({
       userId,
       socketId: socket.id,
       busy: false,
       notAvailable: false,
       time: 0
     });
     // console.log('userOnline' , onlineUser);
     io.emit('getOnlineUsers', onlineUser);
  });

  socket.on('userTime', (data) => {
   const userIndex = onlineUser.findIndex(user => user.userId === data.userId);
   if (userIndex !== -1) {
     onlineUser[userIndex].time = parseInt(data.time);
     io.emit('getOnlineUsers', onlineUser);
   }
 });

  socket.on('userBusy', (userId) => {
   const userIndex = onlineUser.findIndex(user => user.userId === userId);
   if (userIndex !== -1) {
     onlineUser[userIndex].busy = true;
     io.emit('getOnlineUsers', onlineUser);
   }
 });

 socket.on('userAvailable', (userId) => {
   const userIndex = onlineUser.findIndex(user => user.userId === userId);
   if (userIndex !== -1) {
     onlineUser[userIndex].busy = false;
     io.emit('getOnlineUsers', onlineUser);
   }
 });

 socket.on('notAvailable', (userId) => {
  const userIndex = onlineUser.findIndex(user => user.userId === userId);
  if (userIndex !== -1) {
    io.emit('isBusy', userId);
  }
});

socket.on('yesAvailable', (userId) => {
  const userIndex = onlineUser.findIndex(user => user.userId === userId);
  if (userIndex !== -1) {
    io.emit('notBusy', userId);
  }
})

  socket.on('addNewUserGame', (data) => {
  
   !onlineUserGame.some(user => user.idGameUser === data?.idGameUser) &&
   onlineUserGame.push({
     idGameUser: data?.idGameUser,
     roomChannel: data?.roomChannel,
     socketId: socket.id,
     o
   });
   // console.log('userOnline' , onlineUser);
   io.emit('getOnlineUsersGame', onlineUserGame);
});

  //add message
  socket.on('sendMessage', (message) => {
     const user = onlineUser.find(user => user.userId === message.recipientId);
     if(user){
       io.to(user.socketId).emit("getMessage", message);
       io.to(user.socketId).emit('getNotifications',{
         senderId: message.senderId,
         isRead: false,
         date: new Date()
       })
     }
   });
   

  socket.on("join-room", (data) => {
  socket.join(data);
  
  console.log(`User with ID: ${socket.id} joined room: ${data}`);
  
 });

 socket.on('partida', (data) => {
   !partidas.some(p => p.room === data?.roomPartida) &&
     partidas.push({
       room: data?.roomPartida,
       idUser: data?.idUser,
       idOpponent: data?.idOpponent,
       username: data?.username,
       username2: data?.username2,
     });
   socket.to(data?.room).emit('getPartidas', partidas); 
 });

 socket.on('joinRoomGamePlay' , (gameId) =>{
  
   socket.join(gameId);
  
   console.log(`User with ID: ${socket.id} joined room play game: ${gameId}`);
   
 });

 socket.on('initPlay',(data)=>{
  if(!data) return;
  const {gameId, time} = data;
 if(!games[gameId]){
   createGames(gameId, time);
 }
 socket.emit('init', games[gameId]);
 console.log('*************games***********',games)
 })

 socket.on('changeTurn', (data)=>{
  if(!data) return;
  const{ gameId, turn} = data;
    changeTurn(gameId, turn);
 })
 socket.on('gameEnd',(gameId)=>{
  delete games[gameId];
  delete userDisconnect[gameId];
 })

 socket.on('oponnetConnect', (data)=>{

  if(!userDisconnect[data.gameId]){
    DisconnectUser(data.gameId);
  }
  
  const userIndexUser = onlineUser.findIndex(user => user.userId === data.idUser);
  if (userIndexUser === -1) {  
     userDisconnect.user = true;
     io.to(data.gameId).emit('oponnentDisconnect', {id: data.idUser, disconnect: true });
  }else if(userIndexUser !== -1 && userDisconnect.user){
     io.to(data.gameId).emit('oponnentDisconnect', {id: data.idUser, disconnect: false });
     userDisconnect.user = false;
  }
  const userIndexOpponent = onlineUser.findIndex(user => user.userId === data.idOpponent);
   if(userIndexOpponent === -1){
    userDisconnect.userOpponent = true;
     io.to(data.gameId).emit('oponnentDisconnect', {id: data.idOpponent, disconnect: true});
   }else if(userIndexOpponent !== -1 && userDisconnect.userOpponent){
     io.to(data.gameId).emit('oponnentDisconnect', {id: data.idUser, disconnect: false });
     userDisconnect.userOpponent === false;
   }
  
 });

  socket.on("send_message", (data) => {
   socket.to(data.room).emit("receive_message", data);
  });

  socket.on("send_messageChess", (data) => {
    socket.to(data.room).emit("receive_messageChess", data);
   });

  socket.on('requestLatestGameState', async (room) => {
     try {
       // Buscar el juego en la base de datos utilizando el gamesId (que es igual a room)
       const gameState = await Games.findOne({ gamesId: room });

       if (gameState) {
         // Emitir el estado más reciente de la partida de vuelta al cliente
         socket.to(room).emit('latestGameState', gameState);
       } else {
         console.log(`No se encontró un juego con el gamesId: ${room}`);
       }
     } catch (error) {
       console.error('Error al obtener el estado del juego:', error);
     }
  });

 //  socket.on('sendGameState', (data)=>{
 //   socket.to(data.room).emit('receiveGameState', data.latestGameState)
 //  })
   // send game
   socket.on('sendGame', (game) => {
     // console.log('sendGame', game)
       socket.to(game.room).emit('getGame',{
         color: game.color,
         idOpponent: game.Id,
         username: game.username,
         gameId: game.gameId,
         senderId: game.opponentId,
         time: game.time,
         bullet: game.ratingBullet,
         blitz: game.ratingBlitz,
         fast: game.ratingFast,
         bandera: game.bandera,
         country: game.country,
         photo: game.photo,
         marco: game.marco,
         moneda: game?.moneda,
         valor: game?.valor
       });     
     }
   );
  socket.on("send_move", (data) => {
   socket.to(data.room).emit("opponentMove", data);
  });
  
  socket.on('reconnectMove', (data) =>{
     socket.to(data).emit('receiveReconnectMove', data);
  })
  socket.on("get_last_move", (data) => {
   // Cuando un jugador pide el último movimiento, lo envías
   socket.to(data.room).emit("opponentMove", data);
 });
 

  socket.on("playGame", (data) => {
   socket.to(data.roomGame).emit("receivePlayGame", data);
  });
  socket.on("offGame", (data) => {
   socket.to(data.roomGame).emit("receiveOffGame", data);
  });

  socket.on("send_revancha", (data) => {
   socket.to(data.room).emit("receiveRevancha", data);
  });
 
let intervalId; // Mantener un solo intervalo

socket.on("tiempo", (res) => {
  const { isGameOver, tied, turno, whiteTime, blackTime } = res;
  let black;
  let white;
    // Solo iniciar el intervalo si no hay uno en ejecución
    if (!isGameOver && !tied && whiteTime > 0 && blackTime > 0 && !intervalId) {
     
      intervalId = setInterval(() => {
        if (turno === 'white') {
          white = whiteTime - 1;
        } else {
          black = blackTime - 1;
        }

        // Emitir tiempo actualizado a todos en la sala
        socket.to(res.room).emit("receiveTiempo", { res, black, white, room: res.room });

        // Limpiar el intervalo y resetear tiempos cuando alguno llegue a cero
        if (blackTime === 0 || whiteTime === 0) {
          clearInterval(intervalId);
          intervalId = null; // Resetear el ID del intervalo
          blackTime = 0;
          whiteTime = 0;
        }
      }, 1000);
    }
  
});

socket.on('sendTiempo', (data) => {
  socket.to(data.room).emit('receiveTiempoTurn', data);
});

  socket.on("aceptarRevancha", (data) => {
   socket.to(data.room).emit("revanchaAceptada", data);
  });

  socket.on("revanchaRechazada", (data) => {
   socket.to(data).emit('receiveRevanchaRechazada', data);
  })

  socket.on("sendTablas", (data) => {
   socket.to(data.room).emit("receiveTablas", data);
  });

  socket.on('cancelarTablas', (room) => {
   socket.to(room).emit('receiveCancelarTablas', room);
  })

  socket.on("sendAbandonar", (data) => {
   socket.to(data.room).emit("receiveAbandonar", data);
  });

  socket.on("rechazarTablas", (room) => {
   socket.to(room).emit("receiveRechazarTablas", room);
  });

  socket.on("aceptarTablas", (room) => {
   socket.to(room).emit("receiveAceptarTablas", room);
  });


  socket.on("checkMate", (data) => {
   socket.to(data.room).emit("receiveCheckMate", data);
  });

  socket.on('stalemate', (data) => {
   socket.to(data.room).emit('receiveStalemate', data);
  })

  socket.on("modalClose", (data) => {
   socket.to(data.room).emit("receivemodalClose", data);
  });

  socket.on("promotion", (data) => {
   socket.to(data.room).emit("pawn_promotion", data);
  })

  socket.on("sendPassant", (data)=>{
   socket.to(data.room).emit("movePassant", data);
  })

  socket.on('deletePartida', (data) =>{
   partidas = partidas.filter((p) => p.room !== data?.roomPartida);   
   socket.to(data?.room).emit('getPartidas', partidas);
  })
  
  socket.on("disconnect", () => {
   onlineUser = onlineUser.filter((u) => u.socketId !== socket.id );
   io.emit('getOnlineUsers', onlineUser);
   onlineUserGame = onlineUserGame.filter((u) => u.socketId !== socket.id);
    io.emit('getOnlineUsersGame', onlineUserGame);
   console.log("User Disconnected", socket.id);
  })
});

connectDB();

// Manejar conexiones WebSocket
const port = process.env.PORT || 5000;
 // Asegúrate de que no sea el puerto fijo


server.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`.bgCyan.white);
});

