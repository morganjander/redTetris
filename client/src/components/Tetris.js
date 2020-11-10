import React, { useState, useEffect } from 'react';
import { createStage, checkCollision, STAGE_HEIGHT, STAGE_WIDTH} from '../gameHelpers';
import { useSocket } from '../contexts/SocketProvider';
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
import StartButton from './StartButton';
import Paused from './Paused';

const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [name, setName] = useState("")

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared, next] = useStage(player, resetPlayer);
  const  [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

  const socket = useSocket()
  const list = localStorage.getItem('tetroList')
  
  const movePlayer = dir => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  }

  const reset = () => {
    setStage(createStage(STAGE_HEIGHT, STAGE_WIDTH));
       setDropTime(1000)
       resetPlayer(0)
       setGameOver(false);
       setScore(0);
       setRows(0);
       setLevel(0)
  }

  const startGame = () => {
    socket.emit('startGame')
  }

  const leaveGame = () => {
    
    socket.emit('left', name)
  }

  const pauseGame = () => {
    socket.emit('pauseGame')
  }

  useEffect(() => {
    if (socket) {
      const data = queryString.parse(window.location.search)
      const { name } = data
      
      setName(name)
      
      socket.emit('join', data)

    }
      
  }, [socket])

  useEffect(() => {
    if (socket) {
      socket.on('startGame', (list) => {
        localStorage.setItem('tetroList', list);
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
    //Increase level when player has cleared 10 rows
    if (rows > (level + 1) * 5){
      console.log("setting level")
      setLevel(prev => prev + 1);
      //also increase speed
      setDropTime(1000/ (level + 1) + 200);
    }
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
        setDropTime(1000/ (level + 1) + 200);
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
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              <Next next={list[next]}/>
             </div>
          )}
        </aside>
        <OpponentStage />
      </StyledTetris>
      {gamePaused ? <Paused/>: <StartButton callback={startGame} text="Start Game"/>}
          <StartButton callback={leaveGame} text="Leave Game"/>
    </StyledTetrisWrapper>
    </>
  );
};

export default Tetris;
