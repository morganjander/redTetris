const { randomTetrominos } = require('./functions')
class Game {
    constructor(name){
        this.name = name
        this.players = []
        this.tetrominos = randomTetrominos()
        this.started = false
    }

    addPlayer(newPlayer) {
        const players = [...this.players]
        players.push(newPlayer)
        this.players = players
        return players.length
    }

    setGameStarted() {
        this.started = true
    }

    getAllPlayers() {
        return this.players
    }

    getPlayer(name) {
        const player = this.players.find(player => player.name === name)
        return player
    }

    removePlayer(name) {
        const players = this.players.filter(player => player.name !== name)
        this.players = players
        return players.length
    }

}

module.exports = Game