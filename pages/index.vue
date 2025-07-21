<script setup lang="ts">
import { Application, Graphics } from "pixi.js"
// import type { JewelType, BlockType } from "@/interfaces"
// import { jewelList } from "@/jewelData"

import { colorMap } from "@/jewelData"

const config = useAppConfig();
const pixiContainer = ref<HTMLDivElement | null>(null)
const app = ref<Application| null>()


const handleClick = () => {
	console.log("-----");
}


const keyAction = (event: KeyboardEvent) => {
	if (event.key.startsWith('Arrow')) {
		event.preventDefault()
		switch (event.key) {
			case 'ArrowLeft':
				break;
			case 'ArrowRight':
				break;
			case 'ArrowDown':
				break;
			default:
				break;
		}
	}
	console.log(event.key);
	if (event.key == ' ') {
		event.preventDefault()
		console.log("-----");
	}
}

onMounted(async () => {
	if (pixiContainer.value) {
		window.addEventListener('keydown', keyAction)
		const canvas = document.createElement('canvas');
		pixiContainer.value.appendChild(canvas);
		try {
			app.value = new Application();
			await app.value.init({
				view: canvas,
				width: 800,
				height: 600,
				backgroundColor: 0x000000,
			})
			app.value.stage.interactive = true

			// stage

			// block

		} catch (error) {
			console.error("Error initializing PixiJS:", error);
		}
	}
});

onBeforeUnmount(() => {
	window.removeEventListener('keydown', keyAction)
})

</script>

<template>
	<div ref="pixiContainer" class="pixi-container" @click="handleClick"></div>
</template>