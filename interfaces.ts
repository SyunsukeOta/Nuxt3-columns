import type { BitmapText, Graphics } from "pixi.js";

export type JewelType = {
  jewel: Graphics | null;
  color: string;
  isDelete: boolean;
  xId: number | null;
  yId: number | null;
}
export type TextType = {
  textObj: BitmapText;
  textValue: number;
}
