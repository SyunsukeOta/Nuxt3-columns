import { Graphics } from "pixi.js"
import { useApp } from "@/composables/useApp" 


export const useBoard = () => {
  const config = useAppConfig()
  const { appObj } = useApp()
  const board = useState<Graphics>('board', () => (
    new Graphics()
      .rect(0, 0, config.board.cellXLen * config.jewel.size, config.board.cellYLen * config.jewel.size)
      .fill(config.board.color)
  ))

  const initBoard = () => {
    appObj.value.app.stage.addChild(board.value)
    board.value.x = config.jewel.left
    board.value.y = config.jewel.top
  }

  return {
    board,
    initBoard,
  }
}
