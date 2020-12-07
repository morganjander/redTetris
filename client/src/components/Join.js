import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useSocket } from '../contexts/SocketProvider'
import queryString from 'query-string'
import './styles/Join.css'

export default function Join(props) {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [goBack, setGoBack] = useState(false)
    const [gamesList, setGamesList] = useState(null)

    const socket = useSocket()

    useEffect(() => {
        if (socket === null) return
        socket.on('go-back', (bool) => {
            setGoBack(bool)
        })
        return () => socket.off('go-back')
    }, [socket])

    useEffect(() => {
        const data = queryString.parse(window.location.search)
        const {name} = data
        setName(name)
        if (socket === null) return
        socket.emit('get-list', name)
        
        socket.on('available-games', (games) => {
            setGamesList(games)
        })  
        return () => socket.off('available-games')

    }, [socket])

    const sendPlayerData = (room) => {
        socket.emit('join-game', room)
    }

    const availableGames = () => {
        return (
            gamesList.map(game => {
                const playerName = game.players[0].name
                return (
                    <Link 
                        style={{"textDecoration": "none"}}
                        key={playerName}
                        onClick={e => {
                                    if (name === ''){
                                        e.preventDefault()
                                        alert("please enter your name")
                                    }
                                sendPlayerData(game.name)
                                }
                            }
                        to={`/play?name=${name}&room=${game.name}`}>
                        <button>{playerName ? `Play against ${playerName}` : null}</button>
                    </Link>
                )
            })
        )
    }
    return (
        <>
            {goBack ? <Redirect to={{
                pathname:"/",
                state: "Username already taken"
            }}/> : <div className="joinOuterContainer">
            <div className="center">
                 <h1 className="heading">Red Tetris</h1>
                     {gamesList && name ? availableGames() : null}
                 <input placeholder="Room" className="joinInput mt-20" type="text" onChange={e => setRoom(e.target.value)}/>
                 <Link  className="button1" style={{"textDecoration": "none"}}
                     onClick={e => 
                         (!name || !room) ? e.preventDefault() : sendPlayerData(room)}
                     to={`/play?name=${name}&room=${room}`}>
                         <button>Start New Game</button>
                 </Link>
             </div>
         </div>}
        </>
    )
}
