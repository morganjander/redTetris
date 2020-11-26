const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server);
const Game = require('./Game')
const Player = require('./Player')
const { deletePlayer, removePlayer, findWinner } = require('./functions')

const port = process.env.PORT || 4000;
const games = { name: {}}
const players = {id: {}}

io.on('connection', (socket) => {
   io.emit('available-games', games)
   players[socket.id] = new Player(socket.id)
   
   socket.on('join', ({name, room}) => {
      if(!games[room]){
         games[room] = new Game(room)
      }
      players[socket.id].setName(name)
      socket.join(room)      
      if(games[room].addPlayer(players[socket.id]) > 1){
         players[socket.id].setPlayer1False()
      }
      io.to(socket.id).emit('your-player', players[socket.id])
      io.to(room).emit('tetroList', games[room].tetrominos);
      io.to(room).emit('playerList', games[room].getAllPlayers())
   })
   
   socket.on('startGame', ({name, room}) => {
      io.to(room).emit('startGame')
   })
      
   socket.on('current-stage', ({room, name, current}) => {
      if(!games[room]) return
      games[room].updatePlayerStage({name, current})
         io.to(room).emit('updatePlayer', games[room].getPlayer(name))
      })

  socket.on('row-cleared', ({name, room}) => {
     games[room].addRowToOtherPlayers({name, room})
     socket.to(room).emit('add-row')
   })

  socket.on('pauseGame', ({name, room}) => {
     io.to(room).emit('pauseGame')
   })

   socket.on('game-over', ({name, room}) => {
      if(!games[room]) return
      games[room].setPlayerLost(name)
      const winner = findWinner(games[room])
      if (winner) {
            io.to(room).emit("gameover", winner)
      }
   })
  
   socket.on('left', ({name, room}) => {
      removePlayer(games, room, name)
   })
   socket.on('disconnect', () => {
      deletePlayer(games, players, socket.id)
   })
});

server.listen(port, () => {
   console.log(`Listening on port ${port}`)
})
