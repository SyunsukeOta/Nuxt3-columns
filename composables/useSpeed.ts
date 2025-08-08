import type { TextType } from "@/interfaces"
import { BitmapText } from "pixi.js"
import { useLevel } from "@/composables/useLevel"
import { useApp } from "@/composables/useApp"


export const useSpeed = () => {
  const config = useAppConfig()
  const { levelText } = useLevel()
  const { appObj } = useApp()
  const speedText = useState<TextType>('speed', () =>  ({
    textObj: new BitmapText({
      text: "speed: 0",
      style: config.textStyle,
      x: config.text.x,
      y: config.text.scoreY,
    }),
    textValue: 0
  }))

  const resetSpeed = () => {
    speedText.value.textValue = 0
    speedText.value.textObj.text = "speed: 0"
  }

  const initSpeed = () => {
    appObj.value.app.stage.addChild(speedText.value.textObj as BitmapText)
    resetSpeed()
  }

  const updateSpeed = () => {
    speedText.value.textValue = Math.min(
      config.score.maxSpeed,
      1 + Math.floor(levelText.value!.textValue/config.score.levelsPerSpeedUp)
    )
    speedText.value.textObj.text = `speed: ${speedText.value.textValue}`
  }

  return {
    speedText,
    resetSpeed,
    initSpeed,
    updateSpeed,
  }
}
