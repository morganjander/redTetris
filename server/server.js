const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server);
const Game = require('./Game')
const Player = require('./Player')
const { deletePlayer, removePlayerFromRoom, findPlayerRoom, findWinner, getAvailableGames, nameIsAvailable } = require('./functions')
const { addRowToOtherPlayers, updatePlayerStage, setPlayerLost } = require('./gameFunctions')

const port = process.env.PORT || 4000;
const games = { name: {}}
const players = {id: {}}

io.on('connection', (socket) => {
   players[socket.id] = new Player(socket.id);

   socket.on('get-list', (name) => {
      if(players[socket.id].name === null){
         if (nameIsAvailable(players, name)){
            players[socket.id].setName(name)
            io.to(socket.id).emit('available-games', getAvailableGames(games))
         } else {
            io.to(socket.id).emit('go-back', true)
         }
      } else {
         io.to(socket.id).emit('available-games', getAvailableGames(games))
      }
      
   })

   socket.on('join-game', (room) => {
      if(!games[room]){
         games[room] = new Game(room)
      }
      socket.join(room)      
      if(games[room].addPlayer(players[socket.id]) > 1){
         players[socket.id].setPlayer1False()
      }
      io.to(socket.id).emit('your-player', players[socket.id])
      io.to(room).emit('tetroList', games[room].tetrominos);
      io.to(room).emit('playerList', games[room].getAllPlayers())
      io.emit('available-games', getAvailableGames(games))
   })
   
   socket.on('startGame', ({name, room}) => {
      socket.to(room).emit('startGame')
      games[room].setGameStarted()
      io.emit('available-games', getAvailableGames(games))
   })
      
   socket.on('current-stage', ({room, name, current}) => {
      if(!games[room]) return
      updatePlayerStage({games, room, name, current})
         io.to(room).emit('updatePlayer', games[room].getPlayer(name))
      })

  socket.on('row-cleared', ({name, room}) => {
     addRowToOtherPlayers({games, name, room})
     socket.to(room).emit('add-row')
   })

  socket.on('pauseGame', ({name, room}) => {
     io.to(room).emit('pauseGame')
   })

   socket.on('game-over', ({name, room}) => {
      if(!games[room]) return
      setPlayerLost({games, room, name})
      const winner = findWinner(games[room])
      if (winner) {
            io.to(room).emit("winner", winner)
      }
   })
  
   socket.on('player-left', ({name, room}) => {
      removePlayerFromRoom(games, room, name)
      players[socket.id].setPlayer1True()
      io.emit('available-games', getAvailableGames(games))
      if(!games[room]) return
      const playersLeft = games[room].getAllPlayers()
      if (playersLeft.length === 1){
         io.to(playersLeft[0].id).emit("winner", playersLeft[0].name)
      }
   })

   socket.on('disconnect', () => {
      const playerName = players[socket.id].name
      const room = findPlayerRoom(games, playerName)
      if (room){
         removePlayerFromRoom(games, room, playerName)
         if(games[room]) {
            const playersLeft = games[room].getAllPlayers()
            if (playersLeft.length === 1){
               io.to(playersLeft[0].id).emit("winner", playersLeft[0].name)
            }
         }
      }
      deletePlayer(players, socket.id)
      io.emit('available-games', getAvailableGames(games))
   })
});

server.listen(port, () => {
   console.log(`Listening on port ${port}`)
})
