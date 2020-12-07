module.exports = {
    addRowToOtherPlayers : ({games, name, room}) => {
        const players = games[room].players.map(player => {
            const p = {...player}
            if (p.name !== name){
                var row = p.blockedRow
                row++
                p.blockedRow = row
            }
            return p
        })
        games[room].players = players
        return games[room]
    },
    updatePlayerStage : ({games, room, name, current}) => {
        const players = games[room].players.map(player => {
         const p = {...player}
            if (p.name === name){
                p.stage = current
            }
            return p
        })
        games[room].players = players
        return games[room]
    }, 
    setPlayerLost : ({games, room, name}) => {
        const players = games[room].players.map(player => {
            const p = { ...player}
            if (player.name === name) {
                p.lost = true
            }
            return p
        })
        games[room].players = players
        return games[room]
    }
}