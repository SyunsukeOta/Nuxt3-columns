import type { TextType } from "@/interfaces"
import { BitmapText } from "pixi.js"

const config = useAppConfig()

export const useScore = () => {
  const scoreText = useState<TextType>('score', () => ({
    textObj: new BitmapText({
      text: "score: 0",
      style: config.textStyle,
      x: config.text.x,
      y: config.text.scoreY,
    }),
    textValue: 0
  }))

  const initScore = () => {
    // app.value?.stage.addChild(scoreText.value.textObj as BitmapText)
    scoreText.value.textValue = 0
    scoreText.value.textObj.text = "score: 0"
  }

  const updateScore = (score: number) => {
    scoreText.value.textValue += score
    scoreText.value.textObj.text = `score: ${scoreText.value.textValue}`
  }

  return {
    scoreText,
    initScore,
    updateScore,
  }
}
