import type { AppType } from "@/interfaces"
import { Application } from "pixi.js"

const config = useAppConfig()

export const useApp = () => {
  const app = useState<AppType>('app', () => ({
    app: new Application(),
    pixiContainer: null,
    canvas: document.createElement('canvas')
  }))

  const setCanvas = () => {
    app.value.pixiContainer?.appendChild(app.value.canvas)
  }

  const initApp = () => {
    app.value.app.init({
      view: app.value.canvas,
      width: config.app.x,
      height: config.app.y,
      backgroundColor: 0x000000,
    })
    app.value.app.stage.interactive = true
  }

  return {
    app,
    setCanvas,
    initApp,
  }
}