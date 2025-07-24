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
	consoleBoardJewels("color")
}

// check
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

const checkDeleteRow = (jewel: JewelType, jewelPos: number) => {
	// 横チェック
	if (jewel && jewel.xId !== null && jewel.yId !== null) {
		console.log("Row", jewel?.xId, jewel?.yId, jewelPos)
		let jewel1, jewel2, jewel3
		// 壁判定
		if (jewel.xId - jewelPos < 0 || jewel.xId + (config.jewel.length - 1 - jewelPos) > config.board.cellXLen - 1) return false

		// 宝石定義
		if (jewelPos == 0) {
			jewel1 = boardJewels.value[jewel.yId][jewel.xId]
			jewel2 = boardJewels.value[jewel.yId][jewel.xId+1]
			jewel3 = boardJewels.value[jewel.yId][jewel.xId+2]
		} else if (jewelPos == 1) {
			jewel1 = boardJewels.value[jewel.yId][jewel.xId-1]
			jewel2 = boardJewels.value[jewel.yId][jewel.xId]
			jewel3 = boardJewels.value[jewel.yId][jewel.xId+1]
		} else if (jewelPos == 2) {
			jewel1 = boardJewels.value[jewel.yId][jewel.xId-2]
			jewel2 = boardJewels.value[jewel.yId][jewel.xId-1]
			jewel3 = boardJewels.value[jewel.yId][jewel.xId]
		} else {
			return false
		}
		
		// フラグ更新
		console.log(`jewel1: ${jewel1?.color}, jewel2: ${jewel2?.color}, jewel3: ${jewel3?.color}`);
		if (jewel1 && jewel2 && jewel3 &&jewel1?.color == jewel2?.color && jewel1?.color == jewel3?.color) {
			jewel1.isDelete = true
			jewel2.isDelete = true
			jewel3.isDelete = true
			return true
		} else {
			return false
		}
	}
}

const checkDeleteCol = (jewel: JewelType, jewelPos: number) => {
	// 縦チェック
	if (jewel && jewel.xId !== null && jewel.yId !== null) {
		console.log("Col", jewel?.xId, jewel?.yId, jewelPos)
		let jewel1, jewel2, jewel3
		// 壁判定
		if (jewel.yId - jewelPos < 0 || jewel.yId + (config.jewel.length - 1 - jewelPos) > config.board.cellYLen - 1) return false

		// 宝石定義
		if (jewelPos == 0) {
			jewel1 = boardJewels.value[jewel.yId][jewel.xId]
			jewel2 = boardJewels.value[jewel.yId+1][jewel.xId]
			jewel3 = boardJewels.value[jewel.yId+2][jewel.xId]
		} else if (jewelPos == 1) {
			jewel1 = boardJewels.value[jewel.yId-1][jewel.xId]
			jewel2 = boardJewels.value[jewel.yId][jewel.xId]
			jewel3 = boardJewels.value[jewel.yId+1][jewel.xId]
		} else if (jewelPos == 2 || jewel.yId + 0 > config.board.cellYLen - 1) {
			jewel1 = boardJewels.value[jewel.yId-2][jewel.xId]
			jewel2 = boardJewels.value[jewel.yId-1][jewel.xId]
			jewel3 = boardJewels.value[jewel.yId][jewel.xId]
		} else {
			return false
		}

		// フラグ更新
		console.log(`jewel1: ${jewel1?.color}, jewel2: ${jewel2?.color}, jewel3: ${jewel3?.color}`);
		if (jewel1 && jewel2 && jewel3 && jewel1?.color == jewel2?.color && jewel1?.color == jewel3?.color) {
			jewel1.isDelete = true
			jewel2.isDelete = true
			jewel3.isDelete = true
			return true
		} else {
			return false
		}
	}
}

const checkDeleteLT2RU = (jewel: JewelType, jewelPos: number) => {
	// 左上と右下チェック
	if (jewel && jewel.xId !== null && jewel.yId !== null) {
		console.log("LT2RU", jewel?.xId, jewel?.yId, jewelPos)
		let jewel1, jewel2, jewel3
		// 壁判定
		if (jewel.xId - jewelPos < 0 || jewel.xId + (config.jewel.length - 1 - jewelPos) > config.board.cellXLen - 1) return false
		if (jewel.yId - jewelPos < 0 || jewel.yId + (config.jewel.length - 1 - jewelPos) > config.board.cellYLen - 1) return false

		// 宝石定義
		if (jewelPos == 0) {
			jewel1 = boardJewels.value[jewel.yId][jewel.xId]
			jewel2 = boardJewels.value[jewel.yId+1][jewel.xId+1]
			jewel3 = boardJewels.value[jewel.yId+2][jewel.xId+2]
		} else if (jewelPos == 1) {
			jewel1 = boardJewels.value[jewel.yId-1][jewel.xId-1]
			jewel2 = boardJewels.value[jewel.yId][jewel.xId]
			jewel3 = boardJewels.value[jewel.yId+1][jewel.xId+1]
		} else if (jewelPos == 2) {
			jewel1 = boardJewels.value[jewel.yId-2][jewel.xId-2]
			jewel2 = boardJewels.value[jewel.yId-1][jewel.xId-1]
			jewel3 = boardJewels.value[jewel.yId][jewel.xId]
		} else {
			return false
		}

		// フラグ更新
		console.log(`jewel1: ${jewel1?.color}, jewel2: ${jewel2?.color}, jewel3: ${jewel3?.color}`);
		if (jewel1 && jewel2 && jewel3 &&jewel1?.color == jewel2?.color && jewel1?.color == jewel3?.color) {
			jewel1.isDelete = true
			jewel2.isDelete = true
			jewel3.isDelete = true
			return true
		} else {
			return false
		}
	}
}

const checkDeleteLU2RT = (jewel: JewelType, jewelPos: number) => {
	// 左下と右上チェック
	if (jewel && jewel.xId !== null && jewel.yId !== null) {
		console.log("LU2RT", jewel?.xId, jewel?.yId, jewelPos)
		let jewel1, jewel2, jewel3
		// 壁判定
		if (jewel.xId - (config.jewel.length - 1 - jewelPos) < 0 || jewel.xId + jewelPos > config.board.cellXLen - 1) return false
		if (jewel.yId - jewelPos < 0 || jewel.yId + (config.jewel.length - 1 - jewelPos) > config.board.cellYLen - 1) return false

		// 宝石定義
		if (jewelPos == 0) {
			jewel1 = boardJewels.value[jewel.yId][jewel.xId]
			jewel2 = boardJewels.value[jewel.yId+1][jewel.xId-1]
			jewel3 = boardJewels.value[jewel.yId+2][jewel.xId-2]
		} else if (jewelPos == 1) {
			jewel1 = boardJewels.value[jewel.yId-1][jewel.xId+1]
			jewel2 = boardJewels.value[jewel.yId][jewel.xId]
			jewel3 = boardJewels.value[jewel.yId+1][jewel.xId-1]
		} else if (jewelPos == 2) {
			jewel1 = boardJewels.value[jewel.yId-2][jewel.xId+2]
			jewel2 = boardJewels.value[jewel.yId-1][jewel.xId+1]
			jewel3 = boardJewels.value[jewel.yId][jewel.xId]
		} else {
			return false
		}

		// フラグ更新
		console.log(`jewel1: ${jewel1?.color}, jewel2: ${jewel2?.color}, jewel3: ${jewel3?.color}`);
		if (jewel1 && jewel2 && jewel3 &&jewel1?.color == jewel2?.color && jewel1?.color == jewel3?.color) {
			jewel1.isDelete = true
			jewel2.isDelete = true
			jewel3.isDelete = true
			return true
		} else {
			return false
		}
	}
}

const checkAllJewel = () => {
	let isDeleted = false
	boardJewels.value.map((row, yIndex) => {
		row.map((col, xIndex) => {
			isDeleted = isDeleted || checkJewel(xIndex, yIndex) as boolean
		})
	})
	return isDeleted
}

const checkJewel = (currXId: number, currYId: number) => {
	console.log("-----<checkJewel>-----")
	console.log(`currXId: ${currXId}, currYId: ${currYId}`)
	let isDeleted = false
	for (let i = 0; i < config.jewel.length; i++) {
		let currJewel = boardJewels.value[currYId][currXId]
		let isRow = checkDeleteRow(currJewel as JewelType, i)
		let isCol = checkDeleteCol(currJewel as JewelType, i)
		let isLT2RU = checkDeleteLT2RU(currJewel as JewelType, i)
		let isLU2RT = checkDeleteLU2RT(currJewel as JewelType, i)
		console.log(`i = ${i}, Row: ${isRow}, Col: ${isCol}, LT2RU: ${isLT2RU}, LU2RT: ${isLU2RT}`);
		console.log("----------")
		isDeleted = isDeleted || isRow as boolean || isCol as boolean || isLT2RU as boolean || isLU2RT as boolean
	}
	console.log("-----</checkJewel>-----")
	return isDeleted
}

const isGameOver = () => {
	let isJewelTop = false
	boardJewels.value[0].map((jewel, index) => {
		if (jewel?.jewel) {
			isJewelTop = true
		}
	})
	for (let i = 0; i < config.jewel.length; i++) {
		if (boardJewels.value[i][config.block.startXId]?.jewel) {
			isJewelTop = true
		}
	}
	return isJewelTop
}

// draw
const setBlockPos = (xId: number, yId: number, jewel: Graphics) => {
	// if (jewel == null) return
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

const deleteBoardJewels = () => {
	console.log("isDelete");
	consoleBoardJewels("isDelete")
	boardJewels.value.map((row, yIndex) => {
		row.map((col, xIndex) => {
			if (col && col.isDelete) {
				console.log(`消去予定!! xId: ${col.xId}, yId: ${col.yId}, index: ${xIndex}, ${yIndex}`);
				app.value?.stage.removeChild(boardJewels.value[yIndex][xIndex]?.jewel as Graphics)
				boardJewels.value[yIndex][xIndex] = null
				console.log(`消去後: ${boardJewels.value[yIndex][xIndex]}`);
				
			} 
		})
	})
}

const slideOneJewel = (xIdx: number, yIdx: number) => {
	boardJewels.value[yIdx][xIdx]!.yId = (boardJewels.value[yIdx][xIdx]?.yId as number) + 1
	setBlockPos(
		boardJewels.value[yIdx][xIdx]?.xId as number,
		boardJewels.value[yIdx][xIdx]?.yId as number,
		boardJewels.value[yIdx][xIdx]?.jewel as Graphics
	)
	boardJewels.value[yIdx+1][xIdx] = boardJewels.value[yIdx][xIdx]
	boardJewels.value[yIdx][xIdx] = null
}

const deleteBlankAll = () => {
	for (let lineIdx = 0; lineIdx < config.board.cellXLen; lineIdx++) {
		console.log(`deleteBlankAll, x = ${lineIdx}`);	
		let currI = config.board.cellYLen - 2
		while (currI >= 0) {
			console.log(`currI: ${currI}`);
			if (currI == config.board.cellYLen - 1) {
				currI--
				continue
			}
			if (boardJewels.value[currI][lineIdx] && !boardJewels.value[currI+1][lineIdx]) {
				slideOneJewel(lineIdx, currI)
				currI++
				consoleBoardJewels('color')
			} else {
				currI--
			}
		}

	}
	return 0
}

const clearBoardJewels = () => {
	console.log("clearBoardJewels");
	boardJewels.value.map((row, yIndex) => {
		row.map((col, xIndex) => {
			if (col) {
				app.value?.stage.removeChild(boardJewels.value[yIndex][xIndex]?.jewel as Graphics)
				boardJewels.value[yIndex][xIndex] = null				
			}
		})
	})
	consoleBoardJewels("color")
}

// log
const consoleBlock = () => {
	if (!activeBlock.value) {
		console.error("activeBlock is null");
		return;
	}
	activeBlock.value.map((jewel, index) => {
		if (!jewel) {
			console.error(`Jewel at index ${index} is null`);
			return;
		} 
		console.log(`Block ${index}:`, jewel);
	});
}

const consoleBoardJewels = (label: string) => {
	if (!boardJewels.value) {
		console.error("boardJewels is null");
		return;
	}
	let line: string = ''

	boardJewels.value.map(row => {
		row.map(col => {
			if (label == "color") {
				line += col ? col.color : 'None'
			} else if (label == "isDelete") {
				line += col ? col.isDelete : 'None'
			} else {
				line += 'None'
			}
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
		let topYId = activeBlock.value[0]?.yId
		let topXId = activeBlock.value[0]?.xId
		block2Board()
		// topXId, topYId -> topXId, topYId + 1 -> topXId, topYId + 2
		for (let i = 0; i < config.jewel.length; i++) {
			checkJewel(topXId as number, (topYId as number) + i)
		}
		deleteBoardJewels()
		let isFinish = true
		let roopcount = 0
		while (isFinish as boolean) {
			deleteBlankAll()
			isFinish = checkAllJewel() as boolean
			deleteBoardJewels()
			roopcount++
			if (roopcount > 10) {
				console.log("無限ループに入っています!!");
				break
			}
		}
		if (isGameOver()) {
			alert('gameover')
			clearBoardJewels()
		}
	} else {
		activeBlock.value.map((jewel, index) => {
			if (jewel && jewel.xId != null && jewel.yId != null) {
				jewel.yId = jewel.yId + 1
				setBlockPos(jewel.xId, jewel.yId, jewel?.jewel as Graphics)
			}
		})
	}
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