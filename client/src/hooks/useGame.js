import { useSocket } from '../contexts/SocketProvider';
import { checkCollision } from '../gameHelpers';
import { useInterval } from '../hooks/useInterval';

export const useGame = (data, setStart, tetro, resetTetro, playerStage, updateTetroPos, tetroRotate, gameOver, setGameOver, dropTime, setDropTime, setGamePaused, setWinner) => {
    const socket = useSocket()

    const startGame = () => {
      setDropTime(700)
      resetTetro(0)
      setGameOver(false);
      setStart(true)
    }

    const pauseGame = () => {
        setDropTime(prev => prev === null ? 700 : null)
        setGamePaused(prev => !prev)
    }

    const endGame = (name) => {
     // setGameOver(true)
      setDropTime(null)
      setWinner(name)
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

    const moveTetro = dir => {
        if (!checkCollision(tetro, playerStage.current, { x: dir, y: 0 })) {
          updateTetroPos({ x: dir, y: 0 });
        }
      }

    const drop = () => {
        if (!checkCollision(tetro, playerStage.current, { x: 0, y: 1 })) {
          updateTetroPos({ x: 0, y: 1, collided: false })
        } else {
          // Game Over
          if (tetro.pos.y < 1) {
            socket.emit("game-over", data)
            console.log("GAME OVER!!!");
            setGameOver(true);
            
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
    
    
      useInterval(() => {
        drop();
      }, dropTime)

    return [move, keyUp, startGame, pauseGame, endGame]
}