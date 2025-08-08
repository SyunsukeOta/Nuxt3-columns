import type { AppType } from "@/interfaces"
import { Application, type ICanvas } from "pixi.js"


export const useApp = () => {
  const config = useAppConfig()

  const appObj = useState<AppType>('app', () => ({
    app: new Application(),
  }))


  const initApp = async (view: HTMLCanvasElement) => {
    appObj.value.app.init({
      view,
      width: config.app.x,
      height: config.app.y,
      backgroundColor: 0x000000,
    })
    appObj.value.app.stage.interactive = true
  }

  return {
    appObj,
    initApp,
  }
}