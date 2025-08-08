import type { TextType } from "@/interfaces"
import { BitmapText } from "pixi.js"
import { useApp } from "@/composables/useApp"
import { useScore } from "@/composables/useScore"


export const useLevel = () => {
  const config = useAppConfig()
  const { scoreText } = useScore()
  const { appObj } = useApp()
  const levelText = useState<TextType>('level', () =>  ({
    textObj: new BitmapText({
      text: "level: 0",
      style: config.textStyle,
      x: config.text.x,
      y: config.text.scoreY,
    }),
    textValue: 0
  }))

  const resetLevel = () => {
    levelText.value.textValue = 0
    levelText.value.textObj.text = "level: 0"
  }

  const initLevel = () => {
    appObj.value.app.stage.addChild(levelText.value.textObj as BitmapText)
    resetLevel()
  }

  const updateLevel = () => {
    levelText.value.textValue = Math.min(
      config.score.maxLevel,
      1 + Math.floor(scoreText.value!.textValue/config.score.jewelPerLevel)
    )
    levelText.value.textObj.text = `level: ${levelText.value.textValue}`
  }

  return {
    levelText,
    resetLevel,
    initLevel,
    updateLevel,
  }
}
