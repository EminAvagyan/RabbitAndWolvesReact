
import variablesObject from "./variables.js"

function getPossibleMoves([x, y]) {
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ]
}

function correctMoves(cordsArray, gameArray) {
  return cordsArray.map(([x, y]) => teleport([x, y], gameArray))
}

function teleport([x, y], gameArray) {
  const maxValue = gameArray.length
  x = (x + maxValue) % maxValue
  y = (y + maxValue) % maxValue
  return [x, y]
}

function checkDirAndMove(newCords, napCords, gameState) {
  const [j, k] = newCords
  const [x, y] = napCords

const currentState = gameState
const gameArray = currentState.gameArray

  if (currentState.gameArray[j][k] === variablesObject.EMPTY_CELL) {
    currentState.gameArray[j][k] = variablesObject.RABBIT
    currentState.gameArray[x][y] = variablesObject.EMPTY_CELL
    return currentState

  } else if (gameArray[j][k] === variablesObject.HOUSE) {
    currentState.gameRunning = false
    currentState.gameStatus = "You win"
    return currentState
  } else if (gameArray[j][k] === variablesObject.FENCE) {
    return currentState
  } else if (gameArray[j][k] === variablesObject.WOLF) {
    currentState.gameRunning = false
    currentState.gameStatus = "You lose"
    return currentState
  }
}

function moveRabbit(gameState, direction) {
  const rabbitCords = findCharacterCords(
    gameState.gameArray,
    variablesObject.RABBIT
  )[0]
  const rabbitPossibleMoves = getPossibleMoves(rabbitCords)
  const rabbitLegalMoves = correctMoves(
    rabbitPossibleMoves,
    gameState.gameArray
  )
  return checkDirAndMove(rabbitLegalMoves[direction], rabbitCords, gameState)
}

function findCharacterCords(gameArray, character) {
  const findInMatrix = function (accumulator, row, x) {
    row.forEach((element, y) => {
      if (element === character) {
        accumulator.push([x, y])
      }
    })
    return accumulator
  }
  return gameArray.reduce(findInMatrix, [])
}

export default moveRabbit
