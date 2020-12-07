
export const useGame = (setStart, resetTetro, setGameOver, setDropTime, setGamePaused, setWinner) => {

    const startGame = () => {
      setDropTime(700)
      resetTetro(0)
      setGameOver(false);
      setStart(true)
    }

    const pauseGame = () => {
        setDropTime(prev => prev === null ? 700 : null)
        setGamePaused(prev => !prev)
    }

    const endGame = (name) => {
      setDropTime(null)
      setWinner(name)
    }

    return [startGame, pauseGame, endGame]
}