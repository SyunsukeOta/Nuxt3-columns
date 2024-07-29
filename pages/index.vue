<script setup lang="ts">
import { Application, Graphics } from "pixi.js"

const pixiContainer = ref<HTMLDivElement | null>(null)

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
				backgroundColor: 0x1099bb,
			})
			
			const graphcs = new Graphics()
				.rect(50, 50, 100, 100)
				.fill(0xFF0000)
		
			app.stage.addChild(graphcs)
		} catch (error) {
			console.error("Error initializing PixiJS:", error);
		}
	}
});



</script>

<template>
	<div ref="pixiContainer" class="pixi-container"></div>
</template>