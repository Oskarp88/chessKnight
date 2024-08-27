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

dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use('/api', router);


const io = new Server(server, {
  cors: {
    origin: "https://chess-knight-ecru.vercel.app",
    // origin: 'http://localhost:3000',
    method: ["GET", "POST"],
  }
});

let onlineUser = [];
let onlineUserGame = [];
let partidas = [];
io.on("connection", (socket) => {
   console.log("User Connected: ",socket.id);

   socket.on('addNewUser', (userId) => {
      !onlineUser.some(user => user.userId === userId) &&
      onlineUser.push({
        userId,
        socketId: socket.id,
        busy: false,
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
    console.log('TIME', onlineUser);
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
  })

   socket.on('addNewUserGame', (data) => {
    console.log('addNewUserGame', data)
    !onlineUserGame.some(user => user.idGameUser === data?.idGameUser) &&
    onlineUserGame.push({
      idGameUser: data?.idGameUser,
      roomChannel: data?.roomChannel,
      socketId: socket.id,
      o
    });

    console.log('usuarios', onlineUserGame)

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

  socket.on('joinRoomGamePlay' , (data) =>{
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room play game: ${data}`);
  });

   socket.on("send_message", (data) => {
    console.log('send_mensage', data);
    socket.to(data.room).emit("receive_message", data);
   })

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
          photo: game.photo
        });
        
      }
    );

   socket.on("send_move", (data) => {
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
   socket.on("tiempo", (data) => {
    console.log('turno', data?.turno)
    socket.to(data.room).emit("receiveTiempo", data);
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
    console.log('modal close', data)
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
    console.log('regresar', partidas);
    socket.to(data?.room).emit('getPartidas', partidas);
   })
   
   socket.on("disconnect", () => {
    onlineUser = onlineUser.filter((u) => u.socketId !== socket.id );
    io.emit('getOnlineUsers', onlineUser);
    onlineUserGame = onlineUserGame.filter((u) => u.socketId !== socket.id);
     
     console.log('onlineUserGame', onlineUserGame);
     io.emit('getOnlineUsersGame', onlineUserGame);
    console.log("User Disconnected", socket.id);
   })
})



connectDB();

// Manejar conexiones WebSocket
const port = process.env.PORT || 5000; // Asegúrate de que no sea el puerto fijo


server.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`.bgCyan.white);
});

