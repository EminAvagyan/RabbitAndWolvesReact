import React from "react"
import ReactDOM from "react-dom/client"
import { useState } from "react"
import "./index.css"
import GamebordAndButtons from "./createGameBoardAndButtons.js"
import { Button } from "./createButtons.js"

let count = 0

function App() {
  count++
  const [gameBoardNumber, setGameBoardNumber] = useState([])
  function handleClick() {
    setGameBoardNumber([...gameBoardNumber, count])
  }
  
  return (
    <div className={"wrapper"}>
      {gameBoardNumber.map((number) => {
        return <GamebordAndButtons key={number}/>
      })}
      <Button onClick={handleClick} text={"New board"} />
    </div>
  )
}
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App />)
