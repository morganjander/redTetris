import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { createStage, checkCollision, STAGE_HEIGHT, STAGE_WIDTH} from '../gameHelpers';
import { useSocket } from '../contexts/SocketProvider';
import { useTetris } from '../contexts/TetrisProvider'
import queryString from 'query-string'
// Styled Components
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// Custom Hooks
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useInterval } from '../hooks/useInterval';
import { useGameStatus } from '../hooks/useGameStatus';

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

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared, next] = useStage(player, resetPlayer);
  const  [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

  const socket = useSocket()
  const tetros = useTetris()

  console.log("TETRISLIST in Tetris: " + tetros)
  
  const movePlayer = dir => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  }
  function reset() {
    setStage(createStage(STAGE_HEIGHT, STAGE_WIDTH));
       setDropTime(1000)
       resetPlayer(0)
       setGameOver(false);
       setScore(0);
       setRows(0);
       setLevel(0)
       setStart(true)
  }

  const startGame = () => {
    socket.emit('startGame')
  }

  const leaveGame = () => {
    
  }

  const pauseGame = () => {
    socket.emit('pauseGame')
  }

  useEffect(() => {
    if (socket) {
      const data = queryString.parse(window.location.search)
      setData(data)
      socket.emit('join', data)

      socket.on('player-joined', (name) => {
        alert(`${name} has joined the game`)
      })
    }
      
  }, [socket])

  useEffect(() => {
    if (socket) {
      socket.on('startGame', () => {
      reset()
     });
    }

  })

  useEffect(() => {
    if (socket) {
      socket.on('pauseGame', () => {
        setDropTime(prev => prev === null ? 500 : null)
        setGamePaused(prev => !prev)
       })

       socket.on("gameover", () => {
        setGameOver(true)
        setDropTime(null)
       })

       socket.on('player-left', () => {
         console.log("player has left")
         setGameOver(true)
         setDropTime(null)
       })
    }
  }, [socket])
 
  const drop = () => {
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false })
    } else {
      // Game Over
      if (player.pos.y < 1) {
        console.log("GAME OVER!!!");
        setGameOver(true);
        socket.emit("game-over")
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  }

  const keyUp = ( { keyCode } ) => {
    if (!gameOver){
      if (keyCode === 40){
        setDropTime(1200);
      }
    }

  }

  const dropPlayer = () => {
    setDropTime(null);
    drop();
  }

  const move = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        dropPlayer();
      } else if (keyCode === 38) {
        playerRotate(stage, 1);
      } else if (keyCode ===  32){
        pauseGame()
      }
    }
  }

  useInterval(() => {
    drop();
  }, dropTime)

  return (
    <>
    <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={keyUp}>
      <StyledTetris>
        <Stage stage={stage} />
        <aside >
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              {start ? <Next next={tetros ? tetros[next] : 0}/> : null}
             </div>
          )}
          {gamePaused ? <Paused/>: null}
          {start ? null : <Button callback={startGame} text="Start Game"/>}
          {start ? <Button callback={pauseGame} text={gamePaused ? "Unpause":"Pause"}/> : null}
          <Link 
                style={{"text-decoration": "none"}}
                onClick={() => socket.emit('left', data)}
                to={'/'}>
            <Button text="Leave Game"/>
          </Link>
        </aside>
        <OpponentStage />
      </StyledTetris>
    </StyledTetrisWrapper>
    </>
  );
};

export default Tetris;
