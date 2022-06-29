import React from "react"
import { useState } from "react"
import variablesObject from "./variables.js"
import { GameBoard, GameOverMessage } from "./createGameBoard.js"
import eventKeysFunctions from "./characterMovesOnClick.js"
import { ArrowButtons } from "./createButtons.js"
import createGameArray from "./createGameArray.js"

const GamebordAndButtons = () => {
  const optionsArray = [5, 7, 10]
  const [value, setValue] = useState(optionsArray[0])
  const [gameState, setGameState] = useState({
    gameArray: [],
    gameRunning: true,
    gameStatus: "",
  })

  const handleChange = (event) => setValue(event.target.value)

  function handleClick() {
    setGameState({
      gameArray: createGameArray(value),
      gameRunning: true,
      gameStatus: "",
    })
  }

  function handleClickDirections(direction) {
    if (gameState.gameRunning === false) {
      return
    }
    const newGameState = eventKeysFunctions(gameState, direction)
    setGameState(newGameState)
  }

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
      {gameState.gameRunning === false ? (
        <GameOverMessage message={gameState.gameStatus} />
      ) : (
        <GameBoard array={gameState.gameArray} />
      )}
      <div className="game_buttons">
        <div className="up_button">
          <ArrowButtons
            className={"up"}
            onClick={() => {
              handleClickDirections(variablesObject.UP)
            }}
          />
        </div>
        <div className="side_buttons">
          <ArrowButtons
            className={"left"}
            onClick={() => {
              handleClickDirections(variablesObject.LEFT)
            }}
          />
          <ArrowButtons
            className={"right"}
            onClick={() => {
              handleClickDirections(variablesObject.RIGHT)
            }}
          />
        </div>
        <div className="down_button">
          <ArrowButtons
            className={"down"}
            onClick={() => {
              handleClickDirections(variablesObject.DOWN)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default GamebordAndButtons
