import React from 'react';
import {NextStage} from './Stage';

const tetros = {
  0: [[[0, 'clear'], [0, 'clear'], [0, 'clear']],
      [[0, 'clear'], [0, 'clear'], [0, 'clear']],
      [[0, 'clear'], [0, 'clear'], [0, 'clear']],
      [[0, 'clear'], [0, 'clear'], [0, 'clear']],
    ],
  I: [[[0, 'clear'], ['I', 'clear'], [0, 'clear']],
      [[0, 'clear'], ['I', 'clear'], [0, 'clear']],
      [[0, 'clear'], ['I', 'clear'], [0, 'clear']],
      [[0, 'clear'], ['I', 'clear'], [0, 'clear']],
    ],
  J: [[[0, 'clear'], ['J', 'clear'], [0, 'clear']],
      [[0, 'clear'], ['J', 'clear'], [0, 'clear']],
      [['J', 'clear'], ['J', 'clear'], [0, 'clear']],
      [[0, 'clear'], [0, 'clear'], [0, 'clear']],
    ],
  L: [[[0, 'clear'], ['L', 'clear'], [0, 'clear']],
      [[0, 'clear'], ['L', 'clear'], [0, 'clear']],
      [[0, 'clear'], ['L', 'clear'], ['L', 'clear']],
      [[0, 'clear'], [0, 'clear'], [0, 'clear']],
  ],
  O: [[[0, 'clear'], [0, 'clear'], [0, 'clear'], [0, 'clear']],
      [[0, 'clear'], ['O', 'clear'], ['O', 'clear'], [0, 'clear']],
      [[0, 'clear'], ['O', 'clear'], ['O', 'clear'], [0, 'clear']],
      [[0, 'clear'], [0, 'clear'], [0, 'clear'], [0, 'clear']],
  ],
  S: [[[0, 'clear'], ['S', 'clear'], ['S', 'clear']],
      [['S', 'clear'], ['S', 'clear'], [0, 'clear']],
      [[0, 'clear'], [0, 'clear'], [0, 'clear']],
  ],
  T: [[['T', 'clear'], ['T', 'clear'], ['T', 'clear']],
      [[0, 'clear'], ['T', 'clear'], [0, 'clear']],
      [[0, 'clear'], [0, 'clear'], [0, 'clear']],
  ],
  Z: [[['Z', 'clear'], ['Z', 'clear'], [0, 'clear']],
      [[0, 'clear'], ['Z', 'clear'], ['Z', 'clear']],
      [[0, 'clear'], [0, 'clear'], [0, 'clear']],
    ],
}
                  


const Next = ({ next }) => {
  return (        
        <NextStage stage={tetros[next]} />
  )
}

export default Next;