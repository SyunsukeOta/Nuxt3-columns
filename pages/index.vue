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
			xId: config.block.startXId,
			yId: config.block.startYId + i,
		})
		
		if (jewel.value && jewel.value.xId != null && jewel.value.yId != null) {
			jewel.value.jewel = new Graphics()
				.rect(0, 0, config.jewel.size, config.jewel.size)
				.fill(jewel.value.color)
			setBlockPos(jewel.value.xId, jewel.value.yId, jewel.value.jewel as Graphics)
			if (app.value) {
				app.value.stage.addChild(jewel.value.jewel as Graphics)
			}
		} else {
			console.error("jewel is null")
		}
		activeBlock.value[i] = jewel.value
	}
	consoleBoardJewels()
}

// calc
const checkLeftWall = () => {
	// ブロックの左側が壁かを確認
	console.log(activeBlock.value[0]?.xId);
	if (activeBlock.value[0]?.xId == 0) {
		console.log("左が壁です!!")
		return true
	}
	// ブロックの左隣に宝石があるかを確認
	console.log("ブロックの左隣を確認")
	let isJewel: boolean = false
	activeBlock.value.map((jewel, index) => {
		if (jewel && jewel.xId != null && jewel.yId != null && boardJewels.value[jewel?.yId][jewel?.xId-1]) {
			isJewel = true
		}
	})
	if (isJewel) return true
	return false
}

const checkRightWall = () => {
	// ブロックの右側が壁かを確認
	console.log(activeBlock.value[0]?.xId);
	if (activeBlock.value[0]?.xId == config.board.cellXLen-1) {
		console.log("右が壁です!!")
		return true
	}
	// ブロックの右に宝石があるかを確認
	console.log("ブロックの右隣を確認");
	let isJewel: boolean = false
	activeBlock.value.map((jewel, index) => {
		if (jewel && jewel.xId != null && jewel.yId != null && boardJewels.value[jewel?.yId][jewel?.xId+1]) {
			isJewel = true
		}
	})
	if (isJewel) return true
	return false
}

const checkFloor = () => {
	// ブロックの直下が地面か確認
	console.log("y-id of under jewel of block: ", activeBlock.value[config.jewel.length-1]?.yId);
	console.log("floor cell: ", config.board.cellYLen)
	// in floor, 12 and 13
	const lastBlockYId = activeBlock.value[config.jewel.length-1]?.yId
	if (lastBlockYId && lastBlockYId + 1 >= config.board.cellYLen) {
		console.log("block is in floor");
		return true
	}
	// ブロックの真下に宝石があるかを確認
	console.log("check BoardJewels of under jewel");
	if (lastBlockYId && activeBlock.value[0] != null && activeBlock.value[0].xId != null && boardJewels.value[lastBlockYId+1][activeBlock.value[0].xId]) {
		console.log("ブロックの直下に宝石がある");
		return true
	}
	return false
}

// draw
const setBlockPos = (xId: number, yId: number, jewel: Graphics) => {
	jewel.x = config.jewel.left + xId * config.jewel.size
	jewel.y = config.jewel.top + yId * config.jewel.size
}

const block2Board = () => {
	activeBlock.value.map((jewel, index) => {
		console.log(`xId: ${jewel?.xId}, yId: ${jewel?.yId}`)
		if (boardJewels.value && jewel && jewel.xId != null && jewel.yId != null) {
			boardJewels.value[jewel.yId][jewel.xId] = jewel
		}
	})
	initBlock()
}

// log
const consoleBlock = () => {
	if (!activeBlock.value) {
		console.error("activeBlock is null");
		return;
	}
	activeBlock.value.forEach((jewel, index) => {
		if (!jewel) {
			console.error(`Jewel at index ${index} is null`);
			return;
		} 
		console.log(`Block ${index}:`, jewel);
	});
}

const consoleBoardJewels = () => {
	if (!boardJewels.value) {
		console.error("boardJewels is null");
		return;
	}
	let line: string = ''
	boardJewels.value.map(row => {
		row.map(col => {
			line += col ? col.color : 'None'
			line += '\t | \t'
		})
		line += '\n'
	})
	console.log(line);
}

// action
const rotateBlock = () => {
	if (!activeBlock.value) {
		console.error("activeBlock is null")
		return
	}
	const lastItem = activeBlock.value[config.jewel.length - 1]
	const firstYId = activeBlock.value[0]?.yId
	console.log("firstYId", firstYId);
	
	for (let i = config.jewel.length - 1; i > 0; i--) {
		activeBlock.value[i] = activeBlock.value[i - 1]
	}
	activeBlock.value[0] = lastItem
	if (activeBlock.value[0] && firstYId !== undefined) {
		activeBlock.value[0].yId = firstYId
	}
	activeBlock.value.map((jewel, index) => {
		if (firstYId != undefined && jewel && jewel.xId != null &&jewel.yId != null) {
			jewel.yId = index + firstYId
			setBlockPos(jewel.xId, jewel.yId, jewel?.jewel as Graphics)
			console.log("in map of activeBlock: ", index, jewel.yId);
			
		}
	})
}

const moveDown = () => {
	if (checkFloor()) {
		block2Board()
	}
	activeBlock.value.map((jewel, index) => {
		if (jewel && jewel.xId != null && jewel.yId != null) {
			jewel.yId = jewel.yId + 1
			setBlockPos(jewel.xId, jewel.yId, jewel?.jewel as Graphics)
		}
	})
}

const moveLeft = () => {
	if (checkLeftWall()) {
		console.log("!!don't move left!!");
		
		return
	}
	console.log("!!move left!!");
	
	activeBlock.value.map((jewel, index) => {
		if (jewel && jewel.xId != null && jewel.yId != null) {
			jewel.xId = jewel.xId - 1
			setBlockPos(jewel.xId, jewel.yId, jewel?.jewel as Graphics)
		}
	})
}

const moveRight = () => {
	if (checkRightWall()) {
		console.log("!!don't move right");
		
		return
	}
	console.log("!!move right!!");
	
	activeBlock.value.map((jewel, index) => {
		if (jewel && jewel.xId != null && jewel.yId != null) {
			jewel.xId = jewel.xId + 1
			setBlockPos(jewel.xId, jewel.yId, jewel?.jewel as Graphics)
		}
	})
}

const handleClick = () => {
	console.log("指")
	rotateBlock()
	// consoleBlock()
}

const keyAction = (event: KeyboardEvent) => {
	if (event.key.startsWith('Arrow')) {
		event.preventDefault()
		switch (event.key) {
			case 'ArrowLeft':
				moveLeft()
				console.log("左")
				break
			case 'ArrowRight':
				moveRight()
				console.log("右")
				break
			case 'ArrowDown':
				moveDown()
				console.log("下")
				break
			default:
				break
		}
		// consoleBlock()
	}
	console.log(event.key);
	if (event.key == ' ') {
		event.preventDefault()
		console.log("-----")
		rotateBlock()
		// consoleBlock()
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
			consoleBlock()
			// consoleBoardJewels()

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