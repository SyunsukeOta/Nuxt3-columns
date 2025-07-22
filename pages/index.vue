<script setup lang="ts">
import { Application, Graphics } from "pixi.js"
import type { JewelType } from "@/interfaces"
import { colorMap } from "@/jewelData"


const config = useAppConfig();
const pixiContainer = ref<HTMLDivElement | null>(null)
const app = ref<Application| null>()

// objects
const boardJewels = ref<(JewelType | null)[][]>(
	Array(config.board.cellYLen).fill(null).map(
		() => Array(config.board.cellXLen).fill(null)
	)
)
const activeBlock = ref<(JewelType | null)[]>(
	Array(config.jewel.length).fill(null)
)

const board = ref<(Graphics | null)>(null)

// init
const initBoard = () => {
	board.value = new Graphics()
		.rect(0, 0, config.board.cellXLen * config.jewel.size, config.board.cellYLen * config.jewel.size)
		.fill(config.board.color)
	if (app.value && board.value) {
		app.value.stage.addChild(board.value! as Graphics)
		board.value.x = config.jewel.left
		board.value.y = config.jewel.top
	}
}

const initBlock = () => {
	for (let i = 0; i < config.jewel.length; i++) {
		const jewel = ref<(JewelType | null)>({
			jewel: null,
			color: Array.from(colorMap.keys())[Math.floor(Math.random()*colorMap.size)],
			isDelete: false,
			xId: 3,
			yId: i,
		})
		
		if (jewel.value) {
			jewel.value.jewel = new Graphics()
				.rect(0, 0, config.jewel.size, config.jewel.size)
				.fill(jewel.value.color)
			setBlockPos(i, jewel.value.jewel as Graphics)
			if (app.value) {
				app.value.stage.addChild(jewel.value.jewel as Graphics)
			}
		} else {
			console.error("jewel is null")
		}
		activeBlock.value[i] = jewel.value
	}
}

// draw


// log


// action
const setBlockPos = (jewelId: number, jewel: Graphics) => {
	jewel.x = config.jewel.left + config.block.startXId * config.jewel.size
	jewel.y = config.jewel.top + (config.block.startYId + jewelId) * config.jewel.size
}


const handleClick = () => {
	console.log("指");
	
}

const keyAction = (event: KeyboardEvent) => {
	if (event.key.startsWith('Arrow')) {
		event.preventDefault()
		switch (event.key) {
			case 'ArrowLeft':
				console.log("左");
				break;
			case 'ArrowRight':
				console.log("右");
				break;
			case 'ArrowDown':
				console.log("下");
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
			initBoard()
			initBlock()
			console.log("boardJewels: ", boardJewels.value)
			console.log("activeBlock: ", activeBlock.value);
			

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