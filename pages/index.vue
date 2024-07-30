<script setup lang="ts">
import { Application, Graphics } from "pixi.js"
import type { JewelType } from "@/interfaces"
import { jewelList } from "@/jewelData"

const pixiContainer = ref<HTMLDivElement | null>(null)

const jewelSize = ref(100)
const jewelMax = ref(3)
const jewelTop = ref(50)
const jewelLeft = ref(50)

const makeJewel = (app: Application, drawLeft: Ref<number>, drawTop: Ref<number>, jewelIndex: number) => {
	const jewelColor = jewelList[Math.floor(Math.random()*jewelList.length)]
	const jewel = new Graphics()
		.rect(0, 0, jewelSize.value, jewelSize.value)
		.fill(jewelColor.color)

	app.stage.addChild(jewel)

	jewel.x = drawLeft.value
	jewel.y = drawTop.value + jewelIndex*jewelSize.value
}

onMounted(async () => {
	if (pixiContainer.value) {
		const canvas = document.createElement('canvas');
		pixiContainer.value.appendChild(canvas);
		try {
			const app = new Application();
			await app.init({
				view: canvas,
				width: 800,
				height: 600,
				backgroundColor: 0x000000,
			})
			app.stage.interactive = true

			// jewel
			for (let i = 0; i < jewelMax.value; i++) {
				makeJewel(app, jewelTop, jewelLeft, i)
			}

		} catch (error) {
			console.error("Error initializing PixiJS:", error);
		}
	}
});



</script>

<template>
	<div ref="pixiContainer" class="pixi-container"></div>
</template>