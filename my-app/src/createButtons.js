import React from "react"

const ArrowButtons = (props) => {
  return <div className={props.className} onClick={props.onClick}></div>
}

const Button = (props) => {
  return (
    <button className={"create_game_button"} onClick={props.onClick}>
      {props.text}
    </button>
  )
}

export { Button }
export { ArrowButtons }
