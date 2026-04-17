const SCENE = {
  TITLE: "title",
  PLAYING: "playing",
};

const TILE = {
  GRASS: 0,
  PATH: 1,
  WATER: 2,
};

const TILE_COLORS = {
  [TILE.GRASS]: "#8fd07d",
  [TILE.PATH]: "#d9bf96",
  [TILE.WATER]: "#73bce8",
};

const TILE_SIZE = 40;
const INTERACT_DISTANCE = 78;

export class CozyPrototypeGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.scene = SCENE.TITLE;
    this.lastTime = 0;

    this.keys = new Set();
    this.interactionMessage = "";
    this.messageTimer = 0;

    this.tileMap = this.createTileMap();
    this.player = {
      x: 120,
      y: 140,
      size: 24,
      speed: 160,
      facing: "down",
    };

    this.inventory = {
      wood: 0,
      fruit: 0,
    };

    this.interactables = this.createInteractables();

    this.bindEvents();
  }

  createTileMap() {
    return [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 2, 2, 2, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
  }

  createInteractables() {
    return [
      {
        id: "tree-1",
        type: "tree",
        x: 240,
        y: 140,
        width: 64,
        height: 78,
        collectible: "wood",
        amount: 1,
        collected: false,
        name: "小树",
      },
      {
        id: "stone-1",
        type: "stone",
        x: 420,
        y: 260,
        width: 58,
        height: 44,
        collectible: null,
        amount: 0,
        collected: false,
        name: "圆石",
      },
      {
        id: "house-1",
        type: "house",
        x: 530,
        y: 140,
        width: 170,
        height: 150,
        collectible: "fruit",
        amount: 1,
        collected: false,
        name: "木屋",
      },
    ];
  }

  bindEvents() {
    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();

      if (key === "enter" && this.scene === SCENE.TITLE) {
        this.scene = SCENE.PLAYING;
        this.showMessage("欢迎来到温馨小镇，试试靠近物体按 E 互动。", 2500);
      }

      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", "e"].includes(key)) {
        event.preventDefault();
      }

      this.keys.add(key);

      if (this.scene === SCENE.PLAYING && key === "e") {
        this.tryInteract();
      }
    });

    window.addEventListener("keyup", (event) => {
      this.keys.delete(event.key.toLowerCase());
    });
  }

  start() {
    requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  loop(timestamp) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame((nextTimestamp) => this.loop(nextTimestamp));
  }

  update(deltaTime) {
    if (this.scene !== SCENE.PLAYING) {
      return;
    }

    this.updateMessage(deltaTime);
    this.updatePlayer(deltaTime / 1000);
  }

  updateMessage(deltaTime) {
    if (this.messageTimer <= 0) {
      return;
    }

    this.messageTimer -= deltaTime;
    if (this.messageTimer <= 0) {
      this.interactionMessage = "";
      this.messageTimer = 0;
    }
  }

  updatePlayer(deltaSeconds) {
    let moveX = 0;
    let moveY = 0;

    if (this.keys.has("arrowup") || this.keys.has("w")) {
      moveY -= 1;
      this.player.facing = "up";
    }
    if (this.keys.has("arrowdown") || this.keys.has("s")) {
      moveY += 1;
      this.player.facing = "down";
    }
    if (this.keys.has("arrowleft") || this.keys.has("a")) {
      moveX -= 1;
      this.player.facing = "left";
    }
    if (this.keys.has("arrowright") || this.keys.has("d")) {
      moveX += 1;
      this.player.facing = "right";
    }

    if (moveX === 0 && moveY === 0) {
      return;
    }

    const length = Math.hypot(moveX, moveY);
    const normalizedX = moveX / length;
    const normalizedY = moveY / length;

    const nextX = this.player.x + normalizedX * this.player.speed * deltaSeconds;
    const nextY = this.player.y + normalizedY * this.player.speed * deltaSeconds;

    if (this.canStandAt(nextX, this.player.y)) {
      this.player.x = nextX;
    }
    if (this.canStandAt(this.player.x, nextY)) {
      this.player.y = nextY;
    }
  }

  canStandAt(x, y) {
    const half = this.player.size / 2;
    const points = [
      { x: x - half, y: y - half },
      { x: x + half, y: y - half },
      { x: x - half, y: y + half },
      { x: x + half, y: y + half },
    ];

    return points.every((point) => this.isWalkablePoint(point.x, point.y));
  }

  isWalkablePoint(pixelX, pixelY) {
    if (pixelX < 0 || pixelY < 0 || pixelX >= this.canvas.width || pixelY >= this.canvas.height) {
      return false;
    }

    const tileX = Math.floor(pixelX / TILE_SIZE);
    const tileY = Math.floor(pixelY / TILE_SIZE);
    const row = this.tileMap[tileY];

    if (!row) {
      return false;
    }

    const tile = row[tileX];
    return tile !== TILE.WATER;
  }

  tryInteract() {
    const nearest = this.getNearestInteractable();
    if (!nearest) {
      this.showMessage("附近没有可以互动的物体。", 1500);
      return;
    }

    if (nearest.collectible && !nearest.collected) {
      this.inventory[nearest.collectible] += nearest.amount;
      nearest.collected = true;

      if (nearest.collectible === "wood") {
        this.showMessage("你收集到了 1 份木材。", 2000);
      } else {
        this.showMessage("你收集到了 1 颗果子。", 2000);
      }
      return;
    }

    if (nearest.type === "stone") {
      this.showMessage("这块圆石很稳固，也许以后可以加工。", 2200);
      return;
    }

    if (nearest.collectible && nearest.collected) {
      this.showMessage(`${nearest.name}今天已经没有新收获了。`, 2000);
      return;
    }

    this.showMessage(`你和${nearest.name}打了个招呼。`, 1800);
  }

  getNearestInteractable() {
    let closest = null;
    let minDistance = Infinity;

    this.interactables.forEach((obj) => {
      const centerX = obj.x + obj.width / 2;
      const centerY = obj.y + obj.height / 2;
      const distance = Math.hypot(centerX - this.player.x, centerY - this.player.y);

      if (distance < INTERACT_DISTANCE && distance < minDistance) {
        closest = obj;
        minDistance = distance;
      }
    });

    return closest;
  }

  showMessage(text, durationMs) {
    this.interactionMessage = text;
    this.messageTimer = durationMs;
  }

  render() {
    if (this.scene === SCENE.TITLE) {
      this.renderTitle();
      return;
    }

    this.renderGame();
  }

  renderTitle() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#9fd8ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#8ac47a";
    ctx.fillRect(0, canvas.height * 0.65, canvas.width, canvas.height * 0.35);

    ctx.fillStyle = "#f4dfb8";
    ctx.fillRect(530, 210, 170, 120);
    ctx.fillStyle = "#d17d5c";
    ctx.beginPath();
    ctx.moveTo(515, 210);
    ctx.lineTo(615, 145);
    ctx.lineTo(715, 210);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#745339";
    ctx.fillRect(135, 210, 35, 120);
    ctx.fillStyle = "#4f9c56";
    ctx.beginPath();
    ctx.arc(152, 185, 58, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2d3f2d";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText("温馨小镇", 280, 120);

    ctx.font = "22px sans-serif";
    ctx.fillText("阶段2：可玩的最小版本", 260, 160);

    ctx.font = "18px sans-serif";
    ctx.fillText("按 Enter 进入小镇", 318, 390);
  }

  renderGame() {
    this.renderTileMap();
    this.renderInteractables();
    this.renderPlayer();
    this.renderHud();
    this.renderPrompt();
  }

  renderTileMap() {
    const { ctx } = this;

    for (let y = 0; y < this.tileMap.length; y += 1) {
      for (let x = 0; x < this.tileMap[y].length; x += 1) {
        const tile = this.tileMap[y][x];
        ctx.fillStyle = TILE_COLORS[tile];
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  renderInteractables() {
    const { ctx } = this;

    this.interactables.forEach((obj) => {
      if (obj.type === "tree") {
        ctx.fillStyle = "#6b4f36";
        ctx.fillRect(obj.x + 24, obj.y + 34, 16, 44);
        ctx.fillStyle = obj.collected ? "#73a46c" : "#4b9a52";
        ctx.beginPath();
        ctx.arc(obj.x + 32, obj.y + 30, 30, 0, Math.PI * 2);
        ctx.fill();
      }

      if (obj.type === "stone") {
        ctx.fillStyle = "#8e949b";
        ctx.beginPath();
        ctx.ellipse(obj.x + 29, obj.y + 26, 28, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#aab1b8";
        ctx.beginPath();
        ctx.ellipse(obj.x + 20, obj.y + 22, 8, 6, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      if (obj.type === "house") {
        ctx.fillStyle = "#f4dfb8";
        ctx.fillRect(obj.x, obj.y + 45, obj.width, obj.height - 45);
        ctx.fillStyle = "#d17d5c";
        ctx.beginPath();
        ctx.moveTo(obj.x - 8, obj.y + 45);
        ctx.lineTo(obj.x + obj.width / 2, obj.y);
        ctx.lineTo(obj.x + obj.width + 8, obj.y + 45);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#8a5f3f";
        ctx.fillRect(obj.x + 70, obj.y + 95, 30, 55);
      }
    });
  }

  renderPlayer() {
    const { ctx } = this;
    const size = this.player.size;

    ctx.fillStyle = "#3a4a6b";
    ctx.fillRect(this.player.x - size / 2, this.player.y - size / 2, size, size);

    ctx.fillStyle = "#ffe4c4";
    ctx.fillRect(this.player.x - 7, this.player.y - 16, 14, 10);
  }

  renderHud() {
    const { ctx } = this;

    ctx.fillStyle = "rgba(35, 48, 35, 0.75)";
    ctx.fillRect(14, 12, 210, 68);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("背包", 26, 36);
    ctx.font = "15px sans-serif";
    ctx.fillText(`木材: ${this.inventory.wood}`, 26, 58);
    ctx.fillText(`果子: ${this.inventory.fruit}`, 110, 58);
  }

  renderPrompt() {
    const { ctx, canvas } = this;
    const nearest = this.getNearestInteractable();

    ctx.fillStyle = "rgba(0, 0, 0, 0.48)";
    ctx.fillRect(140, canvas.height - 56, 520, 36);

    ctx.fillStyle = "#ffffff";
    ctx.font = "15px sans-serif";
    if (this.interactionMessage) {
      ctx.fillText(this.interactionMessage, 154, canvas.height - 32);
      return;
    }

    if (nearest) {
      ctx.fillText(`靠近 ${nearest.name}，按 E 互动`, 154, canvas.height - 32);
      return;
    }

    ctx.fillText("方向键 / WASD 移动，靠近物体后按 E 互动", 154, canvas.height - 32);
  }
}
