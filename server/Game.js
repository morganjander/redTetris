
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
        this.tetrominos = randomTetrominos()
    }
}

module.exports = Game