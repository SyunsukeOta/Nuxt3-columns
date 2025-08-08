import type { TimerType } from "@/interfaces"


export const useTimer = () => {
  const config = useAppConfig()
  const timer = useState<TimerType>('timer', () => ({
    startTime: null,
    previousTime: null,
  }))
  const initTimer = (timestamp: DOMHighResTimeStamp) => {
    timer.value.startTime = timestamp
  }
  const updateTimer = (timestamp: DOMHighResTimeStamp) => {
    timer.value.previousTime = timestamp
  }

  return {
    timer,
    initTimer,
    updateTimer,
  }
}
