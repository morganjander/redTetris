import React from 'react'
import Tetris from './components/Tetris'
import { SocketProvider } from './contexts/SocketProvider'
import {TetrisProvider } from './contexts/TetrisProvider'
import {OpponentProvider} from './contexts/OpponentProvider'
import {PlayerProvider} from './contexts/PlayerProvider'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Join from './components/Join'


const App = () => {
  return (
    <div className="App">
      <SocketProvider>
        <TetrisProvider>
          <PlayerProvider>
            <OpponentProvider>
              <Router>
                <Route path="/" exact component={Join}/>
                <Route path="/play" component={Tetris}/>
              </Router>
            </OpponentProvider>
          </PlayerProvider>
        </TetrisProvider>
      </SocketProvider>
    </div>
  )
}

export default App