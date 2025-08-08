import type { TextType } from "@/interfaces"
import { BitmapText } from "pixi.js"
import { useApp } from "@/composables/useApp"


export const useScore = () => {
  const config = useAppConfig()
  const { appObj } = useApp()
  const scoreText = useState<TextType>('score', () => ({
    textObj: new BitmapText({
      text: "score: 0",
      style: config.textStyle,
      x: config.text.x,
      y: config.text.scoreY,
    }),
    textValue: 0
  }))

  const resetScore = () => {
    scoreText.value.textValue = 0
    scoreText.value.textObj.text = "score: 0"
  }

  const initScore = () => {
    appObj.value.app.stage.addChild(scoreText.value.textObj as BitmapText)
    resetScore()
  }

  const updateScore = (score: number) => {
    scoreText.value.textValue += score
    scoreText.value.textObj.text = `score: ${scoreText.value.textValue}`
  }

  return {
    scoreText,
    resetScore,
    initScore,
    updateScore,
  }
}
