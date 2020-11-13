const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server);
const Game = require('./Game')
const Player = require('./Player')
const {updateTetromino, updatePlayer} = require('./functions')

const port = process.env.PORT || 4000;
const games = { name: {}}


io.on('connection', (socket) => {
   io.emit('available-games', games)
   
   socket.on('join', ({name, room}) => {
      if(!games[room]){
         games[room] = new Game(room)
         console.log("creating room")
      }
      socket.join(room)
      if(games[room].addPlayer(name) === 2){
         console.log(name + " joined " + games[room].name)
         io.to(room).emit("player2-joined", (games[room].getPlayers()))
      }
      io.to(room).emit('tetroList', games[room].tetrominos);
   })
  

   socket.on('left', ({name, room}) => {
      if (!games[room]) return
      games[room].removePlayer(name)
      if(games[room].players.length === 0){
         console.log("deleting " + games[room].name)
         delete games[room]
      }
   })
   
   socket.on('send-message', (data) => {
      socket.broadcast.emit('recieve-message', data)
   })

   socket.on('startGame', ({name, room}) => {
      io.to(room).emit('startGame');
  })

  socket.on('row-cleared', () => {
   socket.broadcast.emit('other-player-cleared')
  })

  socket.on('pauseGame', ({name, room}) => {
   io.to(room).emit('pauseGame');
})

socket.on('game-over', ({name, room}) => {
   if (!games[room]) return
   const winner = games[room].getPlayers().find((player) => player !== name)
   io.to(room).emit("gameover", winner)
})

   socket.on('current-stage', ({room, stage}) => {
      socket.to(room).emit('opponent-stage', stage)
     
   })
   socket.on('disconnect', () => {
      //socket.leave(room);
   });
});

server.listen(port, () => {
   console.log(`Listening on port ${port}`)
})

