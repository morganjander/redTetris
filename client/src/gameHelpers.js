export const STAGE_WIDTH = 12; //12
export const STAGE_HEIGHT = 20;//20

export const createStage = (height, width) =>
  Array.from(Array(height), () => //make an array of height many arrays, made by calling the provided callback
    new Array(width).fill([0, 'clear']), //make a new array of width many arrays, filled with 2 items: 0 and 'clear'
  );

export const checkCollision = (player, stage, { x: moveX, y: moveY }) => { 
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[y].length; x += 1) {
      // 1. Check that we're on an actual Tetromino cell
      if (player.tetromino[y][x] !== 0) {
        if (
          // 2. Check that our move is inside the game areas height (y)
          // We shouldn't go through the bottom of the play area
          !stage[y + player.pos.y + moveY] ||
          // 3. Check that our move is inside the game areas width (x)
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          // 4. Check that the cell wer'e moving to isn't set to clear
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !==
            'clear'
        ) {
          console.log("checking collision true- tetromino:"  + player.tetromino + "player pos x" + player.pos.x  + "player pos y" + player.pos.y +" - movex: " + moveX + " - movey: " + moveY + "stage: " + stage)
          return true;
        }
      }
    }
  }
};