const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server);
const Game = require('./Game')
const Player = require('./Player')
const {updateTetromino, updatePlayer} = require('./functions')

const PORT = 4000;
const newGame = new Game()

let playerName, roomName

io.on('connection', (socket) => {
   
   socket.on('join', ({name, room}) => {
      newGame.addPlayer(name)
      console.log(newGame.players + " joined room")
   })

   socket.on("reset-tetro", () => {
      io.emit("random-tetro", newGame.randomTetrominos)
   })

   socket.on('left', (name) => {
      console.log(name)
      newGame.removePlayer(name)
      console.log(newGame.players)
   })
   
   socket.on('send-message', (data) => {
      socket.broadcast.emit('recieve-message', data)
   })

   socket.on('startGame', () => {
      io.emit('startGame', newGame.tetrominos);
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

