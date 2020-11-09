module.exports = {

    updateTetromino : (game) => {
        const newTetromino = randomTetromino()
        const newGame = { ...game}
        newGame.current = game.current + 1
        return newGame
    },
    
    updatePlayer : (player, tetromino) => {
        const newPlayer = { ...player}
        newPlayer.currentTetromino = player.nextTetromino
        newPlayer.nextTetromino = tetromino
        return newPlayer
    }
}