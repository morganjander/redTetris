import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSocket } from '../contexts/SocketProvider'
import './styles/Join.css'

export default function Join() {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [gamesList, setGamesList] = useState(null)

    const socket = useSocket()
    useEffect(() => {
        if (socket === null) return
        
        socket.on('available-games', (games) => {
            setGamesList(games)             
                
        })
            
        return () => socket.off('available-games')

    }, [socket])

    const availableGames = () => {
            return (
                Object.entries(gamesList).map(entry => {
                    const [key, value] = entry;
                    if (value.players) {
                        const playerName = value.players[0]
                        return (
                            <Link key={key}
                                onClick={e => {
                                    if (name === ''){
                                        e.preventDefault()
                                        alert("please enter your name")
                                    }
                                }}
                                to={`/play?name=${name}&room=${value.name}`}>
                                <button className="button mt-20">{playerName ? `Play against ${playerName}` : null}</button>
                            </Link>
                        )
                    }
                    
                  })

            )
      
    }
    

   
    
    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Red Tetris</h1>
                
                <div><input placeholder="Name" className="joinInput" type="text" onChange={e => setName(e.target.value)}/>
                <input placeholder="Room" className="joinInput mt-20" type="text" onChange={e => setRoom(e.target.value)}/>
                </div>
                {gamesList ? availableGames() : null}
                <Link 
                    onClick={e => (!name || !room) ? e.preventDefault() : null}
                    to={`/play?name=${name}&room=${room}`}>
                <button className="button mt-20" type="submit">Start New Game</button>
                </Link>
            </div>
        </div>
    )
}
