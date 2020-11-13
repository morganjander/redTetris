import React, { useState, useEffect } from 'react';
import { StyledStage } from './styles/StyledStage';
import { useSocket } from '../contexts/SocketProvider';

import { OpponentCell } from './Cell';

const OpponentStage = () => {
  const socket = useSocket()
  const [stage, setStage] = useState(null)

  const receiveData = (data) => {
    setStage(data)    
  }

  useEffect(() => {
    if (socket == null) return
    socket.on('opponent-stage', (data) => {
      receiveData(data)
      console.log("received: " + data)
    })
    

    return () => socket.off('opponent-stage')
  }, [socket])

  if (stage){
    return (
        <StyledStage width={stage[0].length} height={stage.length}>
        {stage.map(row => row.map((cell, x) => <OpponentCell key={x} type={cell[0]} status={cell[1]} />))}
        </StyledStage>
        
      )
  }
  return null
  
}

export default OpponentStage;