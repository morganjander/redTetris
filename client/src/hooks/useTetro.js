import { useState, useCallback } from 'react';
import { TETROMINOS } from '../tetrominos';
import { STAGE_WIDTH, checkCollision } from '../gameHelpers';
import { useTetroList } from '../contexts/TetrisProvider'

export const useTetro = () => {
  const [tetro, setTetro] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
  });

  const tetroList = useTetroList()

  const rotate = (matrix, dir) => {
    // Make the cols become rows(transpose)
    const rotatedTetro = matrix.map((_, index) =>
      matrix.map(col => col[index]),
    );
    // Reverse each row to get a rotated matrix
    if (dir > 0) return rotatedTetro.map(row => row.reverse());
    return rotatedTetro.reverse();
  };

  const tetroRotate = (stage, dir) => {
    const clonedTetro = JSON.parse(JSON.stringify(tetro));
    clonedTetro.tetromino = rotate(clonedTetro.tetromino, dir);

    const pos = clonedTetro.pos.x;
    let offset = 1;
    while(checkCollision(clonedTetro, stage, { x: 0, y: 0 })) {
      clonedTetro.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedTetro.tetromino[0].length) {
        rotate(clonedTetro.tetromino, -dir);
        clonedTetro.pos.x = pos;
        return;
      }
    }
    setTetro(clonedTetro);
  };

  const updateTetroPos = ({ x, y, collided }) => {
    setTetro(prev => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided,
    }));
  };

  const resetTetro = useCallback((next) => {
  if (tetroList) {
      setTetro({
        pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
        tetromino: TETROMINOS[tetroList[next]].shape,
        collided: false,
      });
    }
      
  }, [tetroList]);

  return [tetro, updateTetroPos, resetTetro, tetroRotate];
};