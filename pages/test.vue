<script setup lang="ts">
import { Application, Graphics, BitmapText } from "pixi.js"
import type { JewelType, TextType } from "@/interfaces"
import { colorMap } from "@/jewelData"

// settings
// const config = useAppConfig();
// const pixiContainer = ref<HTMLDivElement | null>(null)
const app = ref<Application | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

const createApp = async (view: HTMLCanvasElement) => {
  const app = new Application()
  app.init({
    view,
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
  })
  return app
}


onMounted(async () => {
  if (!canvas.value) return
  app.value = await createApp(canvas.value)

  
})

// onBeforeUnmount(() => {
// 	// window.removeEventListener('keydown', keyAction)
// })

</script>

<template>
  <canvas class="canvas" ref="canvas"></canvas>
</template>