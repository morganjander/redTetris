const io = require('socket.io')(3000);
const Game = require('./Game')
const Player = require('./Player')
const {updateTetromino, updatePlayer} = require('./functions')


io.on('connection', (socket) => {
   
   console.log(`Connected: ${socket.id}`);
  
   socket.on('send-message', (data) => {
      socket.broadcast.emit('recieve-message', data)
   })

   socket.on('startGame', () => {
      const newGame = new Game()
      io.emit('startGame', newGame.tetrominos);
  })

  socket.on('row-cleared', () => {
   socket.broadcast.emit('other-player-cleared')
  })

  socket.on('pauseGame', () => {
   io.emit('pauseGame');
})

   socket.on('current-stage', (data) => {
      socket.broadcast.emit('opponent-stage', data)
   })
   socket.on('disconnect', () => {
      console.log(`Disconnected: ${socket.id}`)
      socket.broadcast.emit('player-left')
   });
});

