import type { TextType } from "@/interfaces"
import { BitmapText } from "pixi.js"
import { useScore } from "@/composables/useScore"

const config = useAppConfig()
const { scoreText } = useScore()

export const useLevel = () => {
  const levelText = useState<TextType>('level', () =>  ({
    textObj: new BitmapText({
      text: "level: 0",
      style: config.textStyle,
      x: config.text.x,
      y: config.text.scoreY,
    }),
    textValue: 0
  }))

  const initLevel = () => {
    // app.value?.stage.addChild(levelText.value.textObj as BitmapText)
    levelText.value.textValue = 0
    levelText.value.textObj.text = "level: 0"
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
    initLevel,
    updateLevel,
  }
}
