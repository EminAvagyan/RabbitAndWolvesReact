import React, { Component } from "react"
import ReactDOM from "react-dom/client"
import { useState } from "react"
import "./index.css"

const EMPTY_CELL = 0
const WOLF = 1
const FENCE = 2
const HOUSE = 3
const RABBIT = 4
const X = 0
const Y = 1

const up = 0
const down = 1
const left = 2
const right = 3

const GAME_STATE_OBJECTS = {
}

const gallery = new Array()
gallery[1] = "images/gamewolf.png"
gallery[2] = "images/ban.png"
gallery[3] = "images/home.png"
gallery[4] = "images/rabbit.png"

function createGameArray(gameAreaSize) {
  const gameAreaSizeInt = parseInt(gameAreaSize)
  const gameCondition = new Array(gameAreaSizeInt)
    .fill(0)
    .map(() => new Array(gameAreaSizeInt).fill(0))
  return insertAllCharacters(gameCondition)
}

function insertAllCharacters(gameArray) {
  const wolvesgameBoardNumber = ((gameArray.length - 1) / 100) * 60
  const fencegameBoardNumber = ((gameArray.length - 1) / 100) * 40
  insertCharactersIntoArray(gameArray, WOLF, wolvesgameBoardNumber)
  insertCharactersIntoArray(gameArray, FENCE, fencegameBoardNumber)
  insertCharactersIntoArray(gameArray, HOUSE, 1)
  insertCharactersIntoArray(gameArray, RABBIT, 1)
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
  const x = cord[X]
  const y = cord[Y]
  gameArray[x][y] = character
}

function findEmptyCell(gameArray) {
  const randomX = Math.floor(Math.random() * gameArray.length)
  const randomY = Math.floor(Math.random() * gameArray.length)
  if (gameArray[randomX][randomY] === EMPTY_CELL) {
    return [randomX, randomY]
  } else {
    return findEmptyCell(gameArray)
  }
}

function eventKeysFunctions(gameState, direction) {
  if (GAME_STATE_OBJECTS[gameState.gameBoardNumber].gameRunning === false) {
    return
  } else {
    const rabbitCords = findCharacterCords(gameState.gameArray, RABBIT)[0]
    const rabbitPossibleMoves = getPossibleMoves(rabbitCords)
    const rabbitLegalMoves = correctMoves(rabbitPossibleMoves, gameState.gameArray)
    checkDirAndMove(rabbitLegalMoves[direction], rabbitCords, gameState)
    changeWolvesPositions(gameState.gameArray)
    return gameState.gameArray
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
  const gameArray = gameState.gameArray
  
  if (gameArray[j][k] == EMPTY_CELL) {
    gameArray[j][k] = RABBIT
    gameArray[x][y] = EMPTY_CELL
  } else if (gameArray[j][k] === HOUSE) {
    GAME_STATE_OBJECTS[gameState.gameBoardNumber].gameRunning = false
    GAME_STATE_OBJECTS[gameState.gameBoardNumber].gameStatus = "You wine"
    return
  } else if (gameArray[j][k] === FENCE) {
    return
  } else if (gameArray[j][k] === WOLF) {
    GAME_STATE_OBJECTS[gameState.gameBoardNumber].gameRunning = false
    GAME_STATE_OBJECTS[gameState.gameBoardNumber].gameStatus = "You lose"
    console.log(GAME_STATE_OBJECTS[gameState.gameBoardNumber])
    return
  }
}

function changeWolvesPositions(gameArray) {
  const wolvesCords = findCharacterCords(gameArray, WOLF)
  wolvesCords.forEach((wolf) => {
    changeSingleWolfPosition(gameArray, wolf)
  })
}

function changeSingleWolfPosition(gameArray, wolf) {
  const rabbitCords = findCharacterCords(gameArray, RABBIT)
  const cellsArround = getWovesLegalMoves(gameArray, wolf)
  const freeCells = rabbitOrEmptyCells(cellsArround, gameArray)
  if (!freeCells) {
    return
  }
  const distanceArray = calculateDistanceOfCells(freeCells, rabbitCords)
  const closestCell = freeCells[getClosestIndex(distanceArray)]
  placeWolvesIntoNewCells(gameArray, closestCell, wolf)
}

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
  return findCharacter(gameArray, cellsArround, EMPTY_CELL)
}

function rabbitOrEmptyCells(cellsArround, gameArray) {
  const checkIFRabbit = findRabbit(gameArray, cellsArround)
  if (checkIFRabbit) {
    return false
  } else {
    return findEmptyCells(gameArray, cellsArround)
  }
}

function findRabbit(gameArray, cellsArround) {
  const rabbitCoords = findCharacter(gameArray, cellsArround, RABBIT)
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

function placeWolvesIntoNewCells(gameArray, wolvesCords, item) {
  const rabbitCords = findCharacterCords(gameArray, RABBIT)
  const [x, y] = wolvesCords
  const [k, p] = item
  if (equals([x, y], rabbitCords)) {
    return
  } else {
    gameArray[x][y] = WOLF
    gameArray[k][p] = EMPTY_CELL
  }
}

function findCharacter(gameArray, cellsArround, character) {
  return cellsArround.filter(([x, y]) => gameArray[x][y] === character)
}

function calculateDistanceFromRabbit([x1, y1], [[x2, y2]]) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

const equals = (firstArray, secondArray) =>
  JSON.stringify(firstArray) === JSON.stringify(secondArray)

function Image(props) {
  if (props.character === RABBIT) {
    const imgSrc = gallery[RABBIT]
    return <img src={imgSrc} />
  }
  if (props.character === WOLF) {
    const imgSrc = gallery[WOLF]
    return <img src={imgSrc} />
  }
  if (props.character === FENCE) {
    const imgSrc = gallery[FENCE]
    return <img src={imgSrc} />
  }
  if (props.character === HOUSE) {
    const imgSrc = gallery[HOUSE]
    return <img src={imgSrc} />
  }
}

const ArrowButtons = (props) => {
  return <div className={props.className} onClick={props.onClick}></div>
}

const GameOverMessage = (props) => {
  return (
    <div className={"message_div"}>
      <p>{props.message}</p>
    </div>
  )
}

const GameBoard = (props) => {
  const gameArray = props.array
  const width = gameArray.length * 60 + 20 + "px"

  return (
    <div
      className="game_area"
      style={width === "20px" ? { width: "320px" } : { width: width }}
    >
      {gameArray.map((row, x) => {
        return row.map((column, y) => {
          return (
            <div className="square" key={x.toString() + y.toString()}>
              <Image character={column} />
            </div>
          )
        })
      })}
    </div>
  )
}

const Select = (props) => {
  const optionsArray = [5, 7, 10]
console.log(props.gameBoardNumber)
  const [value, setValue] = useState(optionsArray[0])
  const [gameArray, setGameArray] = useState([])

  function handleChange(event) {
    setValue(event.target.value)
  }

  function handleClick() {
    setGameArray(createGameArray(value))
  }
  const gameState = {
    gameArray,
    gameRunning: true,
    gameStatus: '',
    gameBoardNumber: props.gameBoardNumber
  }
  GAME_STATE_OBJECTS[props.gameBoardNumber] = gameState
  function handleClickUp() {
    setGameArray([...eventKeysFunctions(gameState, up)])
  }
  function handleClickLeft() {
    setGameArray([...eventKeysFunctions(gameState, left)])
  }
  function handleClickRight() {
    setGameArray([...eventKeysFunctions(gameState, right)])
  }
  function handleClickDown() {
    setGameArray([...eventKeysFunctions(gameState, down)])
  }
console.log(GAME_STATE_OBJECTS[props.gameBoardNumber])
  return (
    <div className="single_game_wrapper">
      <div className={"game_size_buttons"}>
        <button onClick={handleClick}>Start the game</button>
        <select onChange={handleChange}>
          {optionsArray.map((option) => {
            return (
              <option key={option} value={option}>
                {option}X{option}
              </option>
            )
          })}
        </select>
      </div>
      {GAME_STATE_OBJECTS[gameState.gameBoardNumber].gameRunning === false ? (
        <GameOverMessage message={GAME_STATE_OBJECTS[props.gameBoardNumber].gameStatus} />
      ) : (
        <GameBoard array={gameState.gameArray} />
      )}
      <div className="game_buttons">
        <div className="up_button">
          <ArrowButtons className={"up"} onClick={handleClickUp} />
        </div>
        <div className="side_buttons">
          <ArrowButtons className={"left"} onClick={handleClickLeft} />
          <ArrowButtons className={"right"} onClick={handleClickRight} />
        </div>
        <div className="down_button">
          <ArrowButtons className={"down"} onClick={handleClickDown} />
        </div>
      </div>
    </div>
  )
}

const Button = (props) => {
  return (
    <button className={"create_game_button"} onClick={props.onClick}>
      {props.text}
    </button>
  )
}

function App() {
  const [gameBoardNumber, setGameBoardNumber] = useState([0])
  const [gameBoard, setGameBoard] = useState([])
  function handleClick() {
    setGameBoard([...gameBoard, gameBoard+1])
    setGameBoardNumber([parseInt(gameBoardNumber)+1])
  }
  return (
    <div className={"wrapper"}>
      {gameBoard.map((item) => {
        return <Select key={item} gameBoardNumber = {gameBoardNumber}/>
      })}
      <Button onClick={handleClick} text={"New board"} />
    </div>
  )
}
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App />)
