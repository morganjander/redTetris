import React, { useContext, useEffect, useState} from 'react'
import { useSocket } from './SocketProvider'

const TetrisContext = React.createContext()

export function useTetroList() {
    return useContext(TetrisContext)
}

export function TetrisProvider ({ children }) {
    const [tetroList, setTetroList] = useState("")
    const socket = useSocket()

    useEffect(() => {
        if (socket === null) return
        socket.on('tetroList', (list) => {
            setTetroList(list)
        })
        return () => socket.off('tetroList')
    }, [socket])

    return (
        <TetrisContext.Provider value={tetroList}>
            {children}
        </TetrisContext.Provider>
    )
}