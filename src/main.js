import { CozyPrototypeGame } from "./game.js";

const canvas = document.getElementById("gameCanvas");

if (!canvas) {
  throw new Error("未找到 gameCanvas 元素，请检查 index.html");
}

const game = new CozyPrototypeGame(canvas);
game.start();
