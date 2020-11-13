import React, { useContext, useEffect, useState} from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

export function useSocket() {
    return useContext(SocketContext)
}

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const newSocket = io('http://localhost:4000/')//https://red-tetris-server.herokuapp.com/
        setSocket(newSocket)
        
        return () => newSocket.close()
    }, [])
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}
