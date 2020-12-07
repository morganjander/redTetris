import { createStage, checkCollision} from './gameHelpers'

test('creates initial empty stage', () => {
    const array = [[[0, 'clear'], [0, 'clear'], [0, 'clear']],
                    [[0, 'clear'], [0, 'clear'], [0, 'clear']],
                    [[0, 'clear'], [0, 'clear'], [0, 'clear']]];
    
    const array1 = [[[0, 'clear']]]
    expect(createStage(3, 3)).toEqual(array)
    expect(createStage(1, 1)).toEqual(array1)
})

test('checks if tetro has collided', () => {
    const player = {
        pos: { x: -1, y: 1 },
        tetromino: [[0, 'L', 0], 
                    [0, 'L', 0], 
                    [0, 'L', 'L']],
        collided: false,
      }

    
    const stage = [[[0, 'clear'], [0, 'clear'], [0, 'clear'], [0, 'clear']],
                    [[0, 'clear'], [0, 'clear'], [0, 'clear'], [0, 'clear']],
                    [[0, 'clear'], [0, 'clear'], [0, 'clear'], [0, 'clear']],
                    [[0, 'clear'], [0, 'clear'], [0, 'clear'], [0, 'clear']],
                    [[0, 'clear'], [0, 'clear'], [0, 'clear'], [0, 'clear']],
                    [[0, 'clear'], [0, 'clear'], [0, 'clear'], [0, 'clear']]
                ];
    const move = {x: -1, y : 0};

    expect(checkCollision(player, stage, move)).toBe(true)
})

