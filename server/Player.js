const { createStage } = require('./gameHelpers')
const STAGE_WIDTH = 10; //12
const STAGE_HEIGHT = 20;//20
class Player {
    constructor(id){
        this.id = id,
        this.name = ""
        this.player1 = true
        this.lost = null
        this.winner = null
        this.stage = createStage(STAGE_HEIGHT, STAGE_WIDTH)
        this.blockedRow = 0
    }

    setName(name){
        this.name = name
    }

    setPlayer1False() {
        this.player1 = false
    }

    updatePlayerStage(newStage) {
        this.stage = newStage
    }

    getCurrentStage() {
        return this.stage
    }
      
}

module.exports = Player