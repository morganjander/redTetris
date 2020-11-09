import React from 'react';
import { StyledCell } from './styles/StyledCell';
import { TETROMINOS } from '../tetrominos';

export const Cell = ({ type }) => (
  <StyledCell type={type} color={TETROMINOS[type].color} />
)

export const OpponentCell = ({ type, status }) => {
  var color ='171, 38, 23'
  if (status === 'merged')
      color = '119,136,153'
  if (status === 'blocked')
      color = '0, 0, 0'
  return (
    <StyledCell type={type} color={color} />
  )

}
  
