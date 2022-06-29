
import variablesObject from "./variables.js"

function changeWolvesPositions(gameState) {
let currentGameState = {...gameState}
  const wolvesCords = findCharacterCords(
    currentGameState.gameArray,
    variablesObject.WOLF
  )
  wolvesCords.forEach((wolf) => {
    if (
      currentGameState.gameRunning === false
    ) {
      return
    }
    currentGameState = changeSingleWolfPosition(gameState, wolf)
  })
  return currentGameState
}

function changeSingleWolfPosition(gameState, wolf) {
  let currentGameState = {...gameState}
  const rabbitCords = findCharacterCords(
    currentGameState.gameArray,
    variablesObject.RABBIT
  )
  const cellsArround = getWovesLegalMoves(currentGameState.gameArray, wolf)
  const freeCells = rabbitOrEmptyCells(cellsArround, currentGameState)
  if (freeCells.gameArray) {
    return freeCells
  } else{
    if(freeCells.length === 0 ){
      return currentGameState
    }
    const distanceArray = calculateDistanceOfCells(freeCells, rabbitCords)
    const closestCell = freeCells[getClosestIndex(distanceArray)]
    currentGameState = placeWolvesIntoNewCells(currentGameState, closestCell, wolf)
    
    return currentGameState
  }
  
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

const equals = (firstArray, secondArray) =>
  JSON.stringify(firstArray) === JSON.stringify(secondArray)

function getWovesLegalMoves(gameArray, [x, y]) {
  let movementDirections = [
    [x, y],
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ]
  return movementDirections.filter(isInRange(gameArray))
}

const isInRange =
  (gameArray) =>
  ([x, y]) =>
    x >= 0 && x < gameArray.length && y >= 0 && y < gameArray.length

function findEmptyCells(gameArray, cellsArround) {
  return findCharacter(gameArray, cellsArround, variablesObject.EMPTY_CELL)
}

function rabbitOrEmptyCells(cellsArround, gameState) {
  const currentGameState = gameState
  const checkIFRabbit = findRabbit(gameState.gameArray, cellsArround)
  if (checkIFRabbit) {
    currentGameState.gameRunning = false
    currentGameState.gameStatus = "You lose"
    return currentGameState
  } else {
    return findEmptyCells(currentGameState.gameArray, cellsArround)
  }
}

function findRabbit(gameArray, cellsArround) {
  const rabbitCoords = findCharacter(
    gameArray,
    cellsArround,
    variablesObject.RABBIT
  )
  return rabbitCoords.length > 0
}

function calculateDistanceOfCells(freeVellsArray, rabbitCords) {
  return freeVellsArray.map((cord) =>
    calculateDistanceFromRabbit(cord, rabbitCords)
  )
}

function getClosestIndex(distanceArray) {
  const max = Math.min(...distanceArray)
  return distanceArray.indexOf(max)
}

function placeWolvesIntoNewCells(gameState, wolvesCords, item) {
  const rabbitCords = findCharacterCords(gameState.gameArray, variablesObject.RABBIT)
  const [x, y] = wolvesCords
  const [k, p] = item
  if (equals([x, y], rabbitCords)) {
    gameState.gameRunning = false
    gameState.gameStatus = "You lose"
    return gameState
  } else {
    gameState.gameArray[x][y] = variablesObject.WOLF
    gameState.gameArray[k][p] = variablesObject.EMPTY_CELL
    return gameState
  }
  
}

function findCharacter(gameArray, cellsArround, character) {
  return cellsArround.filter(([x, y]) => gameArray[x][y] === character)
}

function calculateDistanceFromRabbit([x1, y1], [[x2, y2]]) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

export default changeWolvesPositions
