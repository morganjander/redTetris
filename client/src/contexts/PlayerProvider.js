import React, { useContext, useEffect, useState} from 'react'
import { useSocket } from './SocketProvider'

const PlayerContext = React.createContext()

export function usePlayer() {
    return useContext(PlayerContext)
}

export function PlayerProvider({ children }) {
    const [playerData, setPlayerData] = useState({})
    const [playerStage, setPlayerStage] = useState([])
    const socket = useSocket()

    useEffect(() => {
        if (socket === null) return
        socket.on('your-player', (player) => {
            setPlayerData(player)
            setPlayerStage(player.stage)
        })

        socket.on('add-row', () => {
            setPlayerStage(prev => {
                prev.shift()
                prev.push(new Array(prev[0].length).fill([1, 'blocked']))
                return prev
            })
            const {room, name} = playerData
            socket.emit('current-stage', {room, name, playerStage})
        })
        return () => socket.off('your-player')
    }, [socket])

    return (
        <PlayerContext.Provider value={[playerData, setPlayerData, playerStage, setPlayerStage]}>
            {children}
        </PlayerContext.Provider>
    )
}