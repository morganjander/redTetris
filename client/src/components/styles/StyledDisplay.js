import styled from 'styled-components'

export const StyledDisplay = styled.div`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    text-justify: inter-word;
    margin: 0 10 20px 0;
    padding: 20px;
    border: 4px solid red;
    min-height: 10px;
    max-width: 18vw;
    border-radius: ${props => (props.gameOver ? '0px' : '20px')};
    color: ${props => (props.gameOver ? 'red' : '#999')};
    background: #999;
    font-family: Pixel, Arial, Helvetica, sans-serif;
    font-size: 1rem;
    `