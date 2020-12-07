module.exports = {
    randomTetrominos : () => {
        var tetList = ''
        const tetrominos = 'IJLOSTZ';
        for (var i = 0; i < 1000; i++) {
            tetList = tetList.concat(tetrominos[Math.floor(Math.random() * tetrominos.length)])
        }
        return tetList
    },

    deletePlayer : (players, id) => {
        delete players[id]
        return players
    },
    removePlayerFromRoom : (games, room, name) => {
        if (!games[room]) return
        games[room].setGameStarted()
        if(games[room].removePlayer(name) === 0){
            delete games[room]
         }
         return games
    },
    findPlayerRoom : (games, playerName) => {
        let result = null
        Object.entries(games).map(entry => {
            const [key, value] = entry
            if (value.players) {
              const index = value.players.findIndex((player) => player.name === playerName)
              if (index != -1){
                result = value.name
              }
            }
         })
         return result
    },
    getAvailableGames: (games) => {
        const availableGames = []
        Object.entries(games).map(entry => {
            const [key, value] = entry
            if (value.started === false) {
                availableGames.push(value)
            }
        })
        return availableGames
    },

    nameIsAvailable: (games, name) => {
        let result = true
        Object.entries(games).map(entry => {
            const [key, value] = entry
            if(value.name === name) {
                result = false
            }
        })
        return result
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