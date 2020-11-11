const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server);
const Game = require('./Game')
const Player = require('./Player')
const {updateTetromino, updatePlayer} = require('./functions')

const PORT = 4000;
const games = { name: {}}

io.on('connection', (socket) => {

   io.emit('available-games', games)
   
   socket.on('join', ({name, room}) => {
      if(!games[room]){
         games[room] = new Game(room)
         console.log("creating room")
      }
      if(games[room].addPlayer(name)){
         io.emit('tetroList', games[room].tetrominos);
         console.log(name + " joined " + games[room].name)
         socket.broadcast.emit("player-joined", (name))
         io.emit('available-games', games)
      }
      io.emit('available-games', games)
   })

  

   socket.on('left', ({name, room}) => {
      games[room].removePlayer(name)
      if(games[room].players.length === 0){
         console.log("deleting " + games[room].name)
         delete games[room]
      }
   })
   
   socket.on('send-message', (data) => {
      socket.broadcast.emit('recieve-message', data)
   })

   socket.on('startGame', () => {
      io.emit('startGame');
  })

  socket.on('row-cleared', () => {
   socket.broadcast.emit('other-player-cleared')
  })

  socket.on('pauseGame', () => {
   io.emit('pauseGame');
})

socket.on('game-over', () => {
   io.emit("gameover")
})

   socket.on('current-stage', (data) => {
      socket.broadcast.emit('opponent-stage', data)
   })
   socket.on('disconnect', () => {
     
      //socket.leave(room);
   });
});

server.listen(PORT, () => {
   console.log(`Listening on port ${PORT}`)
})

