export const TETROMINOS = {
  0: { shape: [[0]], color: '171, 38, 23' },
  I: {
    shape: [[0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0]],
    color: '145, 208, 242',
  },
  J: {
    shape: [[0, 'J', 0], [0, 'J', 0], ['J', 'J', 0]],
    color: '6, 61, 107',
  },
  L: {
    shape: [[0, 'L', 0], [0, 'L', 0], [0, 'L', 'L']],
    color: '223, 173, 36',
  },
  O: {
    shape: [['O', 'O'], ['O', 'O']],
    color: '253, 255, 165',
  },
  S: {
    shape: [[0, 'S', 'S'], ['S', 'S', 0], [0, 0, 0]],
    color: '117, 255, 121',
  },
  T: {
    shape: [[0, 0, 0], ['T', 'T', 'T'], [0, 'T', 0]],
    color: '205, 151, 239',
  },
  Z: {
    shape: [['Z', 'Z', 0], [0, 'Z', 'Z'], [0, 0, 0]],
    color: '255, 155, 200',
  },
};

export const randomTetromino = () => {
  const tetrominos = 'IJLOSTZ';
  const randTetromino =
    tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};
