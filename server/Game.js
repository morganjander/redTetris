
class Game {
    constructor(name){
        this.name = name
        this.players = []
        this.tetrominos = this.randomTetrominos()
    }

    addPlayer(newPlayer) {
        const players = [...this.players]
        players.push(newPlayer)
        this.players = players
        return players.length
    }

    getAllPlayers() {
        return this.players
    }

    getPlayer(name) {
        const player = this.players.find(player => player.name === name)
        return player
    }

    addRowToOtherPlayers({name, room}) {
        const players = this.players.map(player => {
            const p = {...player}
            if (p.name !== name){
                var row = p.blockedRow
                row++
                p.blockedRow = row
            }
            return p
        })
        this.players = players
    }

    updatePlayerStage({name, current}) {
        const players = this.players.map(player => {
         const p = {...player}
            if (p.name === name){
                p.stage = current
            }
            return p
        })
        this.players = players
    }

    setPlayerLost(name) {
        const players = this.players.map(player => {
            const p = { ...player}
            if (player.name === name) {
                p.lost = true
            }
            return p
        })
        this.players = players
    }

    removePlayer(name) {
        const players = this.players.filter(player => player.name !== name)
        this.players = players
        return players.length
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