import { CozyPrototypeGame } from "./game.js";

const canvas = document.getElementById("gameCanvas");
const helpToggle = document.getElementById("helpToggle");
const helpClose = document.getElementById("helpClose");
const helpPanel = document.getElementById("helpPanel");

if (!canvas) {
  throw new Error("未找到 gameCanvas 元素，请检查 index.html。");
}

const game = new CozyPrototypeGame(canvas);
game.start();

function setHelpOpen(open) {
  if (!helpPanel || !helpToggle) return;
  helpPanel.hidden = !open;
  helpToggle.setAttribute("aria-expanded", String(open));
}

helpToggle?.addEventListener("click", () => {
  const open = helpToggle.getAttribute("aria-expanded") === "true";
  setHelpOpen(!open);
});

helpClose?.addEventListener("click", () => setHelpOpen(false));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && helpPanel && !helpPanel.hidden) {
    setHelpOpen(false);
  }
});
