import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { usePlayer } from '../contexts/PlayerProvider';

export const useStage = (player, resetPlayer, data) => {
  const [playerData, setPlayerData, playerStage, setPlayerStage] = usePlayer()
  const [next, setNext] = useState(1)
  const {room} = data
  const name = playerData.name
  const socket = useSocket()
  
  useEffect(() => {
    setPlayerStage(prev => updateStage(prev))
    
    const sweepRows = newStage => {
      let index = 0
      const result = newStage.reduce((acum, row) => {
        if (row.findIndex(cell => cell[0] === 0) === -1 && row[0][0] !== 1) {
          acum.unshift(new Array(newStage[0].length).fill([0, 'clear']));//add new blank row to the top
          index++
          if (index > 1) {
            socket.emit('row-cleared', {name, room})
          }
          return acum;
        }
        
       
        acum.push(row);
        return acum;
      }, [])
      return result
    }
  
    const updateStage = prevStage => {
      // First flush the stage
      if(!prevStage) return null
      if (!prevStage[0]) return null
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
        const stage = sweepRows(newStage)
        socket.emit('current-stage', {room, name, playerStage})
        return stage
      }

      return newStage;
    };

    
  }, [player, resetPlayer, next, socket, name, room]);

  return [playerStage, next];
};