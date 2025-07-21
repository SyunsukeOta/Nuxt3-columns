// import type { JewelType } from "@/interfaces"

// export const jewelList: JewelType[] = [
// 	{ name: 'red', color: 0xff0000},
// 	{ name: 'green', color: 0x00ff00},
// 	{ name: 'blue', color: 0x0000ff},
// 	{ name: 'yellow', color: 0xffff00},
// 	{ name: 'orange', color: 0xffa500},
// 	{ name: 'purple', color: 0x800080}
// ]

export const colorMap: Map<string, number> = new Map([
  ["red", 0xff0000],
  ["green", 0x00ff00],
  ["blue", 0x0000ff],
  ["yellow", 0xffff00],
  ["orange", 0xffa500],
  ["purple", 0x800080]
])
// const colorKeys = Array.from(colorMap.keys())
