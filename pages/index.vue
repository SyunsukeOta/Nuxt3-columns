<script setup lang="ts">
import { Application, Graphics } from "pixi.js"
import type { JewelType, BlockType } from "@/interfaces"
import { jewelList } from "@/jewelData"

const pixiContainer = ref<HTMLDivElement | null>(null)

const jewelSize = ref(100)
const jewelMax = ref(3)
const jewelTop = ref(50)
const jewelLeft = ref(50)

const block = ref<BlockType[]>([])

const handleClick = () => {
	rotateBlock(block.value as BlockType[])
	console.log("-----");
	consoleBlock(block.value as BlockType[])
}

const makeJewel = (app: Application, drawLeft: Ref<number>, drawTop: Ref<number>, jewelIndex: number): BlockType => {
	const jewelColor = jewelList[Math.floor(Math.random()*jewelList.length)]
	const jewel: Graphics = new Graphics()
		.rect(0, 0, jewelSize.value, jewelSize.value)
		.fill(jewelColor.color)

	app.stage.addChild(jewel)

	jewel.x = drawLeft.value
	jewel.y = drawTop.value + jewelIndex*jewelSize.value
	console.log(jewelColor);
	
	return { jewel, jewelColor }
}

const rotateBlock = (block: BlockType[]) => {
	let tailJewel = block.pop()
	if (tailJewel != undefined) {
		block.unshift(tailJewel)
	}
	for (const [index, jewel] of block.entries()) {
		jewel.jewel.y = jewelTop.value + index*jewelSize.value
	}
}

const consoleBlock = (block: BlockType[]) => {
	if (block.length) {
		for (const [index, jewel] of block.entries()) {
			console.log(`index: ${index}, jewelColor: ${jewel.jewelColor.name}`);
		}
	}
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
			block.value = []
			for (let i = 0; i < jewelMax.value; i++) {
				block.value.push(makeJewel(app, jewelTop, jewelLeft, i))
			}
			console.log("-----");
			consoleBlock(block.value as BlockType[])

		} catch (error) {
			console.error("Error initializing PixiJS:", error);
		}
	}
});



</script>

<template>
	<div ref="pixiContainer" class="pixi-container" @click="handleClick"></div>
</template>