import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button';
import { useSocket } from '../contexts/SocketProvider'
import './styles/Join.css'

export default function Join() {
    const [playerName, setPlayerName] = useState('')
    const [room, setRoom] = useState('')
    const [gamesList, setGamesList] = useState(null)

    const socket = useSocket()
    useEffect(() => {
        if (socket === null) return
        
        socket.on('available-games', (games) => {
            setGamesList(games)
        })
            
        return () => socket.off('available-games')

    })

    const availableGames = () => {
            return (
                Object.entries(gamesList).map(entry => {
                    const [key, value] = entry;
                    if (value.players) {
                        const {name} = value.players[0]
                        return (
                            <Link 
                            style={{"textDecoration": "none"}}
                            key={key}
                            onClick={e => {
                                        if (name === ''){
                                            e.preventDefault()
                                            alert("please enter your name")
                                        }
                                    }}
                            to={`/play?name=${playerName}&room=${value.name}`}>
                                <Button text={name ? `Play against ${name}` : null} />
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
                <div><input placeholder="Name" className="joinInput" type="text" onChange={e => setPlayerName(e.target.value)}/>                </div>
                    {gamesList ? availableGames() : null}
                <input placeholder="Room" className="joinInput mt-20" type="text" onChange={e => setRoom(e.target.value)}/>
                <Link style={{"textDecoration": "none"}}
                    onClick={e => (!playerName || !room) ? e.preventDefault() : null}
                    to={`/play?name=${playerName}&room=${room}`}>
                        <Button text={"Start New Game"}/>
                </Link>
            </div>
        </div>
    )
}
