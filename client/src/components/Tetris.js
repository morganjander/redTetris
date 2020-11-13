import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { checkCollision } from '../gameHelpers';
import { useSocket } from '../contexts/SocketProvider';
import { useTetroList } from '../contexts/TetrisProvider'
import queryString from 'query-string'
// Styled Components
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// Custom Hooks
import { useTetro } from '../hooks/useTetro';
import { useStage } from '../hooks/useStage';
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

  const [tetro, updateTetroPos, resetTetro, tetroRotate] = useTetro();
  const [stage, next] = useStage(tetro, resetTetro);

  const socket = useSocket()
  const tetroList = useTetroList()


  
  const moveTetro = dir => {
    if (!checkCollision(tetro, stage, { x: dir, y: 0 })) {
      updateTetroPos({ x: dir, y: 0 });
    }
  }
  function reset() {
    //setStage(createStage(STAGE_HEIGHT, STAGE_WIDTH));
       setDropTime(1000)
       resetTetro(0)
       setGameOver(false);
       setStart(true)
  }

  const startGame = () => {
    socket.emit('startGame')
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
    if (!checkCollision(tetro, stage, { x: 0, y: 1 })) {
      updateTetroPos({ x: 0, y: 1, collided: false })
    } else {
      // Game Over
      if (tetro.pos.y < 1) {
        console.log("GAME OVER!!!");
        setGameOver(true);
        socket.emit("game-over")
        setDropTime(null);
      }
      updateTetroPos({ x: 0, y: 0, collided: true });
    }
  }

  const keyUp = ( { keyCode } ) => {
    if (!gameOver){
      if (keyCode === 40){
        setDropTime(1200);
      }
    }

  }

  const dropTetro = () => {
    setDropTime(null);
    drop();
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
        tetroRotate(stage, 1);
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
              {start ? <Next next={tetroList ? tetroList[next] : 0}/> : null}
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
