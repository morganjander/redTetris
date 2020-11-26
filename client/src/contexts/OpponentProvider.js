import React, { useContext, useState, useEffect } from 'react'
import { useSocket } from './SocketProvider';
import { usePlayer } from './PlayerProvider';

const OpponentContext = React.createContext()

export function useOpponents() {
    return useContext(OpponentContext)
}

export function OpponentProvider({ children }) {
    const [opponents, setOpponents] = useState([])
    const socket = useSocket()
    const playerData = usePlayer()
    const {name} = playerData

    useEffect(() => {
        if (socket === null) return
        socket.on('playerList', (players) => {
            const others = players.filter(player => player.name !== name)
            setOpponents(others)
        })

        const updateOpp = (player) => {
            setOpponents(prevOpponents => 
                prevOpponents.map(opp => {
                    if (opp.name === player.name){
                        opp = player
                    }
                    return opp
                }))
        }

        socket.on('updatePlayer', player => {
            updateOpp(player)
        })
        return () => {
            socket.off('playerList')
            socket.off('updatePlayer')
          }
    }, [socket, name])

    return (
        <OpponentContext.Provider 
        value={opponents}>
            {children}
        </OpponentContext.Provider>
    )
}