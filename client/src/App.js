import React from 'react'
import Tetris from './components/Tetris'
import { SocketProvider } from './contexts/SocketProvider'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Join from './components/Join'

const App = () => {
  return (
    <div className="App">
      <SocketProvider>
        <Router>
          <Route path="/" exact component={Join}/>
          <Route path="/play" component={Tetris}/>
        </Router>
      </SocketProvider>
    </div>
  )
}

export default App