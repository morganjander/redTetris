import React from 'react';
import { StyledStage, StyledNextStage } from './styles/StyledStage';

import { Cell } from './Cell';

export const Stage = ({ stage }) => {
  
  return (
    <StyledStage width={stage[0].length} height={stage.length}>
    {stage.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]}/>))}
    </StyledStage>
  )
  
}


export const NextStage = ({ stage }) => {
  
  return (
    <>
    <h1 style={{"font-family": "Pixel", color: "#999"}}>Next</h1>
    <StyledNextStage width={stage[0].length} height={stage.length}>
    {stage.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]}/>))}
    </StyledNextStage>
    </>
    
  )
  
}
