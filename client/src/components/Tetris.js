import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { useSocket } from '../contexts/SocketProvider';
import { useTetroList } from '../contexts/TetrisProvider'
import queryString from 'query-string'
// Styled Components
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// Custom Hooks
import { useTetro } from '../hooks/useTetro';
import { useStage } from '../hooks/useStage';
import { useGame } from '../hooks/useGame'

// Components
import {Stage} from './Stage';
import OpponentStage from './OpponentStage'
import Display from './Display';
import Next from './Next'
import Button from './Button';
import Paused from './Paused';

const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [data, setData] = useState({})
  const [start, setStart] = useState(false)
  const [opponent, setOpponent] = useState("")
  const [winner, setWinner] = useState("")

  const [tetro, updateTetroPos, resetTetro, tetroRotate] = useTetro();
  const [stage, next] = useStage(tetro, resetTetro, data);
  const [move, keyUp, startGame, pauseGame, endGame] = useGame(data, setStart, tetro, resetTetro, stage, updateTetroPos, tetroRotate, gameOver, setGameOver, dropTime, setDropTime, setGamePaused, setWinner)

  const socket = useSocket()
  const tetroList = useTetroList()
  
 useEffect(() => {
    if (socket === null) return
      const data = queryString.parse(window.location.search)
      setData(data)
      socket.emit('join', data)

      socket.on('player2-joined', (players) => {
        const {name} = data
        const [name1, name2] = players
        setOpponent(name1 === name ? name2 : name1)
      })
    

    return () => socket.off('player2-joined')
      
  }, [socket])

  useEffect(() => {
    if (socket === null) return
      socket.on('startGame', () => {
        startGame()
      })
      socket.on('pauseGame', () => {
        pauseGame()
       })
       socket.on("gameover", (name) => {
        endGame(name)
       })
       socket.on('player-left', () => {
         console.log("player has left")
         endGame()
       })

       return () => {
        socket.off('startGame')
        socket.off('pauseGame')
        socket.off('gameover')
        socket.off('player-left')
       }
    
  })

 const {name} = data
  return (
    <>
    <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={keyUp}>
      <StyledTetris>
        <p style={{"color": "#999"}}>{name}</p>
        <Stage stage={stage} />
        <aside >
          {gameOver ? (
            <Display gameOver={gameOver} text={`Game Over: ${winner} won!`}/>
          ) : (
            <div>
              {start ? <Next next={tetroList ? tetroList[next] : 0}/> : null}
             </div>
          )}
          {gamePaused ? <Paused/>: null}
          {start ? null : <Button callback={() => socket.emit('startGame', data)} text="Start Game"/>}
          {start ? <Button callback={() => socket.emit('pauseGame', data)} text={gamePaused ? "Unpause":"Pause"}/> : null}
          <Link 
                style={{"textDecoration": "none"}}
                onClick={() => socket.emit('left', data)}
                to={'/'}>
            <Button text="Leave Game"/>
          </Link>
        </aside>
        <p style={{"color": "#999"}}>{opponent}</p>
        <OpponentStage />
      </StyledTetris>
    </StyledTetrisWrapper>
    </>
  );
};

export default Tetris;
