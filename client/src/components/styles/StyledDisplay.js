import styled from 'styled-components'

export const StyledDisplay = styled.div`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin: 0 10 20px 0;
    padding: 20px;
    border: 4px solid #999;
    min-height: 10px;
    width: 60%;
    border-radius: 20px;
    color: ${props => (props.gameOver ? 'red' : '#999')};
    background: #ab2617;
    font-family: Pixel, Arial, Helvetica, sans-serif;
    font-size: 0.5rem;
    `