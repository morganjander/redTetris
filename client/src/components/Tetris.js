import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { useSocket } from '../contexts/SocketProvider';
import { useTetroList } from '../contexts/TetrisProvider'
import { useOpponents } from '../contexts/OpponentProvider';
import { usePlayer } from '../contexts/PlayerProvider';
import queryString from 'query-string'
import { checkCollision } from '../gameHelpers';
// Styled Components
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// Custom Hooks
import { useTetro } from '../hooks/useTetro';
import { useStage } from '../hooks/useStage';
import { useGame } from '../hooks/useGame'
import { useInterval } from '../hooks/useInterval';

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
  const [winner, setWinner] = useState("")

  const socket = useSocket()
  const tetroList = useTetroList()
  const playerData = usePlayer()
  const opponents  = useOpponents()

  const [tetro, updateTetroPos, resetTetro, tetroRotate] = useTetro();
  
  const [playerStage, next] = useStage(tetro, resetTetro, data);
  const [startGame, pauseGame, endGame] = useGame(setStart, resetTetro, setGameOver, setDropTime, setGamePaused, setWinner)

  
  

 useEffect(() => {
      const data = queryString.parse(window.location.search)
      setData(data)
  }, [])

  useEffect(() => {
    if (socket === null) return
      socket.on('startGame', () => {
        startGame()
      })
      socket.on('pauseGame', () => {
        pauseGame()
       })
       socket.on('winner', (name) => {
        setDropTime(null)
        setWinner(name)
        setGameOver(true)
       })
       socket.on('player-left', () => {
         endGame()
       })
       
       return () => {
        socket.off('startGame')
        socket.off('pauseGame')
        socket.off('winner')
        socket.off('player-left')
       }
    
  })
 
  const drop = () => {
    if (!checkCollision(tetro, playerStage.current, { x: 0, y: 1 })) {
      updateTetroPos({ x: 0, y: 1, collided: false })
    } else {
      // Game Over
      if (tetro.pos.y < 1) {
        socket.emit("game-over", data)
        setGameOver(true);
        setDropTime(null);
      }
      updateTetroPos({ x: 0, y: 0, collided: true });
    }
  }
  
  const dropTetro = () => {
    setDropTime(null);
    drop();
  }

  const moveTetro = dir => {
    if (!checkCollision(tetro, playerStage.current, { x: dir, y: 0 })) {
      updateTetroPos({ x: dir, y: 0 });
    }
  }

  const move = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 37) {
        moveTetro(-1);
      } else if (keyCode === 39) {
        moveTetro(1);
      } else if (keyCode === 40) {
        dropTetro();
      } else if (keyCode === 38) {
        tetroRotate(playerStage.current, 1);
      } else if (keyCode ===  32){
        socket.emit('pauseGame', data)
      }
    }
  }

  const keyUp = ( { keyCode } ) => {
    if (!gameOver){
      if (keyCode === 40){
        setDropTime(1200);
      }
    }
  }
  useInterval(() => {
    drop();
  }, dropTime)
  
  const startButton = () => {
    if (playerData.player1 && !start && !winner){
      return <Button callback={() => {
        startGame()
        socket.emit('startGame', data)
      }} text="Start Game"/>
    }
    return null
  }
  if (!playerData) return null
  const {name} = data
  return (
    <>
    <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={keyUp}>
      <StyledTetris>
        <p style={{"color": "#999"}}>{name}</p>
        {playerData && <Stage stage={playerStage.current} />}
        <aside >
          {gameOver ? (
            <Display gameOver={gameOver} text={winner === name ? "You win!" : "You lose"}/>
          ) : (
            <div>
              {start ? <Next next={tetroList ? tetroList[next] : 0}/> : null}
             </div>
          )}
          {gamePaused ? <Paused/>: null}
          {startButton()}
          
          {start && !gameOver && playerData.player1 ? <Button callback={() => socket.emit('pauseGame', data)} text={gamePaused ? "Unpause":"Pause"}/> : null}
          <Link 
                style={{"textDecoration": "none"}}
                onClick={() => socket.emit('player-left', data)}
                to={`/join?name=${name}`}>
            <Button text="Leave Game"/>
          </Link>
        </aside>
        {opponents && opponents.map(opponent => <OpponentStage key={opponent.name} name={opponent.name} stage={opponent.stage}/>)}
      </StyledTetris>
    </StyledTetrisWrapper>
    </>
  );
};

export default Tetris;
