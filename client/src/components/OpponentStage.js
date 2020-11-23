import React from 'react';
import { StyledStage } from './styles/StyledStage';
import { OpponentCell } from './Cell';

const OpponentStage = ({stage, name}) => {
  if (stage){
    return (
      <>
      <p style={{"color": "#999"}}>{name}</p>
        <StyledStage width={stage[0].length} height={stage.length}>
        {stage.map(row => row.map((cell, x) => <OpponentCell key={x} type={cell[0]} status={cell[1]} />))}
        </StyledStage>
      </>
      )
  }
  return null
}

export default OpponentStage;