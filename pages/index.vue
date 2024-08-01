<script setup lang="ts">
import { Application, Graphics } from "pixi.js"
import type { JewelType, BlockType } from "@/interfaces"
import { jewelList } from "@/jewelData"

const pixiContainer = ref<HTMLDivElement | null>(null)

const jewelSize = ref(20)
const jewelMax = ref(3)
const jewelTop = ref(50)
const jewelLeft = ref(50)
const boardCellHeight = ref(13)
const boardCellWidth = ref(6)
const startTopId = ref(0)
const startLeftId = ref(2)
const boardColor = ref(0x999999)

const block = ref<BlockType[]>([])
const blockTopId = ref(startTopId.value)
const blockLeftId = ref(startLeftId.value)

const handleClick = () => {
	rotateBlock()
	console.log("-----");
	consoleBlock()
}

const makeJewel = (app: Application, jewelIndex: number): BlockType => {
	const jewelColor = jewelList[Math.floor(Math.random()*jewelList.length)]
	const jewel: Graphics = new Graphics()
		.rect(0, 0, jewelSize.value, jewelSize.value)
		.fill(jewelColor.color)

	app.stage.addChild(jewel)

	jewel.x = jewelLeft.value + startLeftId.value*jewelSize.value
	jewel.y = jewelTop.value + (startTopId.value + jewelIndex)*jewelSize.value
	console.log(jewelColor);
	
	return { jewel, jewelColor }
}

const setPlace = () => {
	for (const [index, jewel] of block.value.entries()) {
		jewel.jewel.x = jewelLeft.value + blockLeftId.value*jewelSize.value
		jewel.jewel.y = jewelTop.value + (blockTopId.value + index)*jewelSize.value
	}
}

const rotateBlock = () => {
	let tailJewel = block.value.pop()
	if (tailJewel != undefined) {
		block.value.unshift(tailJewel)
	}
	setPlace()
}

const consoleBlock = () => {
	if (block.value.length) {
		for (const [index, jewel] of block.value.entries()) {
			console.log(`index: ${index}, jewelColor: ${jewel.jewelColor.name}`);
		}
	}
}

const moveLeft = () => {
	if (blockLeftId.value > 0) {
		console.log('Left OK');
		blockLeftId.value--
		setPlace()
	}
}

const moveRight = () => {
	if (blockLeftId.value < boardCellWidth.value - 1) {
		console.log(('Right OK'));
		blockLeftId.value++
		setPlace()
	}
}

const moveDown = () => {
	if (blockTopId.value < boardCellHeight.value - jewelMax.value) {
		console.log('Down OK');
		blockTopId.value++
		setPlace()
	}
}

const keyAction = (event: KeyboardEvent) => {
	if (event.key.startsWith('Arrow')) {
		event.preventDefault()
		switch (event.key) {
			case 'ArrowLeft':
				moveLeft()
				break;
			case 'ArrowRight':
				moveRight()
				break;
			case 'ArrowDown':
				moveDown()
				break;
			default:
				break;
		}
	}
	console.log(event.key);
	if (event.key == ' ') {
		event.preventDefault()
		rotateBlock()
		console.log("-----");
		consoleBlock()
	}
}

onMounted(async () => {
	if (pixiContainer.value) {
		window.addEventListener('keydown', keyAction)
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

			// stage
			const board: Graphics = new Graphics()
				.rect(0, 0, boardCellWidth.value*jewelSize.value, boardCellHeight.value*jewelSize.value)
				.fill(boardColor.value)
			app.stage.addChild(board)
			board.x = jewelLeft.value
			board.y = jewelTop.value

			// jewel
			block.value = []
			for (let i = 0; i < jewelMax.value; i++) {
				block.value.push(makeJewel(app, i))
			}
			console.log("-----");
			consoleBlock()

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