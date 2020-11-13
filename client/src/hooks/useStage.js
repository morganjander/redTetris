import { useState, useEffect } from 'react';
import { createStage,STAGE_HEIGHT, STAGE_WIDTH} from '../gameHelpers';
import { useSocket } from '../contexts/SocketProvider';

export const useStage = (player, resetPlayer, data) => {
  const [stage, setStage] = useState(createStage(STAGE_HEIGHT, STAGE_WIDTH));
  const [next, setNext] = useState(1)
  const {room} = data

  const socket = useSocket()
  useEffect(() => {
    if (socket == null) return
    const packet = {room, stage}
    socket.emit('current-stage', packet)
  })

  useEffect(() => {
    setStage(prev => updateStage(prev));
    let index = 0
    const sweepRows = newStage => 
    newStage.reduce((acum, row) => {
      if (row.findIndex(cell => cell[0] === 0) === -1 && row[0][0] !== 1) {
      
        index++
        if (index > 1) {
          socket.emit('row-cleared')
        }
        
        acum.unshift(new Array(newStage[0].length).fill([0, 'clear'])); //add new blank row to the top
        return acum;
      }
      acum.push(row);
      return acum;
    }, [])

    const addRows = stage => {
      stage.shift()
      stage.push(new Array(stage[0].length).fill([1, 'blocked']))
      return stage
    }

    const updateStage = prevStage => {
      // First flush the stage
      
      const newStage = prevStage.map(row =>
        row.map(cell => {
          if (cell[1] === 'blocked') return [1, 'blocked']
          if (cell[1] === 'clear') return [0, 'clear']
          return cell
        }),
      );
     
      
      // Then draw the tetromino
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0 && value !== 1) {
            newStage[y + player.pos.y][x + player.pos.x] = [
              value,
              `${player.collided ? 'merged' : 'clear'}`,
            ];
          }
        });
      });
      // Then check if we collided
      if (player.collided) {      
        resetPlayer(next);
        setNext(prev => prev === 999 ? 0 : prev + 1)
        return sweepRows(newStage)
      }

      if (socket) {
        socket.on('other-player-cleared', () => {
          return addRows(newStage)
        })
      }

      return newStage;
    };

    
  }, [player, resetPlayer, next, socket]);

  return [stage, next];
};