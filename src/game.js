const SCENE = {
  TITLE: "title",
  START_PROMPT: "startPrompt",
};

export class CozyPrototypeGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.scene = SCENE.TITLE;
    this.lastTime = 0;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.scene = this.scene === SCENE.TITLE ? SCENE.START_PROMPT : SCENE.TITLE;
      }
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

  update(_deltaTime) {}

  render() {
    if (this.scene === SCENE.TITLE) {
      this.renderTitle();
      return;
    }
    this.renderStartPrompt();
  }

  renderTitle() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // sky
    ctx.fillStyle = "#9fd8ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ground
    ctx.fillStyle = "#8ac47a";
    ctx.fillRect(0, canvas.height * 0.65, canvas.width, canvas.height * 0.35);

    // simple house block
    ctx.fillStyle = "#f4dfb8";
    ctx.fillRect(530, 210, 170, 120);
    ctx.fillStyle = "#d17d5c";
    ctx.beginPath();
    ctx.moveTo(515, 210);
    ctx.lineTo(615, 145);
    ctx.lineTo(715, 210);
    ctx.closePath();
    ctx.fill();

    // tree
    ctx.fillStyle = "#745339";
    ctx.fillRect(135, 210, 35, 120);
    ctx.fillStyle = "#4f9c56";
    ctx.beginPath();
    ctx.arc(152, 185, 58, 0, Math.PI * 2);
    ctx.fill();

    // title text
    ctx.fillStyle = "#2d3f2d";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText("温馨小镇", 280, 120);

    ctx.font = "22px sans-serif";
    ctx.fillText("阶段1：可运行标题界面", 260, 160);

    ctx.font = "18px sans-serif";
    ctx.fillText("按 Enter 查看开始提示", 295, 390);
  }

  renderStartPrompt() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f7f2d0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#2f3a2f";
    ctx.font = "bold 40px sans-serif";
    ctx.fillText("开始界面（占位）", 230, 140);

    ctx.font = "22px sans-serif";
    ctx.fillText("下一阶段将加入角色与可行走地图", 180, 215);

    ctx.fillStyle = "#8dbb7a";
    ctx.fillRect(292, 270, 220, 56);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("新游戏", 360, 306);

    ctx.fillStyle = "#2f3a2f";
    ctx.font = "18px sans-serif";
    ctx.fillText("再次按 Enter 返回标题", 300, 380);
  }
}
