import type { JewelType } from "@/interfaces"
import { Graphics } from "pixi.js"
import { useApp } from "@/composables/useApp"

const config = useAppConfig()
const { app } = useApp()

export const useBoardJewels = () => {
  const boardJewels = useState<(JewelType | null)[][]>('boardJewels', () => (
    Array(config.board.cellYLen).fill(null).map(
      () => Array(config.board.cellXLen).fill(null)
    )
  ))

  const consoleAll = (label: string) => {
    let line: string = ""
    boardJewels.value.map(row => {
      row.map(col => {
        if (label == "color") {
          line += col ? col.color : "null"
        } else if (label == "isDelete") {
          line += col ? col.isDelete : "null"
        }else {
          line += "null"
        }
        line += '\t | \t'
      })
      line += "\n"
    })
    console.log(line);
  }

  const deleteAll = (isAllDelete: boolean) => {
    let deleteCount: number = 0
    consoleAll("isDelete")
    boardJewels.value.map((row, yIndex) => {
      row.map((col, xIndex) => {
        if (isAllDelete || col?.isDelete) {
          app.value.app.stage.removeChild(
            boardJewels.value[yIndex][xIndex]?.jewel as Graphics
          )
          boardJewels.value[yIndex][xIndex] = null
          deleteCount++
        }
      })
    })
    consoleAll("isDelete")
    return deleteCount
  }

  return {
    boardJewels,
    consoleAll,
    deleteAll,
  }
}
