
import variablesObject from "./variables.js"

function createGameArray(gameAreaSize) {
  const gameAreaSizeInt = parseInt(gameAreaSize)
  const gameCondition = new Array(gameAreaSizeInt)
    .fill(variablesObject.EMPTY_CELL)
    .map(() => new Array(gameAreaSizeInt).fill(variablesObject.EMPTY_CELL))
  return insertAllCharacters(gameCondition)
}

function insertAllCharacters(gameArray) {
  const wolvesgameBoardNumber = ((gameArray.length - 1) / 100) * 60
  const fencegameBoardNumber = ((gameArray.length - 1) / 100) * 40
  insertCharactersIntoArray(
    gameArray,
    variablesObject.WOLF,
    wolvesgameBoardNumber
  )
  insertCharactersIntoArray(
    gameArray,
    variablesObject.FENCE,
    fencegameBoardNumber
  )
  insertCharactersIntoArray(gameArray, variablesObject.HOUSE, 1)
  insertCharactersIntoArray(gameArray, variablesObject.RABBIT, 1)
  return gameArray
}

function insertCharactersIntoArray(gameArray, character, gameBoardNumber) {
  for (let i = 0; i < gameBoardNumber; i++) {
    const cords = findEmptyCell(gameArray)
    insertSingleCharacter(cords, gameArray, character)
  }
  return gameArray
}

function insertSingleCharacter(cord, gameArray, character) {
  const x = cord[variablesObject.X]
  const y = cord[variablesObject.Y]
  gameArray[x][y] = character
}

function findEmptyCell(gameArray) {
  const randomX = Math.floor(Math.random() * gameArray.length)
  const randomY = Math.floor(Math.random() * gameArray.length)
  if (gameArray[randomX][randomY] === variablesObject.EMPTY_CELL) {
    return [randomX, randomY]
  } else {
    return findEmptyCell(gameArray)
  }
}

export default createGameArray
