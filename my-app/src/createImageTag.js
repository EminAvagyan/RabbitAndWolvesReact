import React from "react"
import variablesObject from "./variables.js"

function Image(props) {
  if (props.character === variablesObject.RABBIT) {
    const imgSrc = variablesObject.GALLERY[variablesObject.RABBIT]
    return <img src={imgSrc} alt = {"rabbit"}/>
  }
  if (props.character === variablesObject.WOLF) {
    const imgSrc = variablesObject.GALLERY[variablesObject.WOLF]
    return <img src={imgSrc} alt = {"wolf"}/>
  }
  if (props.character === variablesObject.FENCE) {
    const imgSrc = variablesObject.GALLERY[variablesObject.FENCE]
    return <img src={imgSrc} alt = {"fence"}/>
  }
  if (props.character === variablesObject.HOUSE) {
    const imgSrc = variablesObject.GALLERY[variablesObject.HOUSE]
    return <img src={imgSrc} alt = {"house"}/>
  }
}

export default Image
