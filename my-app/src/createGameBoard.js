import React from "react"
import Image from "./createImageTag.js"

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

export { GameBoard, GameOverMessage }
