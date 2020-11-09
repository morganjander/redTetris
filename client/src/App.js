import React from 'react'
import Tetris from './components/Tetris'
import { SocketProvider } from './contexts/SocketProvider'

const App = () => {
  return (
    <div className="App">
      <SocketProvider>
          <Tetris />
      </SocketProvider>
    </div>
  )
}

export default App