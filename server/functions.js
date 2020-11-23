module.exports = {

    deletePlayer : (games, players, id) => {
        const player = players[id].name
        delete players[id]
        Object.entries(games).map(entry => {
           const [key, value] = entry
           
           if (value.players) {
              if (value.removePlayer(player) === 0) {
                 console.log("deleting " + value.name)
                 delete value
              }
           }
        })
    },
    
    removePlayer : (games, room, name) => {
        if (!games[room]) return
        if(games[room].removePlayer(name) === 0){
            console.log("deleting " + games[room].name)
            delete games[room]
         }

    },

    findWinner: (game) => {
        var winner = null
        if(game.players) {
            var i = 0
            game.players.forEach(player => {
                if (player.lost === true) i++
                if (player.lost === null) winner = player.name
            })
            if (i === game.players.length - 1) {
                return winner
            } else {
                return null
            }
        }
    }
}