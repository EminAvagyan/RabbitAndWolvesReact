
import moveRabbit from "./moveRabbitOnClick.js"
import changeWolvesPositions from "./cahngeCharacterPositions.js"

function eventKeysFunctions(gameState, direction) {
    const currentGameState = moveRabbit(gameState, direction)
    return changeWolvesPositions(currentGameState)
}

export default eventKeysFunctions
