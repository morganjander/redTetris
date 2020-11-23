import styled from 'styled-components'

export const StyledStage = styled.div`
    display: grid;
    grid-template-rows: repeat(
        ${props => props.height},
        calc(20vw / ${props => props.width})
    );
    grid-template-columns: repeat(${props => props.width}, 1fr);
    grid-gap: 1px;
    border: 5px solid #999;
    width: 100%;
    max-width: 20vw;
    background: #999;
`

export const StyledNextStage = styled.div`
    display: grid;
    grid-template-rows: repeat(
        ${props => props.height},
        calc(18vw / ${props => props.width})
    );
    grid-template-columns: repeat(${props => props.width}, 1fr);
    grid-gap: 1px;
    border: 5px solid #999;
    width: 100%;
    max-width: 18vw;
    background: #999;
`