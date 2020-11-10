
const randomTetrominos = () => {
    var tetList = ''
    const tetrominos = 'IJLOSTZ';
    for (var i = 0; i < 1000; i++) {
        tetList = tetList.concat(tetrominos[Math.floor(Math.random() * tetrominos.length)])
    }
    return tetList
  };

class Game {
    constructor(){
        this.tetrominos = randomTetrominos(),
        this.players = []
    }

    addPlayer(name) {
        const players = [...this.players]
        if (players.length < 2) {
            players.push(name)
            this.players = players
        }
    }

    removePlayer(name) {
        const players = this.players.filter(player => player !== name)
        this.players = players
    }
}

module.exports = Game