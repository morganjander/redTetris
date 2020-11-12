import React, { useContext, useEffect, useState} from 'react'
import { useSocket } from './SocketProvider'

const TetrisContext = React.createContext()

export function useTetris() {
    return useContext(TetrisContext)
}

export function TetrisProvider ({ children }) {
    const [tetrisList, setTetrisList] = useState("")
    const socket = useSocket()

    useEffect(() => {
        if (socket === null) return

        socket.on('tetroList', (list) => {
            setTetrisList(list)
        })

        return () => socket.off('tetroList')
    }, [socket])

    return (
        <TetrisContext.Provider value={tetrisList}>
            {children}
        </TetrisContext.Provider>
    )

    
}