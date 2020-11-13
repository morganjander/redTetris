
class Game {
    constructor(name){
        this.name = name
        this.players = []
        this.tetrominos = this.randomTetrominos()
    }

    addPlayer(name) {
        const players = [...this.players]
        if (players.length > 1) return null
        if (players.length === 0) {
            console.log("adding player1 " + name)
            players.push(name)
            this.players = players
            return 1
        } else {
            console.log("adding player2 " + name)
            players.push(name)
            this.players = players
            return 2
        }
    }

    getPlayers() {
        return this.players
    }

    removePlayer(name) {
        const players = this.players.filter(player => player !== name)
        this.players = players
    }

    randomTetrominos = () => {
        var tetList = ''
        const tetrominos = 'IJLOSTZ';
        for (var i = 0; i < 1000; i++) {
            tetList = tetList.concat(tetrominos[Math.floor(Math.random() * tetrominos.length)])
        }
        return tetList
      }
}

module.exports = Game