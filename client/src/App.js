import React from 'react'
import Tetris from './components/Tetris'
import { SocketProvider } from './contexts/SocketProvider'
import {TetrisProvider } from './contexts/TetrisProvider'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Join from './components/Join'

const App = () => {
  return (
    <div className="App">
      <SocketProvider>
        <TetrisProvider>
          <Router>
            <Route path="/" exact component={Join}/>
            <Route path="/play" component={Tetris}/>
          </Router>
        </TetrisProvider>
      </SocketProvider>
    </div>
  )
}

export default App