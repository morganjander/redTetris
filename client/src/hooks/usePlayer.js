import { useState, useCallback } from 'react';
import { TETROMINOS } from '../tetrominos';
import { STAGE_WIDTH, checkCollision } from '../gameHelpers';
import { useTetris } from '../contexts/TetrisProvider'

export const usePlayer = () => {
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
  });

  const tetros = useTetris()
  console.log("TETRISLIST in usePlayer: " + tetros)

  const rotate = (matrix, dir) => {
    // Make the cols become rows(transpose)
    const rotatedTetro = matrix.map((_, index) =>
      matrix.map(col => col[index]),
    );
    // Reverse each row to get a rotated matrix
    if (dir > 0) return rotatedTetro.map(row => row.reverse());
    return rotatedTetro.reverse();
  };

  const playerRotate = (stage, dir) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while(checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -dir);
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  };

  const updatePlayerPos = ({ x, y, collided }) => {
    setPlayer(prev => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided,
    }));
  };

  const resetPlayer = useCallback((next) => {
  if (tetros) {
      setPlayer({
        pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
        tetromino: TETROMINOS[tetros[next]].shape,
        collided: false,
      });
    }
      
  }, [tetros]);

  return [player, updatePlayerPos, resetPlayer, playerRotate];
};