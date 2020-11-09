import React, { useEffect } from 'react';
import { StyledStage } from './styles/StyledStage';
import { useSocket } from '../contexts/SocketProvider';

import { Cell } from './Cell';

const Stage = ({ stage }) => {
  const socket = useSocket()
  useEffect(() => {
    if (socket == null) return
    socket.emit('current-stage', stage)
  })
  return (
    <StyledStage width={stage[0].length} height={stage.length}>
    {stage.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]}/>))}
    </StyledStage>
  )
  
}

export default Stage;