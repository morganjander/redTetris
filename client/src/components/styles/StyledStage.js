import styled from 'styled-components'

export const StyledStage = styled.div`
    display: grid;
    grid-template-rows: repeat(
        ${props => props.height},
        calc(25vw / ${props => props.width})
    );
    grid-template-columns: repeat(${props => props.width}, 1fr);
    grid-gap: 1px;
    border: 1px solid #999;
    width: 100%;
    max-width: 25vw;
    background: #999;
`

export const StyledNextStage = styled.div`
    display: grid;
    grid-template-rows: repeat(
        ${props => props.height},
        calc(10vw / ${props => props.width})
    );
    grid-template-columns: repeat(${props => props.width}, 1fr);
    grid-gap: 1px;
    border: 1px solid #999;
    width: 100%;
    max-width: 10vw;
    background: #999;
`