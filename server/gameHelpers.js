module.exports = {
  createStage : (height, width) => {
        return Array.from(Array(height), () => //make an array of height many arrays, made by calling the provided callback
        new Array(width).fill([0, 'clear']), //make a new array of width many arrays, filled with 2 items: 0 and 'clear'
      )
    }
}
