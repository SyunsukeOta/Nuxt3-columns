export default defineAppConfig({
	app: {
		x: 800,
		y: 600,
	},
	board: {
		cellXLen: 6,
		cellYLen: 13,
		color: 0x999999,
	},
	text: {
		x: 300,
		scoreY: 200,
		levelY: 250,
		speedY: 300,
	},
	score: {
		maxSpeed: 5,
		maxLevel: 25,
		jewelPerLevel: 20,
		levelsPerSpeedUp: 5,
	},
	block: {
		startXId: 2,
		startYId: 0,
	},
	jewel: {
		size: 20,
		length: 3,
		top: 50,
		left: 50,
	},
	textStyle: {
		fontFamily: 'Arial',
		fontSize: 24,
		fill: 'white',
	}
})