<script setup lang="ts">
import { Application, Graphics } from "pixi.js"
import type { JewelType, BlockType } from "@/interfaces"
import { jewelList } from "@/jewelData"

const config = useAppConfig();
const pixiContainer = ref<HTMLDivElement | null>(null)
const app = ref<Application| null>()
const block = ref<BlockType[]>([])
const boardJewels = ref<(BlockType | null)[][]>(Array.from({ length: config.board.cellHeight }, () => Array(config.board.cellWidth).fill(null)))
const blockTopId = ref(config.block.startTopId)
const blockLeftId = ref(config.block.startLeftId)

const handleClick = () => {
	rotateBlock()
	console.log("-----");
	consoleBlock()
}

const makeJewel = (jewelIndex: number): BlockType => {
	const jewelColor = jewelList[Math.floor(Math.random()*jewelList.length)]
	const jewel: Graphics = new Graphics()
		.rect(0, 0, config.jewel.size, config.jewel.size)
		.fill(jewelColor.color)

	if (app.value) app.value.stage.addChild(jewel)

	jewel.x = config.jewel.left + config.block.startLeftId*config.jewel.size
	jewel.y = config.jewel.top + (config.block.startTopId + jewelIndex)*config.jewel.size
	console.log(jewelColor);
	
	return { jewel, jewelColor }
}

const setPlace = () => {
	for (const [index, jewel] of block.value.entries()) {
		jewel.jewel.x = config.jewel.left + blockLeftId.value*config.jewel.size
		jewel.jewel.y = config.jewel.top + (blockTopId.value + index)*config.jewel.size
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

const consoleBoardJewels = () => {
	boardJewels.value.forEach((row, rowIndex) => {
		console.log(row);
	})
}

const moveLeft = () => {
	if (blockLeftId.value > 0) {
		console.log('Left OK');
		blockLeftId.value--
		setPlace()
	}
}

const moveRight = () => {
	if (blockLeftId.value < config.board.cellWidth - 1) {
		console.log('Right OK');
		blockLeftId.value++
		setPlace()
	}
}

const moveDown = () => {
	if (blockTopId.value < config.board.cellHeight - config.jewel.length && boardJewels.value[blockTopId.value + 3][blockLeftId.value] === null) {
		console.log('Down OK');
		blockTopId.value++
		setPlace()
	} else {
		console.log(blockTopId.value, blockLeftId.value);
		console.log(boardJewels.value[blockTopId.value][blockLeftId.value]);
		for (const [index, jewel] of block.value.entries()) {
			console.log(jewel.jewel);
			boardJewels.value[blockTopId.value + index][blockLeftId.value] = jewel
		}
		consoleBoardJewels()

		//reset blockPlace
		blockTopId.value = config.block.startTopId
		blockLeftId.value = config.block.startLeftId

		// reset block
		block.value = []
		for (let i = 0; i < config.jewel.length; i++) {
			block.value.push(makeJewel(i))
		}
		console.log("-----");
		consoleBoardJewels()
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
			app.value = new Application();
			await app.value.init({
				view: canvas,
				width: 800,
				height: 600,
				backgroundColor: 0x000000,
			})
			app.value.stage.interactive = true

			// stage
			const board: Graphics = new Graphics()
				.rect(0, 0, config.board.cellWidth*config.jewel.size, config.board.cellHeight*config.jewel.size)
				.fill(config.board.color)
			app.value.stage.addChild(board)
			board.x = config.jewel.left
			board.y = config.jewel.top

			// jewel
			block.value = []
			for (let i = 0; i < config.jewel.length; i++) {
				block.value.push(makeJewel(i))
			}
			console.log("-----");
			//consoleBlock()

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