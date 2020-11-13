import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button';
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
                            <Link 
                            style={{"text-decoration": "none"}}
                            key={key}
                            onClick={e => {
                                        if (name === ''){
                                            e.preventDefault()
                                            alert("please enter your name")
                                        }
                                    }}
                            to={`/play?name=${name}&room=${value.name}`}>
                                <Button text={playerName ? `Play against ${playerName}` : null} />
                            </Link>
                        )
                    }
                    return null
                  })

            )
      
    }
    

   
    
    return (
        <div className="joinOuterContainer">
           <div className="center">
                <h1 className="heading">Red Tetris</h1>
                <div><input placeholder="Name" className="joinInput" type="text" onChange={e => setName(e.target.value)}/>                </div>
                    {gamesList ? availableGames() : null}
                <input placeholder="Room" className="joinInput mt-20" type="text" onChange={e => setRoom(e.target.value)}/>
                <Link style={{"text-decoration": "none"}}
                    onClick={e => (!name || !room) ? e.preventDefault() : null}
                    to={`/play?name=${name}&room=${room}`}>
                        <Button text={"Start New Game"}/>
                </Link>
            </div>
        </div>
    )
}
