import type { JewelType } from "@/interfaces"
import { colorMap } from "@/jewelData"
import { useApp } from "@/composables/useApp" 
import { Graphics } from "pixi.js"

const config = useAppConfig()
const { app } = useApp()

export const useBlock = () => {
  const activeBlock = useState<JewelType[]>('activeBlock', () => (
    Array(config.jewel.length).fill(null)
  ))

  const initBlock = () => {
    for (let i = 0; i < config.jewel.length; i++) {
      const color: string = Array.from(colorMap.keys())[Math.floor(Math.random()*colorMap.size)]
      const jewelData: JewelType = {
        jewel: new Graphics()
          .rect(0, 0, config.jewel.size, config.jewel.size)
          .fill(color),
        color: color,
        isDelete: false,
        xId: config.block.startXId,
        yId: config.block.startYId + i,
      }
      setBlockPos(jewelData.xId, jewelData.yId, jewelData.jewel as Graphics)
      app.value.app.stage.addChild(jewelData.jewel as Graphics)
      activeBlock.value[i] = jewelData
    }
  }

  const setBlockPos = (xId: number, yId: number, jewel: Graphics) => {
    jewel.x = config.jewel.left + xId * config.jewel.size
    jewel.y = config.jewel.top + yId * config.jewel.size
  }

  return {
    activeBlock,
    initBlock,
  }
}