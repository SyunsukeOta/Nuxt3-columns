import type { Application, BitmapText, Graphics } from "pixi.js";

export type JewelType = {
  jewel: Graphics | null;
  color: string;
  isDelete: boolean;
  xId: number;
  yId: number;
}

export type TextType = {
  textObj: BitmapText;
  textValue: number;
}

export type TimerType = {
  startTime: DOMHighResTimeStamp | null;
  previousTime: DOMHighResTimeStamp | null;
}

export type AppType = {
  [x: string]: any;
  app: Application;
  pixiContainer: HTMLDivElement | null;
  canvas: HTMLCanvasElement;
}
