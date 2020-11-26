import React, { useContext, useEffect, useState} from 'react'
import { useSocket } from './SocketProvider'

const PlayerContext = React.createContext()

export function usePlayer() {
    return useContext(PlayerContext)
}

export function PlayerProvider({ children }) {
    const [playerData, setPlayerData] = useState({})
    const socket = useSocket()

    useEffect(() => {
        if (socket === null) return
        socket.on('your-player', (player) => {
            setPlayerData(player)
        })
        return () => socket.off('your-player')
    })

    return (
        <PlayerContext.Provider value={playerData}>
            {children}
        </PlayerContext.Provider>
    )
}