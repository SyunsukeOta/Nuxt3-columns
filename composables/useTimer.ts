import type { TimerType } from "@/interfaces"

const config = useAppConfig()

export const useTimer = () => {
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
