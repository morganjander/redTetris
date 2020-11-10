import React, { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { StyledDisplay } from './styles/StyledDisplay';

const Display = ({ gameOver, text }) => {
  const socket = useSocket()
  const [message, setMessage] = useState('')

  const receiveMessage = (data) => {
    setMessage(data)    
  }

  useEffect(() => {
    if (socket == null) return
    socket.on('recieve-message', (data) => receiveMessage(data))
  }, [socket])
 
  return (
    <StyledDisplay gameOver={gameOver}>{text}</StyledDisplay>
  )
}

export default Display;