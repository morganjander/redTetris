const { deletePlayer, removePlayerFromRoom, findWinner, nameIsAvailable, removePlayerAllRooms } = require('../functions.js')
const { games, players, playerLeft } =  require('./testData.js')
const Game = require('../Game')
const Player = require('../Player')


test('should delete the player from player list', () => {
    expect(deletePlayer(players, 1)).toEqual(playerLeft)
})

test('should remove a player from a room', () => {
    const testGames = { name: {}}
    const testPlayers = { id: {} }
    testPlayers[1] = new Player(1)
    testPlayers[1].setName('Morgan')
    testGames['1'] = new Game('1')
    testGames['1'].addPlayer(testPlayers[1])
   
    expect(removePlayerFromRoom(testGames, '1','Morgan')).toEqual({ name: {}})
})

test('should remove a player from all rooms', () => {
    const testGames = { name: {}}
    const testPlayers = { id: {} }
    testPlayers[1] = new Player(1)
    testPlayers[1].setName('Morgan')
    testGames['1'] = new Game('1')
    testGames['1'].addPlayer(testPlayers[1])
    testGames['2'] = new Game('2')
    testGames['2'].addPlayer(testPlayers[1])
    expect(removePlayerAllRooms(testGames, 'Morgan')).toEqual({ name: {}})
})



test('should return false if name is already taken', () => {
    const testPlayers = { id: {} }
    testPlayers[1] = new Player(1)
    testPlayers[1].setName('Morgan')
    expect(nameIsAvailable(testPlayers, 'Morgan')).toEqual(false)
    expect(nameIsAvailable(testPlayers, "blahbla")).toEqual(true)
})

