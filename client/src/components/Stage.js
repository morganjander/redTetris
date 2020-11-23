import React from 'react';
import { StyledStage, StyledNextStage } from './styles/StyledStage';

import { Cell } from './Cell';

export const Stage = ({ stage }) => {
  if(!stage) return null
  if (!stage[0]) {
    console.log("stage is: " + JSON.stringify(stage))
    return null
  } 
  
  return (
    <StyledStage width={stage[0].length} height={stage.length}>
    {stage.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]}/>))}
    </StyledStage>
  )
  
}


export const NextStage = ({ stage }) => {
  
  return (
    <>
    <p style={{"fontFamily": "Pixel", color: "#999"}}>Next: </p>
    <StyledNextStage width={stage[0].length} height={stage.length}>
    {stage.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]}/>))}
    </StyledNextStage>
    </>
    
  )
  
}
