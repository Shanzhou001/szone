// =============================================
// 温馨小镇 - 动物森友会风格 2D 游戏
// =============================================

const SCENE = {
  TITLE: "title",
  PLAYING: "playing",
  SHOP: "shop",
  DIALOGUE: "dialogue",
  FISHING: "fishing",
  INVENTORY: "inventory",
  INDOOR: "indoor",
  GAMEOVER: "gameover",
};

const TILE = {
  GRASS: 0,
  PATH: 1,
  WATER: 2,
  SAND: 3,
  FLOWER: 4,
  DARK_GRASS: 5,
  WOOD_FLOOR: 6,
};

const TILE_COLORS = {
  [TILE.GRASS]: "#7ec850",
  [TILE.PATH]: "#d9bf96",
  [TILE.WATER]: "#4fa8e0",
  [TILE.SAND]: "#e8d9a0",
  [TILE.FLOWER]: "#7ec850",
  [TILE.DARK_GRASS]: "#5fa840",
  [TILE.WOOD_FLOOR]: "#c8964a",
};

const TILE_SIZE = 48;
const INTERACT_DISTANCE = 90;
const MAP_W = 30;
const MAP_H = 26;

// ---- 时间系统 ----
const TIME_SPEED = 0.5; // 游戏内分钟/现实秒

const SKY_COLORS = [
  { hour: 0,  color: "#1a1a3a" },
  { hour: 5,  color: "#2d1b4e" },
  { hour: 6,  color: "#e87c35" },
  { hour: 7,  color: "#f4a55a" },
  { hour: 8,  color: "#9fd8ff" },
  { hour: 12, color: "#6bbfff" },
  { hour: 17, color: "#f4a55a" },
  { hour: 18, color: "#e06030" },
  { hour: 20, color: "#4a3070" },
  { hour: 22, color: "#1a1a3a" },
  { hour: 24, color: "#1a1a3a" },
];

function lerpColor(c1, c2, t) {
  const parse = (c) => {
    const r = parseInt(c.slice(1,3),16);
    const g = parseInt(c.slice(3,5),16);
    const b = parseInt(c.slice(5,7),16);
    return [r,g,b];
  };
  const [r1,g1,b1] = parse(c1);
  const [r2,g2,b2] = parse(c2);
  const r = Math.round(r1 + (r2-r1)*t);
  const g = Math.round(g1 + (g2-g1)*t);
  const b = Math.round(b1 + (b2-b1)*t);
  return `rgb(${r},${g},${b})`;
}

function getSkyColor(hour) {
  for (let i = 0; i < SKY_COLORS.length - 1; i++) {
    const a = SKY_COLORS[i], b = SKY_COLORS[i+1];
    if (hour >= a.hour && hour < b.hour) {
      const t = (hour - a.hour) / (b.hour - a.hour);
      return lerpColor(a.color, b.color, t);
    }
  }
  return "#1a1a3a";
}

// ---- NPC 台词库 ----
const NPC_DIALOGUES = {
  "小玲": [
    ["早安！今天天气真好~", "你看那朵云像不像棉花糖？"],
    ["我昨天发现河边有新鱼！", "下次钓鱼一定要带上我哦。"],
    ["听说镇子东边有神秘宝箱…", "但我一个人不敢去找。"],
    ["今天的花都开了，真漂亮！"],
  ],
  "老陈": [
    ["年轻人，别老看手机。", "多来店里转转！"],
    ["我的商店什么都有，", "保证物美价廉！"],
    ["今天特价：果子换金币", "快来快来！"],
  ],
  "毛毛": [
    ["喵～我是这里最懒的猫。"],
    ["你有鱼吗？我想要鱼！", "给我鱼我就告诉你秘密。"],
    ["秘密就是…河边的石头", "下面可能藏着东西哦~"],
    ["喵喵喵！"],
  ],
  "阿壮": [
    ["嗨！我在练举重。", "快来一起锻炼！"],
    ["你知道吗，这个镇子", "以前叫做枫叶村。"],
    ["力量！勇气！坚持！", "这就是我的人生格言。"],
  ],
};

// ---- 物品数据 ----
const ITEMS = {
  wood:    { name: "木材", icon: "🪵", sellPrice: 5,  buyPrice: 15, desc: "建造房屋的材料" },
  fruit:   { name: "果子", icon: "🍎", sellPrice: 8,  buyPrice: 20, desc: "甜甜的红果子" },
  fish:    { name: "鱼",   icon: "🐟", sellPrice: 12, buyPrice: 30, desc: "新鲜的河鱼" },
  flower:  { name: "花",   icon: "🌸", sellPrice: 6,  buyPrice: 18, desc: "漂亮的野花" },
  stone:   { name: "石头", icon: "🪨", sellPrice: 3,  buyPrice: 10, desc: "坚硬的石头" },
  mushroom:{ name: "蘑菇", icon: "🍄", sellPrice: 10, buyPrice: 25, desc: "美味的野蘑菇" },
  shell:   { name: "贝壳", icon: "🐚", sellPrice: 7,  buyPrice: 0,  desc: "海边的贝壳" },
  seed:    { name: "种子", icon: "🌱", sellPrice: 2,  buyPrice: 8,  desc: "可以种植的种子" },
};

// ---- 钓鱼鱼种 ----
const FISH_TYPES = [
  { name: "小鲫鱼",  icon: "🐟", rarity: 0.40, score: 1 },
  { name: "鲤鱼",    icon: "🐠", rarity: 0.25, score: 2 },
  { name: "鳟鱼",    icon: "🐡", rarity: 0.15, score: 3 },
  { name: "鲈鱼",    icon: "🦈", rarity: 0.10, score: 5 },
  { name: "金鱼",    icon: "🔴", rarity: 0.07, score: 8 },
  { name: "传说大鱼", icon: "🐋", rarity: 0.03, score: 20 },
];

export class CozyPrototypeGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.scene = SCENE.TITLE;
    this.lastTime = 0;

    this.keys = new Set();
    this.interactionMessage = "";
    this.messageTimer = 0;

    // 摄像机
    this.camera = { x: 0, y: 0 };

    // 游戏时间（以分钟计，0-1440）
    this.gameMinutes = 8 * 60; // 从早上8点开始
    this.gameDay = 1;

    // 金币
    this.gold = 50;

    // 背包（物品名 -> 数量）
    this.inventory = {};

    // 玩家
    this.player = {
      x: 400,
      y: 400,
      size: 26,
      speed: 180,
      facing: "down",
      name: "旅行者",
    };

    // 地图
    this.tileMap = this.createTileMap();
    this.interactables = this.createInteractables();
    this.npcs = this.createNpcs();

    // 种植格子
    this.plantPlots = [];

    // 对话
    this.dialogueTarget = null;
    this.dialoguePage = 0;
    this.dialogueSet = 0;

    // 商店
    this.shopMode = "buy"; // "buy" | "sell"
    this.shopSelection = 0;

    // 钓鱼
    this.fishingState = "casting"; // casting | waiting | biting | reeling | result
    this.fishingTimer = 0;
    this.fishingResult = null;
    this.fishingBarY = 200;
    this.fishingBarVel = 0;
    this.fishingFishY = 150;
    this.fishingFishDir = 1;
    this.fishingProgress = 0;

    // 室内
    this.indoorMap = this.createIndoorMap();

    // 任务
    this.quests = this.createQuests();
    this.activeQuestIdx = 0;

    // 成就
    this.achievements = {
      firstFish: false,
      collect10wood: false,
      rich: false,
    };

    // 粒子
    this.particles = [];

    // 刷新计时
    this.dayRefreshDone = false;

    this.bindEvents();
    this.loadSave();
  }

  // =========== 存档 ===========
  saveGame() {
    const data = {
      gold: this.gold,
      inventory: this.inventory,
      gameDay: this.gameDay,
      gameMinutes: this.gameMinutes,
      player: { x: this.player.x, y: this.player.y },
      interactables: this.interactables.map(o => ({ id: o.id, collected: o.collected, regrowTimer: o.regrowTimer || 0 })),
    };
    try { localStorage.setItem("cozytown_save", JSON.stringify(data)); } catch(e){}
    this.showMessage("游戏已保存 💾", 2000);
  }

  loadSave() {
    try {
      const raw = localStorage.getItem("cozytown_save");
      if (!raw) return;
      const data = JSON.parse(raw);
      this.gold = data.gold ?? 50;
      this.inventory = data.inventory ?? {};
      this.gameDay = data.gameDay ?? 1;
      this.gameMinutes = data.gameMinutes ?? 480;
      if (data.player) {
        this.player.x = data.player.x;
        this.player.y = data.player.y;
      }
      if (data.interactables) {
        data.interactables.forEach(saved => {
          const obj = this.interactables.find(o => o.id === saved.id);
          if (obj) {
            obj.collected = saved.collected;
            obj.regrowTimer = saved.regrowTimer || 0;
          }
        });
      }
    } catch(e) {}
  }

  // =========== 地图生成 ===========
  createTileMap() {
    // 30x26 大地图
    const map = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,0],
      [0,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,0],
      [0,5,5,4,4,5,5,5,0,0,0,0,0,0,0,0,0,2,2,2,2,0,5,5,4,4,5,5,5,0],
      [0,5,5,4,4,5,5,5,0,0,0,0,0,0,0,0,2,2,2,2,2,0,5,5,4,4,5,5,5,0],
      [0,5,5,5,5,5,5,5,0,0,0,0,0,0,0,2,2,2,2,2,2,0,5,5,5,5,5,5,5,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0],
      [3,3,3,3,0,0,0,0,0,0,0,0,0,0,3,3,2,2,3,3,3,0,0,0,0,0,0,0,0,0],
      [3,3,3,3,0,0,0,0,0,0,0,0,0,3,3,3,2,2,3,3,3,0,0,0,0,0,0,0,0,0],
      [3,3,3,3,0,0,0,0,0,0,0,0,3,3,3,3,2,2,3,3,3,0,0,0,0,0,0,0,0,0],
      [3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    return map;
  }

  createIndoorMap() {
    const m = [];
    for (let y = 0; y < 8; y++) {
      m.push([]);
      for (let x = 0; x < 10; x++) {
        m[y].push(TILE.WOOD_FLOOR);
      }
    }
    return m;
  }

  // =========== 可交互物体 ===========
  createInteractables() {
    return [
      // 树木（可再生）
      { id:"tree-1",  type:"tree",     x:80,   y:80,   w:64, h:78, item:"wood",     amount:1, collected:false, regrowTimer:0, regrowTime:60000, name:"大橡树" },
      { id:"tree-2",  type:"tree",     x:200,  y:100,  w:64, h:78, item:"wood",     amount:1, collected:false, regrowTimer:0, regrowTime:55000, name:"小枫树" },
      { id:"tree-3",  type:"tree",     x:960,  y:160,  w:64, h:78, item:"wood",     amount:2, collected:false, regrowTimer:0, regrowTime:70000, name:"果树",  extraItem:"fruit" },
      { id:"tree-4",  type:"tree",     x:1100, y:80,   w:64, h:78, item:"wood",     amount:1, collected:false, regrowTimer:0, regrowTime:60000, name:"松树" },
      // 花
      { id:"flower-1",type:"flower",   x:160,  y:200,  w:32, h:32, item:"flower",   amount:1, collected:false, regrowTimer:0, regrowTime:40000, name:"野花丛" },
      { id:"flower-2",type:"flower",   x:1040, y:200,  w:32, h:32, item:"flower",   amount:1, collected:false, regrowTimer:0, regrowTime:40000, name:"紫罗兰" },
      // 蘑菇
      { id:"mush-1",  type:"mushroom", x:320,  y:340,  w:36, h:36, item:"mushroom", amount:1, collected:false, regrowTimer:0, regrowTime:90000, name:"红蘑菇" },
      { id:"mush-2",  type:"mushroom", x:1180, y:380,  w:36, h:36, item:"mushroom", amount:1, collected:false, regrowTimer:0, regrowTime:90000, name:"棕蘑菇" },
      // 石头
      { id:"stone-1", type:"stone",    x:500,  y:480,  w:58, h:44, item:"stone",    amount:1, collected:false, regrowTimer:0, regrowTime:120000,name:"圆石" },
      { id:"stone-2", type:"stone",    x:820,  y:500,  w:58, h:44, item:"stone",    amount:1, collected:false, regrowTimer:0, regrowTime:120000,name:"大岩石" },
      // 贝壳（沙滩）
      { id:"shell-1", type:"shell",    x:100,  y:430,  w:28, h:20, item:"shell",    amount:1, collected:false, regrowTimer:0, regrowTime:50000, name:"贝壳" },
      { id:"shell-2", type:"shell",    x:180,  y:460,  w:28, h:20, item:"shell",    amount:1, collected:false, regrowTimer:0, regrowTime:50000, name:"螺壳" },
      // 钓鱼点
      { id:"fish-1",  type:"fishspot", x:680,  y:290,  w:40, h:40, item:null,       amount:0, collected:false, regrowTimer:0, regrowTime:0,     name:"钓鱼点" },
      // 宝箱
      { id:"chest-1", type:"chest",    x:1250, y:560,  w:48, h:40, item:"gold",     amount:30,collected:false, regrowTimer:0, regrowTime:0,     name:"神秘宝箱" },
      // 木屋（入口）
      { id:"house-1", type:"house",    x:560,  y:130,  w:170,h:150,item:null,       amount:0, collected:false, regrowTimer:0, regrowTime:0,     name:"你的小屋" },
      // 商店
      { id:"shop-1",  type:"shop",     x:820,  y:130,  w:160,h:140,item:null,       amount:0, collected:false, regrowTimer:0, regrowTime:0,     name:"老陈的商店" },
      // 告示牌
      { id:"sign-1",  type:"sign",     x:400,  y:530,  w:30, h:44, item:null,       amount:0, collected:false, regrowTimer:0, regrowTime:0,     name:"公告牌",    text:"欢迎来到温馨小镇！\n探索地图，和居民聊天，\n钓鱼、收集资源，快乐生活！" },
    ];
  }

  // =========== NPC ===========
  createNpcs() {
    return [
      { id:"npc-lingling", name:"小玲", x:450, y:300, size:26, color:"#e888aa", hatColor:"#ff6688", dialogueSet:0, moveTimer:0, vx:0, vy:0 },
      { id:"npc-chen",     name:"老陈", x:870, y:280, size:28, color:"#8855aa", hatColor:"#aa44cc", dialogueSet:0, moveTimer:0, vx:0, vy:0 },
      { id:"npc-maomao",   name:"毛毛", x:300, y:620, size:24, color:"#f0c040", hatColor:"#e0a020", dialogueSet:0, moveTimer:0, vx:0, vy:0 },
      { id:"npc-zhuang",   name:"阿壮", x:700, y:650, size:30, color:"#55aa55", hatColor:"#339933", dialogueSet:0, moveTimer:0, vx:0, vy:0 },
    ];
  }

  // =========== 任务 ===========
  createQuests() {
    return [
      { id:"q1", title:"初来乍到", desc:"收集 3 份木材", check:()=>( (this.inventory.wood||0) >= 3 ), reward:{gold:20}, done:false },
      { id:"q2", title:"甜蜜收获", desc:"收集 2 个果子", check:()=>( (this.inventory.fruit||0) >= 2 ), reward:{gold:15}, done:false },
      { id:"q3", title:"渔夫日记", desc:"钓到第一条鱼",  check:()=>( (this.inventory.fish||0) >= 1 ),  reward:{gold:25}, done:false },
      { id:"q4", title:"百万富翁", desc:"积累 200 金币",  check:()=>( this.gold >= 200 ),              reward:{item:"mushroom",amount:3}, done:false },
      { id:"q5", title:"博物学家", desc:"收集所有种类物品", check:()=>{
        const needed = ["wood","fruit","fish","flower","stone","mushroom","shell"];
        return needed.every(k => (this.inventory[k]||0) >= 1);
      }, reward:{gold:100}, done:false },
    ];
  }

  // =========== 事件绑定 ===========
  bindEvents() {
    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      if (["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d","e","escape","enter"," "].includes(key)) {
        e.preventDefault();
      }
      this.keys.add(key);

      if (key === "enter" && this.scene === SCENE.TITLE) {
        this.scene = SCENE.PLAYING;
        this.showMessage("欢迎来到温馨小镇！按 E 互动，按 I 查看背包，按 F5 存档。", 3500);
        return;
      }

      if (this.scene === SCENE.PLAYING) {
        if (key === "e") this.tryInteract();
        if (key === "i") this.scene = SCENE.INVENTORY;
        if (key === "f5") this.saveGame();
        if (key === "escape") this.scene = SCENE.PLAYING;
      } else if (this.scene === SCENE.DIALOGUE) {
        if (key === "e" || key === "enter" || key === " ") this.advanceDialogue();
        if (key === "escape") this.scene = SCENE.PLAYING;
      } else if (this.scene === SCENE.SHOP) {
        this.handleShopInput(key);
      } else if (this.scene === SCENE.INVENTORY) {
        if (key === "escape" || key === "i") this.scene = SCENE.PLAYING;
      } else if (this.scene === SCENE.FISHING) {
        if (key === " " || key === "e") this.handleFishingInput();
        if (key === "escape") { this.scene = SCENE.PLAYING; this.fishingState = "casting"; }
      } else if (this.scene === SCENE.INDOOR) {
        if (key === "e" || key === "escape") this.scene = SCENE.PLAYING;
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys.delete(e.key.toLowerCase());
    });
  }

  // =========== 主循环 ===========
  start() {
    requestAnimationFrame((t) => this.loop(t));
  }

  loop(timestamp) {
    const dt = Math.min(timestamp - this.lastTime, 100);
    this.lastTime = timestamp;
    this.update(dt);
    this.render();
    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    if (this.scene === SCENE.TITLE || this.scene === SCENE.GAMEOVER) return;

    // 时间推进
    this.gameMinutes += (dt / 1000) * 60 * TIME_SPEED;
    if (this.gameMinutes >= 1440) {
      this.gameMinutes -= 1440;
      this.gameDay++;
      this.onNewDay();
    }

    this.updateMessage(dt);
    this.updateParticles(dt);
    this.updateInteractables(dt);
    this.updateNpcs(dt);

    if (this.scene === SCENE.PLAYING || this.scene === SCENE.INDOOR) {
      this.updatePlayer(dt / 1000);
    }
    if (this.scene === SCENE.FISHING) {
      this.updateFishing(dt);
    }

    this.updateCamera();
    this.checkQuests();
    this.checkAchievements();
  }

  onNewDay() {
    this.showMessage(`第 ${this.gameDay} 天开始了！资源已刷新。`, 3000);
    this.interactables.forEach(o => {
      if (o.collected && o.regrowTime > 0) {
        o.collected = false;
        o.regrowTimer = 0;
      }
    });
  }

  updateMessage(dt) {
    if (this.messageTimer > 0) {
      this.messageTimer -= dt;
      if (this.messageTimer <= 0) {
        this.interactionMessage = "";
        this.messageTimer = 0;
      }
    }
  }

  updateParticles(dt) {
    this.particles = this.particles.filter(p => p.life > 0);
    this.particles.forEach(p => {
      p.x += p.vx * dt / 1000;
      p.y += p.vy * dt / 1000;
      p.vy += 120 * dt / 1000;
      p.life -= dt;
      p.alpha = p.life / p.maxLife;
    });
  }

  spawnParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 60 + Math.random() * 80;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        color, life: 600, maxLife: 600, alpha: 1,
        size: 4 + Math.random() * 4,
      });
    }
  }

  updateInteractables(dt) {
    this.interactables.forEach(o => {
      if (o.collected && o.regrowTime > 0) {
        o.regrowTimer += dt;
        if (o.regrowTimer >= o.regrowTime) {
          o.collected = false;
          o.regrowTimer = 0;
        }
      }
    });
  }

  updateNpcs(dt) {
    this.npcs.forEach(npc => {
      npc.moveTimer -= dt;
      if (npc.moveTimer <= 0) {
        npc.moveTimer = 2000 + Math.random() * 3000;
        if (Math.random() < 0.5) {
          const angle = Math.random() * Math.PI * 2;
          npc.vx = Math.cos(angle) * 40;
          npc.vy = Math.sin(angle) * 40;
        } else {
          npc.vx = 0;
          npc.vy = 0;
        }
      }

      const nx = npc.x + npc.vx * dt / 1000;
      const ny = npc.y + npc.vy * dt / 1000;
      if (this.canStandAt(nx, npc.y, npc.size)) npc.x = nx;
      if (this.canStandAt(npc.x, ny, npc.size)) npc.y = ny;

      // 边界约束
      npc.x = Math.max(50, Math.min(MAP_W * TILE_SIZE - 50, npc.x));
      npc.y = Math.max(50, Math.min(MAP_H * TILE_SIZE - 50, npc.y));
    });
  }

  updatePlayer(ds) {
    if (this.scene === SCENE.INDOOR) {
      // 室内只允许在小地图范围内走
      return;
    }
    let mx = 0, my = 0;
    if (this.keys.has("arrowup")   || this.keys.has("w")) { my -= 1; this.player.facing = "up"; }
    if (this.keys.has("arrowdown") || this.keys.has("s")) { my += 1; this.player.facing = "down"; }
    if (this.keys.has("arrowleft") || this.keys.has("a")) { mx -= 1; this.player.facing = "left"; }
    if (this.keys.has("arrowright")|| this.keys.has("d")) { mx += 1; this.player.facing = "right"; }
    if (mx === 0 && my === 0) return;

    const len = Math.hypot(mx, my);
    const nx = this.player.x + (mx/len) * this.player.speed * ds;
    const ny = this.player.y + (my/len) * this.player.speed * ds;
    if (this.canStandAt(nx, this.player.y, this.player.size)) this.player.x = nx;
    if (this.canStandAt(this.player.x, ny, this.player.size)) this.player.y = ny;
    this.player.x = Math.max(16, Math.min(MAP_W * TILE_SIZE - 16, this.player.x));
    this.player.y = Math.max(16, Math.min(MAP_H * TILE_SIZE - 16, this.player.y));
  }

  updateCamera() {
    const cx = this.player.x - this.canvas.width / 2;
    const cy = this.player.y - this.canvas.height / 2;
    const maxX = MAP_W * TILE_SIZE - this.canvas.width;
    const maxY = MAP_H * TILE_SIZE - this.canvas.height;
    this.camera.x += (Math.max(0, Math.min(maxX, cx)) - this.camera.x) * 0.1;
    this.camera.y += (Math.max(0, Math.min(maxY, cy)) - this.camera.y) * 0.1;
  }

  canStandAt(x, y, size) {
    const half = (size || this.player.size) / 2;
    const corners = [
      [x-half, y-half], [x+half, y-half],
      [x-half, y+half], [x+half, y+half],
    ];
    return corners.every(([px, py]) => {
      if (px < 0 || py < 0 || px >= MAP_W*TILE_SIZE || py >= MAP_H*TILE_SIZE) return false;
      const tx = Math.floor(px / TILE_SIZE);
      const ty = Math.floor(py / TILE_SIZE);
      const row = this.tileMap[ty];
      if (!row) return false;
      return row[tx] !== TILE.WATER;
    });
  }

  // =========== 交互 ===========
  tryInteract() {
    // 检查 NPC
    const npc = this.getNearestNpc();
    if (npc) {
      this.startDialogue(npc);
      return;
    }
    // 检查物体
    const obj = this.getNearestInteractable();
    if (!obj) {
      this.showMessage("附近没有可以互动的物体。", 1500);
      return;
    }
    this.interactWith(obj);
  }

  getNearestNpc() {
    let best = null, minD = INTERACT_DISTANCE;
    this.npcs.forEach(npc => {
      const d = Math.hypot(npc.x - this.player.x, npc.y - this.player.y);
      if (d < minD) { minD = d; best = npc; }
    });
    return best;
  }

  getNearestInteractable() {
    let best = null, minD = INTERACT_DISTANCE;
    this.interactables.forEach(obj => {
      const cx = obj.x + obj.w / 2;
      const cy = obj.y + obj.h / 2;
      const d = Math.hypot(cx - this.player.x, cy - this.player.y);
      if (d < minD) { minD = d; best = obj; }
    });
    return best;
  }

  interactWith(obj) {
    if (obj.type === "house") {
      this.scene = SCENE.INDOOR;
      this.showMessage("欢迎回家！按 E 或 ESC 离开。", 2000);
      return;
    }
    if (obj.type === "shop") {
      this.scene = SCENE.SHOP;
      this.shopMode = "buy";
      this.shopSelection = 0;
      return;
    }
    if (obj.type === "sign") {
      this.showMessage(obj.text.replace("\n"," | "), 4000);
      return;
    }
    if (obj.type === "fishspot") {
      this.scene = SCENE.FISHING;
      this.fishingState = "casting";
      this.fishingTimer = 1500 + Math.random() * 3000;
      this.fishingProgress = 0;
      this.fishingBarY = 180;
      this.fishingFishY = 140;
      this.showMessage("甩出鱼竿，等待鱼上钩…", 2000);
      return;
    }
    if (obj.type === "chest") {
      if (obj.collected) {
        this.showMessage("宝箱已经空了。", 1500);
        return;
      }
      obj.collected = true;
      this.gold += obj.amount;
      this.spawnParticles(obj.x + obj.w/2, obj.y, "#f0d060", 12);
      this.showMessage(`发现宝箱！获得 ${obj.amount} 金币！💰`, 3000);
      return;
    }

    // 收集资源
    if (obj.collected) {
      const timeLeft = Math.ceil((obj.regrowTime - obj.regrowTimer) / 1000);
      this.showMessage(`${obj.name} 已采集，${timeLeft} 秒后再生。`, 2000);
      return;
    }

    // 采集
    obj.collected = true;
    obj.regrowTimer = 0;
    const itemKey = obj.item;
    if (itemKey) {
      this.addItem(itemKey, obj.amount);
      const icon = ITEMS[itemKey]?.icon || "";
      this.spawnParticles(obj.x + obj.w/2, obj.y, "#88ff88", 6);
      this.showMessage(`获得 ${obj.amount} 个 ${ITEMS[itemKey]?.name || itemKey} ${icon}`, 2000);
    }
    if (obj.extraItem) {
      this.addItem(obj.extraItem, 1);
      const icon = ITEMS[obj.extraItem]?.icon || "";
      this.showMessage(`还获得了 1 个 ${ITEMS[obj.extraItem]?.name || obj.extraItem} ${icon}`, 2000);
    }
  }

  addItem(key, amount) {
    this.inventory[key] = (this.inventory[key] || 0) + amount;
  }

  // =========== 对话 ===========
  startDialogue(npc) {
    this.dialogueTarget = npc;
    const sets = NPC_DIALOGUES[npc.name] || [["你好！"]];
    this.dialogueSet = npc.dialogueSet % sets.length;
    this.dialoguePage = 0;
    this.scene = SCENE.DIALOGUE;
  }

  advanceDialogue() {
    const npc = this.dialogueTarget;
    if (!npc) { this.scene = SCENE.PLAYING; return; }
    const sets = NPC_DIALOGUES[npc.name] || [["你好！"]];
    const pages = sets[this.dialogueSet];
    this.dialoguePage++;
    if (this.dialoguePage >= pages.length) {
      npc.dialogueSet = (this.dialogueSet + 1) % sets.length;
      this.scene = SCENE.PLAYING;
      this.dialogueTarget = null;
    }
  }

  // =========== 商店 ===========
  handleShopInput(key) {
    const buyList = Object.keys(ITEMS).filter(k => ITEMS[k].buyPrice > 0);
    const sellList = Object.keys(this.inventory).filter(k => this.inventory[k] > 0);

    if (key === "tab") {
      this.shopMode = this.shopMode === "buy" ? "sell" : "buy";
      this.shopSelection = 0;
      return;
    }
    if (key === "escape") {
      this.scene = SCENE.PLAYING;
      return;
    }

    const list = this.shopMode === "buy" ? buyList : sellList;
    if (key === "arrowdown" || key === "s") {
      this.shopSelection = (this.shopSelection + 1) % list.length;
    }
    if (key === "arrowup" || key === "w") {
      this.shopSelection = (this.shopSelection - 1 + list.length) % list.length;
    }
    if ((key === "e" || key === "enter") && list.length > 0) {
      const itemKey = list[this.shopSelection];
      if (this.shopMode === "buy") {
        const price = ITEMS[itemKey].buyPrice;
        if (this.gold >= price) {
          this.gold -= price;
          this.addItem(itemKey, 1);
          this.showMessage(`购买了 1 个 ${ITEMS[itemKey].name}，花费 ${price} 金币。`, 2000);
        } else {
          this.showMessage("金币不足！", 1500);
        }
      } else {
        const price = ITEMS[itemKey].sellPrice;
        this.inventory[itemKey]--;
        if (this.inventory[itemKey] <= 0) delete this.inventory[itemKey];
        this.gold += price;
        this.showMessage(`卖出 1 个 ${ITEMS[itemKey].name}，获得 ${price} 金币。`, 2000);
      }
    }
  }

  // =========== 钓鱼 ===========
  handleFishingInput() {
    if (this.fishingState === "biting") {
      this.fishingState = "reeling";
      this.fishingBarY = 180;
      this.fishingFishY = 100 + Math.random() * 160;
      this.fishingProgress = 0;
    } else if (this.fishingState === "reeling") {
      this.fishingBarVel = -120;
    } else if (this.fishingState === "result") {
      this.scene = SCENE.PLAYING;
      this.fishingState = "casting";
    }
  }

  updateFishing(dt) {
    if (this.fishingState === "casting") {
      this.fishingTimer -= dt;
      if (this.fishingTimer <= 0) {
        this.fishingState = "biting";
        this.showMessage("鱼上钩了！快按 E！", 0);
        this.fishingTimer = 2500;
      }
    } else if (this.fishingState === "biting") {
      this.fishingTimer -= dt;
      if (this.fishingTimer <= 0) {
        this.fishingState = "casting";
        this.fishingTimer = 1500 + Math.random() * 3000;
        this.showMessage("鱼跑了…重新等待中。", 2000);
      }
    } else if (this.fishingState === "reeling") {
      // 鱼条上下移动
      this.fishingFishY += this.fishingFishDir * 60 * dt / 1000;
      if (this.fishingFishY < 60 || this.fishingFishY > 260) this.fishingFishDir *= -1;

      // 滑块物理
      this.fishingBarVel += 200 * dt / 1000;
      this.fishingBarY += this.fishingBarVel * dt / 1000;
      if (this.fishingBarY < 60) { this.fishingBarY = 60; this.fishingBarVel = 0; }
      if (this.fishingBarY > 260) { this.fishingBarY = 260; this.fishingBarVel = 0; }

      const barH = 50;
      const overlap = this.fishingBarY <= this.fishingFishY && this.fishingFishY <= this.fishingBarY + barH;
      if (overlap) {
        this.fishingProgress += dt * 0.06;
      } else {
        this.fishingProgress -= dt * 0.04;
      }
      this.fishingProgress = Math.max(0, Math.min(100, this.fishingProgress));

      if (this.fishingProgress >= 100) {
        this.catchFish();
      } else if (this.fishingProgress <= 0 && this.fishingBarY >= 250) {
        this.fishingState = "casting";
        this.fishingTimer = 1500 + Math.random() * 2000;
        this.showMessage("鱼逃跑了！再试一次。", 2000);
      }
    }
  }

  catchFish() {
    let roll = Math.random();
    let cumulative = 0;
    let caught = FISH_TYPES[0];
    for (const f of FISH_TYPES) {
      cumulative += f.rarity;
      if (roll <= cumulative) { caught = f; break; }
    }
    this.addItem("fish", 1);
    this.fishingResult = caught;
    this.fishingState = "result";
    this.spawnParticles(this.canvas.width/2, 300, "#4fa8e0", 12);
    this.showMessage(`钓到了 ${caught.icon} ${caught.name}！`, 2000);
  }

  // =========== 任务/成就 ===========
  checkQuests() {
    this.quests.forEach(q => {
      if (!q.done && q.check()) {
        q.done = true;
        let msg = `任务完成：${q.title}！`;
        if (q.reward.gold) {
          this.gold += q.reward.gold;
          msg += ` 获得 ${q.reward.gold} 金币！`;
        }
        if (q.reward.item) {
          this.addItem(q.reward.item, q.reward.amount || 1);
          msg += ` 获得 ${ITEMS[q.reward.item]?.name}×${q.reward.amount || 1}！`;
        }
        this.showMessage(msg, 4000);
        this.spawnParticles(this.player.x, this.player.y, "#f0d040", 16);
      }
    });
  }

  checkAchievements() {
    if (!this.achievements.firstFish && (this.inventory.fish || 0) >= 1) {
      this.achievements.firstFish = true;
      this.showMessage("🏆 成就解锁：第一条鱼！", 3000);
    }
    if (!this.achievements.collect10wood && (this.inventory.wood || 0) >= 10) {
      this.achievements.collect10wood = true;
      this.showMessage("🏆 成就解锁：木材大师！", 3000);
    }
    if (!this.achievements.rich && this.gold >= 200) {
      this.achievements.rich = true;
      this.showMessage("🏆 成就解锁：小富翁！", 3000);
    }
  }

  showMessage(text, duration) {
    this.interactionMessage = text;
    this.messageTimer = duration;
  }

  // ====================================================
  //  渲染
  // ====================================================
  render() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.scene === SCENE.TITLE) { this.renderTitle(); return; }
    if (this.scene === SCENE.INDOOR) { this.renderIndoor(); this.renderHud(); this.renderMessage(); return; }
    if (this.scene === SCENE.SHOP)   { this.renderGame(); this.renderShop(); return; }
    if (this.scene === SCENE.DIALOGUE) { this.renderGame(); this.renderDialogue(); return; }
    if (this.scene === SCENE.INVENTORY) { this.renderGame(); this.renderInventory(); return; }
    if (this.scene === SCENE.FISHING) { this.renderGame(); this.renderFishing(); return; }

    this.renderGame();
  }

  // ---- 天空背景 ----
  renderSky() {
    const hour = this.gameMinutes / 60;
    const sky = getSkyColor(hour);
    this.ctx.fillStyle = sky;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // ---- 夜晚遮罩 ----
  renderNightOverlay() {
    const hour = this.gameMinutes / 60;
    let alpha = 0;
    if (hour >= 20) alpha = Math.min(0.55, (hour - 20) / 4 * 0.55);
    else if (hour < 6) alpha = 0.55;
    else if (hour < 7) alpha = Math.max(0, 0.55 - (hour - 6) * 0.55);
    if (alpha <= 0) return;
    this.ctx.fillStyle = `rgba(0, 0, 40, ${alpha})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderGame() {
    const { ctx } = this;
    ctx.save();
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    this.renderTileMap();
    this.renderInteractables();
    this.renderNpcs();
    this.renderPlayer();
    this.renderParticles();

    ctx.restore();

    this.renderNightOverlay();
    this.renderHud();
    this.renderMiniMap();
    this.renderQuestTracker();
    this.renderMessage();
  }

  renderTileMap() {
    const { ctx } = this;
    const startTX = Math.floor(this.camera.x / TILE_SIZE);
    const startTY = Math.floor(this.camera.y / TILE_SIZE);
    const endTX = Math.ceil((this.camera.x + this.canvas.width) / TILE_SIZE);
    const endTY = Math.ceil((this.camera.y + this.canvas.height) / TILE_SIZE);

    for (let ty = startTY; ty <= endTY; ty++) {
      for (let tx = startTX; tx <= endTX; tx++) {
        if (ty < 0 || ty >= MAP_H || tx < 0 || tx >= MAP_W) continue;
        const tile = this.tileMap[ty][tx];
        const px = tx * TILE_SIZE, py = ty * TILE_SIZE;
        ctx.fillStyle = TILE_COLORS[tile] || "#7ec850";
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

        // 花朵点缀
        if (tile === TILE.FLOWER) {
          ctx.fillStyle = ["#ff88aa","#ffcc44","#cc88ff"][(tx*7+ty*3)%3];
          ctx.beginPath();
          ctx.arc(px + 12 + (tx*5)%24, py + 10 + (ty*7)%24, 3, 0, Math.PI*2);
          ctx.fill();
        }
        // 深草纹路
        if (tile === TILE.DARK_GRASS) {
          ctx.strokeStyle = "rgba(0,80,0,0.2)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px + (tx*11)%30 + 6, py + 4);
          ctx.lineTo(px + (tx*11)%30 + 8, py + 14);
          ctx.stroke();
        }
        // 水波
        if (tile === TILE.WATER) {
          const wave = Math.sin((tx + ty + this.gameMinutes * 0.05) * 0.8) * 2;
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(px + 6, py + 20 + wave);
          ctx.lineTo(px + 42, py + 20 + wave);
          ctx.stroke();
        }
        // 网格线
        ctx.strokeStyle = "rgba(0,0,0,0.04)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  renderInteractables() {
    const { ctx } = this;
    this.interactables.forEach(obj => {
      const cx = obj.x + obj.w / 2;
      const cy = obj.y + obj.h / 2;
      const dist = Math.hypot(cx - this.player.x, cy - this.player.y);
      const highlighted = dist < INTERACT_DISTANCE;

      if (highlighted && !obj.collected) {
        ctx.save();
        ctx.shadowColor = "#fff176";
        ctx.shadowBlur = 16;
      }

      switch (obj.type) {
        case "tree":     this.drawTree(obj); break;
        case "flower":   this.drawFlower(obj); break;
        case "mushroom": this.drawMushroom(obj); break;
        case "stone":    this.drawStone(obj); break;
        case "fishspot": this.drawFishspot(obj); break;
        case "chest":    this.drawChest(obj); break;
        case "house":    this.drawHouse(obj); break;
        case "shop":     this.drawShop(obj); break;
        case "sign":     this.drawSign(obj); break;
        case "shell":    this.drawShell(obj); break;
      }

      if (highlighted && !obj.collected) ctx.restore();

      // 互动提示标签
      if (highlighted) {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillRect(obj.x + obj.w/2 - 28, obj.y - 24, 56, 18);
        ctx.fillStyle = "#333";
        ctx.font = "11px 'PingFang SC', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`[E] ${obj.name}`, obj.x + obj.w/2, obj.y - 10);
        ctx.textAlign = "left";
      }
    });
  }

  drawTree(obj) {
    const { ctx } = this;
    const faded = obj.collected;
    // 树干
    ctx.fillStyle = "#7a5c3a";
    ctx.fillRect(obj.x + 24, obj.y + 34, 16, 44);
    // 树冠
    ctx.fillStyle = faded ? "#9ac890" : (obj.extraItem ? "#c8d840" : "#52b840");
    ctx.beginPath(); ctx.arc(obj.x + 32, obj.y + 28, 32, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = faded ? "#b0e098" : (obj.extraItem ? "#e0f060" : "#68d050");
    ctx.beginPath(); ctx.arc(obj.x + 20, obj.y + 22, 18, 0, Math.PI*2); ctx.fill();
  }

  drawFlower(obj) {
    const { ctx } = this;
    if (obj.collected) {
      ctx.fillStyle = "#8eca66"; ctx.fillRect(obj.x, obj.y, 32, 32);
      return;
    }
    const colors = ["#ff6688","#ffcc00","#cc66ff","#ff9944"];
    const c = colors[(obj.x * 7 + obj.y * 3) % colors.length];
    ctx.fillStyle = "#5cb85c";
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI*2/5)*i;
      ctx.beginPath(); ctx.arc(obj.x+16+Math.cos(a)*8, obj.y+16+Math.sin(a)*8, 5, 0, Math.PI*2);
      ctx.fillStyle = c; ctx.fill();
    }
    ctx.fillStyle = "#ffe066";
    ctx.beginPath(); ctx.arc(obj.x+16, obj.y+16, 5, 0, Math.PI*2); ctx.fill();
  }

  drawMushroom(obj) {
    const { ctx } = this;
    const faded = obj.collected;
    ctx.fillStyle = faded ? "#c8a088" : "#d04020";
    ctx.beginPath();
    ctx.arc(obj.x + 18, obj.y + 14, 18, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#fff";
    if (!faded) {
      ctx.beginPath(); ctx.arc(obj.x+10, obj.y+10, 4, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(obj.x+24, obj.y+8, 3, 0, Math.PI*2); ctx.fill();
    }
    ctx.fillStyle = "#f0e8d0";
    ctx.fillRect(obj.x+12, obj.y+14, 12, 16);
  }

  drawStone(obj) {
    const { ctx } = this;
    ctx.fillStyle = obj.collected ? "#b0b8c0" : "#7e8e9a";
    ctx.beginPath(); ctx.ellipse(obj.x+29, obj.y+26, 28, 20, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = obj.collected ? "#c8d0d8" : "#a0b0bc";
    ctx.beginPath(); ctx.ellipse(obj.x+20, obj.y+20, 9, 7, 0, 0, Math.PI*2); ctx.fill();
  }

  drawFishspot(obj) {
    const { ctx } = this;
    const t = this.gameMinutes * 0.01;
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const r = 8 + i * 8;
      const a = t + i * 1.0;
      ctx.beginPath();
      ctx.arc(obj.x+20, obj.y+20, r, a, a + Math.PI*1.2); ctx.stroke();
    }
    ctx.fillStyle = "#fff176";
    ctx.font = "18px serif";
    ctx.fillText("🎣", obj.x + 6, obj.y + 30);
  }

  drawChest(obj) {
    const { ctx } = this;
    ctx.fillStyle = obj.collected ? "#8a7060" : "#c89040";
    ctx.fillRect(obj.x, obj.y + 14, obj.w, obj.h - 14);
    ctx.fillStyle = obj.collected ? "#706050" : "#a07020";
    ctx.fillRect(obj.x, obj.y, obj.w, 18);
    ctx.fillStyle = "#f0d060";
    ctx.beginPath(); ctx.arc(obj.x+obj.w/2, obj.y+22, 5, 0, Math.PI*2); ctx.fill();
    if (!obj.collected) {
      ctx.fillStyle = "#ffe066";
      ctx.font = "14px serif";
      ctx.fillText("✨", obj.x + obj.w/2 - 8, obj.y - 4);
    }
  }

  drawHouse(obj) {
    const { ctx } = this;
    ctx.fillStyle = "#f4e8c0";
    ctx.fillRect(obj.x, obj.y + 50, obj.w, obj.h - 50);
    ctx.fillStyle = "#d05030";
    ctx.beginPath();
    ctx.moveTo(obj.x - 10, obj.y + 50);
    ctx.lineTo(obj.x + obj.w/2, obj.y + 5);
    ctx.lineTo(obj.x + obj.w + 10, obj.y + 50);
    ctx.closePath(); ctx.fill();
    // 门
    ctx.fillStyle = "#8a5020";
    ctx.fillRect(obj.x + 66, obj.y + 95, 38, 55);
    // 窗
    ctx.fillStyle = "#9fd8ff";
    ctx.fillRect(obj.x + 18, obj.y + 70, 30, 28);
    ctx.fillRect(obj.x + obj.w - 48, obj.y + 70, 30, 28);
    // 名牌
    ctx.fillStyle = "#ffe8a0";
    ctx.fillRect(obj.x + 40, obj.y + 148, 90, 16);
    ctx.fillStyle = "#664422";
    ctx.font = "11px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(obj.name, obj.x + obj.w/2, obj.y + 160);
    ctx.textAlign = "left";
  }

  drawShop(obj) {
    const { ctx } = this;
    ctx.fillStyle = "#dce8f8";
    ctx.fillRect(obj.x, obj.y + 40, obj.w, obj.h - 40);
    ctx.fillStyle = "#5588cc";
    ctx.fillRect(obj.x, obj.y, obj.w, 44);
    // 招牌
    ctx.fillStyle = "#fff176";
    ctx.fillRect(obj.x + 30, obj.y + 6, 100, 28);
    ctx.fillStyle = "#333";
    ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("老陈商店 🛒", obj.x + obj.w/2, obj.y + 25);
    ctx.textAlign = "left";
    // 门
    ctx.fillStyle = "#4466aa";
    ctx.fillRect(obj.x + 60, obj.y + 80, 40, 60);
  }

  drawSign(obj) {
    const { ctx } = this;
    ctx.fillStyle = "#a07840";
    ctx.fillRect(obj.x + 12, obj.y, 6, 30);
    ctx.fillStyle = "#c8a060";
    ctx.fillRect(obj.x, obj.y, 30, 22);
    ctx.fillStyle = "#664422";
    ctx.font = "9px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("公告", obj.x + 15, obj.y + 15);
    ctx.textAlign = "left";
  }

  drawShell(obj) {
    const { ctx } = this;
    ctx.fillStyle = obj.collected ? "#e8d8c0" : "#f4a868";
    ctx.beginPath();
    ctx.ellipse(obj.x + 14, obj.y + 10, 13, 9, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = "#c87840"; ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(obj.x + 14, obj.y + 10);
      ctx.lineTo(obj.x + 14 + Math.cos(i * 0.7) * 10, obj.y + 10 + Math.sin(i*0.7)*6);
      ctx.stroke();
    }
  }

  renderNpcs() {
    const { ctx } = this;
    this.npcs.forEach(npc => {
      const size = npc.size;
      const dist = Math.hypot(npc.x - this.player.x, npc.y - this.player.y);
      const hl = dist < INTERACT_DISTANCE;

      // 阴影
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.beginPath(); ctx.ellipse(npc.x, npc.y + size/2 + 2, size/2, 5, 0, 0, Math.PI*2); ctx.fill();

      // 身体
      ctx.fillStyle = npc.color;
      ctx.fillRect(npc.x - size/2, npc.y - size/2, size, size);
      // 帽子
      ctx.fillStyle = npc.hatColor;
      ctx.fillRect(npc.x - size/2 + 2, npc.y - size/2 - 8, size - 4, 10);
      // 脸
      ctx.fillStyle = "#ffdbb0";
      ctx.fillRect(npc.x - 7, npc.y - size/2 + 2, 14, 10);
      // 眼睛
      ctx.fillStyle = "#333";
      ctx.fillRect(npc.x - 4, npc.y - size/2 + 4, 3, 3);
      ctx.fillRect(npc.x + 1, npc.y - size/2 + 4, 3, 3);

      // 名字
      ctx.fillStyle = hl ? "#fffde0" : "rgba(255,255,255,0.85)";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(npc.name, npc.x, npc.y - size/2 - 12);
      if (hl) {
        ctx.fillStyle = "#ffd740";
        ctx.font = "10px sans-serif";
        ctx.fillText("[E] 对话", npc.x, npc.y - size/2 - 24);
      }
      ctx.textAlign = "left";
    });
  }

  renderPlayer() {
    const { ctx } = this;
    const { x, y, size } = this.player;

    // 阴影
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath(); ctx.ellipse(x, y + size/2 + 2, size/2, 6, 0, 0, Math.PI*2); ctx.fill();

    // 身体（蓝色上衣）
    ctx.fillStyle = "#3a6abf";
    ctx.fillRect(x - size/2, y - size/2, size, size);
    // 腿（深色裤子）
    ctx.fillStyle = "#223355";
    ctx.fillRect(x - size/2, y + 2, size, size/2 - 2);
    // 脸
    ctx.fillStyle = "#ffdbb0";
    ctx.fillRect(x - 8, y - size/2 + 2, 16, 12);
    // 眼睛
    ctx.fillStyle = "#333";
    ctx.fillRect(x - 4, y - size/2 + 5, 3, 3);
    ctx.fillRect(x + 2, y - size/2 + 5, 3, 3);
    // 帽子
    ctx.fillStyle = "#c03020";
    ctx.fillRect(x - size/2 + 2, y - size/2 - 8, size - 4, 10);
    ctx.fillRect(x - size/2 - 2, y - size/2 + 2, size + 4, 4);
  }

  renderParticles() {
    const { ctx } = this;
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    });
  }

  // ---- HUD ----
  renderHud() {
    const { ctx, canvas } = this;
    const hour = Math.floor(this.gameMinutes / 60);
    const min = Math.floor(this.gameMinutes % 60);
    const timeStr = `${String(hour).padStart(2,"0")}:${String(min).padStart(2,"0")}`;

    // 顶部 HUD 背景
    ctx.fillStyle = "rgba(20,36,20,0.78)";
    ctx.fillRect(10, 10, 220, 80);

    // 金币
    ctx.fillStyle = "#f0d040";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`💰 ${this.gold} 金币`, 22, 38);

    // 时间和日期
    ctx.fillStyle = "#c8f0ff";
    ctx.font = "14px sans-serif";
    ctx.fillText(`⏰ 第${this.gameDay}天  ${timeStr}`, 22, 60);

    // 快捷物品
    const topItems = Object.entries(this.inventory).slice(0, 3);
    ctx.fillStyle = "#b8f0b8";
    ctx.font = "13px sans-serif";
    const itemStr = topItems.map(([k,v]) => `${ITEMS[k]?.icon||""}×${v}`).join("  ");
    ctx.fillText(itemStr || "背包空", 22, 80);

    // 操作提示
    ctx.fillStyle = "rgba(10,20,10,0.65)";
    ctx.fillRect(canvas.width - 240, 10, 230, 95);
    ctx.fillStyle = "#c8e8c8";
    ctx.font = "12px sans-serif";
    ctx.fillText("WASD/方向键 移动", canvas.width - 228, 32);
    ctx.fillText("E 互动/对话", canvas.width - 228, 50);
    ctx.fillText("I 查看背包", canvas.width - 228, 68);
    ctx.fillText("F5 存档", canvas.width - 228, 86);
    ctx.fillText("空格 钓鱼收杆", canvas.width - 228, 100);
  }

  renderMiniMap() {
    const { ctx } = this;
    const mw = 100, mh = 80, mx = this.canvas.width - 120, my = 120;
    const scaleX = mw / (MAP_W * TILE_SIZE);
    const scaleY = mh / (MAP_H * TILE_SIZE);

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(mx - 2, my - 2, mw + 4, mh + 4);

    // 地图色块
    for (let ty = 0; ty < MAP_H; ty++) {
      for (let tx = 0; tx < MAP_W; tx++) {
        const tile = this.tileMap[ty][tx];
        ctx.fillStyle = tile === TILE.WATER ? "#4488cc" : tile === TILE.PATH ? "#c8a868" : tile === TILE.SAND ? "#d4c878" : "#60b040";
        ctx.fillRect(mx + tx * mw/MAP_W, my + ty * mh/MAP_H, mw/MAP_W + 1, mh/MAP_H + 1);
      }
    }

    // NPC 点
    this.npcs.forEach(npc => {
      ctx.fillStyle = npc.color;
      ctx.beginPath();
      ctx.arc(mx + npc.x * scaleX, my + npc.y * scaleY, 2, 0, Math.PI*2);
      ctx.fill();
    });

    // 玩家点
    ctx.fillStyle = "#ff4444";
    ctx.beginPath();
    ctx.arc(mx + this.player.x * scaleX, my + this.player.y * scaleY, 3, 0, Math.PI*2);
    ctx.fill();

    ctx.strokeStyle = "#88cc88";
    ctx.lineWidth = 1;
    ctx.strokeRect(mx, my, mw, mh);
  }

  renderQuestTracker() {
    const { ctx, canvas } = this;
    const activeQuests = this.quests.filter(q => !q.done).slice(0, 2);
    if (activeQuests.length === 0) return;

    const x = 10, y = canvas.height - 110;
    ctx.fillStyle = "rgba(20,36,20,0.78)";
    ctx.fillRect(x, y, 220, 100);
    ctx.fillStyle = "#f0d060";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("📋 任务", x + 12, y + 20);
    activeQuests.forEach((q, i) => {
      ctx.fillStyle = "#c8f8c8";
      ctx.font = "12px sans-serif";
      ctx.fillText(`▸ ${q.title}`, x + 12, y + 40 + i * 24);
      ctx.fillStyle = "#88c888";
      ctx.font = "11px sans-serif";
      ctx.fillText(q.desc, x + 12, y + 54 + i * 24);
    });
  }

  renderMessage() {
    const { ctx, canvas } = this;
    if (!this.interactionMessage) return;
    const text = this.interactionMessage;
    const w = Math.min(ctx.measureText(text).width + 40, canvas.width - 40);
    const x = (canvas.width - w) / 2;
    const y = canvas.height - 60;
    ctx.fillStyle = "rgba(10,20,10,0.88)";
    ctx.fillRect(x, y, w, 36);
    ctx.strokeStyle = "#88cc88";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, 36);
    ctx.fillStyle = "#f0ffe0";
    ctx.font = "14px 'PingFang SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width/2, y + 23);
    ctx.textAlign = "left";
  }

  // ---- 标题页 ----
  renderTitle() {
    const { ctx, canvas } = this;
    // 天空渐变
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#9fd8ff");
    grad.addColorStop(1, "#c8f0b0");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 草地
    ctx.fillStyle = "#8ac47a";
    ctx.fillRect(0, canvas.height * 0.62, canvas.width, canvas.height * 0.38);

    // 小屋
    ctx.fillStyle = "#f4dfb8"; ctx.fillRect(540, 200, 180, 130);
    ctx.fillStyle = "#d17d5c";
    ctx.beginPath(); ctx.moveTo(525, 200); ctx.lineTo(630, 135); ctx.lineTo(735, 200); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#8a5020"; ctx.fillRect(610, 260, 40, 70);
    ctx.fillStyle = "#9fd8ff"; ctx.fillRect(550, 220, 36, 30); ctx.fillRect(660, 220, 36, 30);

    // 树
    ctx.fillStyle = "#7a5c3a"; ctx.fillRect(150, 220, 18, 60);
    ctx.fillStyle = "#4a9838";
    ctx.beginPath(); ctx.arc(159, 190, 46, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#68c050";
    ctx.beginPath(); ctx.arc(148, 178, 24, 0, Math.PI*2); ctx.fill();

    // 树2
    ctx.fillStyle = "#7a5c3a"; ctx.fillRect(380, 240, 14, 50);
    ctx.fillStyle = "#52b030";
    ctx.beginPath(); ctx.arc(387, 216, 36, 0, Math.PI*2); ctx.fill();

    // 花朵
    ["#ff6688","#ffcc44","#cc66ff"].forEach((c,i) => {
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(100 + i*260, canvas.height*0.63, 8, 0, Math.PI*2); ctx.fill();
    });

    // 标题板
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillRect(180, 50, 440, 130);
    ctx.strokeStyle = "#88aa66"; ctx.lineWidth = 3;
    ctx.strokeRect(180, 50, 440, 130);

    ctx.fillStyle = "#2d5a1e";
    ctx.font = "bold 52px 'PingFang SC', 'Microsoft YaHei', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🌿 温馨小镇 🌿", canvas.width/2, 115);

    ctx.fillStyle = "#557744";
    ctx.font = "18px sans-serif";
    ctx.fillText("动物森友会风格 2D 小游戏", canvas.width/2, 148);
    ctx.textAlign = "left";

    // 功能列表
    const features = ["🏡 探索小镇  🗣️ 与居民对话  🎣 钓鱼小游戏","🌸 采集资源  🛒 商店买卖  📋 完成任务","⏰ 昼夜系统  🗺️ 小地图  💾 存档功能"];
    features.forEach((f, i) => {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(f, canvas.width/2, 310 + i * 26);
    });

    // 闪烁的开始提示
    const blink = Math.floor(this.lastTime / 500) % 2 === 0;
    if (blink) {
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("▶  按 Enter 开始游戏  ◀", canvas.width/2, 420);
    }
    ctx.textAlign = "left";
  }

  // ---- 对话框 ----
  renderDialogue() {
    const { ctx, canvas } = this;
    const npc = this.dialogueTarget;
    if (!npc) return;
    const sets = NPC_DIALOGUES[npc.name] || [["你好！"]];
    const pages = sets[this.dialogueSet % sets.length];
    const text = pages[this.dialoguePage] || "";

    // 背景
    ctx.fillStyle = "rgba(10,28,10,0.9)";
    ctx.fillRect(40, canvas.height - 150, canvas.width - 80, 120);
    ctx.strokeStyle = npc.hatColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(40, canvas.height - 150, canvas.width - 80, 120);

    // NPC 头像框
    ctx.fillStyle = npc.color;
    ctx.fillRect(55, canvas.height - 140, 60, 60);
    ctx.fillStyle = npc.hatColor;
    ctx.fillRect(57, canvas.height - 148, 56, 12);
    ctx.fillStyle = "#ffdbb0";
    ctx.fillRect(68, canvas.height - 132, 18, 14);

    // 名字
    ctx.fillStyle = npc.hatColor;
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(npc.name, 126, canvas.height - 118);

    // 文字
    ctx.fillStyle = "#f0ffe0";
    ctx.font = "16px 'PingFang SC', sans-serif";
    ctx.fillText(text, 126, canvas.height - 95);

    // 翻页提示
    const isLast = this.dialoguePage >= pages.length - 1;
    ctx.fillStyle = "#88cc88";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(isLast ? "[ E ] 结束对话" : "[ E ] 继续", canvas.width - 55, canvas.height - 45);
    ctx.textAlign = "left";

    // 页码
    if (pages.length > 1) {
      ctx.fillStyle = "#668866";
      ctx.font = "12px sans-serif";
      ctx.fillText(`${this.dialoguePage + 1}/${pages.length}`, 126, canvas.height - 45);
    }
  }

  // ---- 商店 ----
  renderShop() {
    const { ctx, canvas } = this;
    const buyList = Object.keys(ITEMS).filter(k => ITEMS[k].buyPrice > 0);
    const sellList = Object.keys(this.inventory).filter(k => this.inventory[k] > 0);
    const list = this.shopMode === "buy" ? buyList : sellList;

    const panelW = 460, panelH = 340;
    const px = (canvas.width - panelW) / 2;
    const py = (canvas.height - panelH) / 2;

    ctx.fillStyle = "rgba(10,28,10,0.95)";
    ctx.fillRect(px, py, panelW, panelH);
    ctx.strokeStyle = "#88cc66";
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, panelW, panelH);

    // 标题
    ctx.fillStyle = "#f0d060";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🛒 老陈的商店", canvas.width/2, py + 30);

    // 标签页
    const modes = ["购买", "出售"];
    modes.forEach((m, i) => {
      const active = (i === 0 && this.shopMode === "buy") || (i === 1 && this.shopMode === "sell");
      ctx.fillStyle = active ? "#88cc66" : "#446644";
      ctx.fillRect(px + 10 + i * 120, py + 44, 110, 26);
      ctx.fillStyle = active ? "#001800" : "#88cc88";
      ctx.font = "14px sans-serif";
      ctx.fillText(m, px + 10 + i * 120 + 55, py + 62);
    });
    ctx.fillStyle = "#668866"; ctx.font = "12px sans-serif";
    ctx.fillText("Tab 切换", px + panelW - 100, py + 62);

    // 金币
    ctx.fillStyle = "#f0d060"; ctx.font = "16px sans-serif";
    ctx.fillText(`💰 ${this.gold}`, px + panelW - 90, py + 30);
    ctx.textAlign = "left";

    // 列表
    if (list.length === 0) {
      ctx.fillStyle = "#668866"; ctx.font = "15px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("没有可以" + (this.shopMode === "buy" ? "购买" : "出售") + "的物品", canvas.width/2, py + 180);
      ctx.textAlign = "left";
    }
    list.forEach((key, i) => {
      const item = ITEMS[key];
      const iy = py + 82 + i * 38;
      const selected = i === this.shopSelection;
      if (selected) {
        ctx.fillStyle = "rgba(100,180,80,0.25)";
        ctx.fillRect(px + 10, iy - 18, panelW - 20, 34);
        ctx.strokeStyle = "#88cc66"; ctx.lineWidth = 1;
        ctx.strokeRect(px + 10, iy - 18, panelW - 20, 34);
      }
      ctx.fillStyle = selected ? "#f0ffe0" : "#c8e8c8";
      ctx.font = "15px sans-serif";
      ctx.fillText(`${item.icon} ${item.name}`, px + 24, iy);
      ctx.fillStyle = "#88aaaa"; ctx.font = "12px sans-serif";
      ctx.fillText(item.desc, px + 130, iy);
      const price = this.shopMode === "buy" ? item.buyPrice : item.sellPrice;
      const have = this.inventory[key] || 0;
      ctx.fillStyle = "#f0d060"; ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`${price}金  (持有:${have})`, px + panelW - 14, iy);
      ctx.textAlign = "left";
    });

    // 底部提示
    ctx.fillStyle = "#668866"; ctx.font = "13px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("↑↓ 选择  E/Enter 确认  ESC 关闭", canvas.width/2, py + panelH - 14);
    ctx.textAlign = "left";
  }

  // ---- 背包 ----
  renderInventory() {
    const { ctx, canvas } = this;
    const panelW = 480, panelH = 340;
    const px = (canvas.width - panelW) / 2;
    const py = (canvas.height - panelH) / 2;

    ctx.fillStyle = "rgba(10,28,10,0.95)";
    ctx.fillRect(px, py, panelW, panelH);
    ctx.strokeStyle = "#88cc66"; ctx.lineWidth = 2;
    ctx.strokeRect(px, py, panelW, panelH);

    ctx.fillStyle = "#f0d060"; ctx.font = "bold 20px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("🎒 背包", canvas.width/2, py + 30);
    ctx.fillStyle = "#f0d060"; ctx.font = "16px sans-serif";
    ctx.fillText(`💰 ${this.gold} 金币`, canvas.width/2, py + 54);

    const entries = Object.entries(this.inventory);
    if (entries.length === 0) {
      ctx.fillStyle = "#668866"; ctx.font = "15px sans-serif";
      ctx.fillText("背包是空的", canvas.width/2, py + 180);
    } else {
      entries.forEach(([key, count], i) => {
        const col = i % 4, row = Math.floor(i / 4);
        const bx = px + 24 + col * 110, by = py + 76 + row * 80;
        ctx.fillStyle = "rgba(60,100,60,0.6)";
        ctx.fillRect(bx, by, 96, 66);
        ctx.strokeStyle = "#448844"; ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, 96, 66);
        ctx.font = "28px serif"; ctx.textAlign = "center";
        ctx.fillText(ITEMS[key]?.icon || "?", bx + 48, by + 36);
        ctx.fillStyle = "#c8e8c8"; ctx.font = "12px sans-serif";
        ctx.fillText(ITEMS[key]?.name || key, bx + 48, by + 52);
        ctx.fillStyle = "#f0d060"; ctx.font = "bold 14px sans-serif";
        ctx.fillText(`×${count}`, bx + 48, by + 66);
      });
    }

    ctx.fillStyle = "#668866"; ctx.font = "13px sans-serif";
    ctx.fillText("ESC / I 关闭", canvas.width/2, py + panelH - 14);
    ctx.textAlign = "left";
  }

  // ---- 钓鱼小游戏 ----
  renderFishing() {
    const { ctx, canvas } = this;

    // 半透明遮罩
    ctx.fillStyle = "rgba(0,20,60,0.55)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const panelW = 220, panelH = 340;
    const px = canvas.width/2 - panelW/2;
    const py = canvas.height/2 - panelH/2;

    ctx.fillStyle = "rgba(10,40,80,0.92)";
    ctx.fillRect(px, py, panelW, panelH);
    ctx.strokeStyle = "#4fa8e0"; ctx.lineWidth = 2;
    ctx.strokeRect(px, py, panelW, panelH);

    ctx.fillStyle = "#c8e8ff"; ctx.font = "bold 18px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("🎣 钓鱼", canvas.width/2, py + 28);

    if (this.fishingState === "casting" || this.fishingState === "biting") {
      ctx.fillStyle = "#88ccff"; ctx.font = "14px sans-serif";
      ctx.fillText(this.fishingState === "casting" ? "等待鱼上钩…" : "🐟 鱼上钩了！", canvas.width/2, py + 170);
      if (this.fishingState === "biting") {
        ctx.fillStyle = "#ffe066"; ctx.font = "bold 16px sans-serif";
        ctx.fillText("快按 E 或 空格！", canvas.width/2, py + 200);
        const blink = Math.floor(this.lastTime / 300) % 2 === 0;
        if (blink) {
          ctx.fillStyle = "#ff6666"; ctx.font = "22px sans-serif";
          ctx.fillText("‼", canvas.width/2, py + 230);
        }
      } else {
        // 钓鱼动画
        const t = this.lastTime / 800;
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = `rgba(100,180,255,${0.3 + i*0.2})`;
          ctx.beginPath();
          const r = 15 + i * 12 + Math.sin(t + i) * 4;
          ctx.arc(canvas.width/2, py + 180, r, 0, Math.PI*2); ctx.fill();
        }
      }
    }

    if (this.fishingState === "reeling") {
      const trackX = px + 30, trackY = py + 50, trackW = 30, trackH = 240;
      // 轨道
      ctx.fillStyle = "rgba(100,200,255,0.2)";
      ctx.fillRect(trackX, trackY, trackW, trackH);
      // 鱼位置
      ctx.fillStyle = "#4fa8e0";
      ctx.beginPath(); ctx.arc(trackX + trackW/2, py + 50 + (this.fishingFishY / 320) * trackH, 14, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "16px serif"; ctx.textAlign = "center";
      ctx.fillText("🐟", trackX + trackW/2, py + 50 + (this.fishingFishY / 320) * trackH + 6);

      // 玩家条
      const barH = 50;
      const barY = py + 50 + (this.fishingBarY / 320) * trackH;
      ctx.fillStyle = "rgba(100,255,100,0.6)";
      ctx.fillRect(trackX + trackW + 8, barY, 20, (barH / 320) * trackH);
      ctx.strokeStyle = "#88ff88"; ctx.lineWidth = 1;
      ctx.strokeRect(trackX + trackW + 8, barY, 20, (barH / 320) * trackH);

      // 进度条
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(px + 90, py + 60, 30, 220);
      ctx.fillStyle = `hsl(${this.fishingProgress * 1.2}, 90%, 55%)`;
      ctx.fillRect(px + 90, py + 60 + (1 - this.fishingProgress/100)*220, 30, (this.fishingProgress/100)*220);
      ctx.strokeStyle = "#88cc88"; ctx.lineWidth = 1;
      ctx.strokeRect(px + 90, py + 60, 30, 220);

      ctx.fillStyle = "#c8f0ff"; ctx.font = "13px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("空格/E 向上", canvas.width/2, py + panelH - 14);
    }

    if (this.fishingState === "result" && this.fishingResult) {
      const fish = this.fishingResult;
      ctx.fillStyle = "#f0d060"; ctx.font = "36px serif"; ctx.textAlign = "center";
      ctx.fillText(fish.icon, canvas.width/2, py + 160);
      ctx.fillStyle = "#f0ffe0"; ctx.font = "bold 18px sans-serif";
      ctx.fillText(`钓到 ${fish.name}！`, canvas.width/2, py + 200);
      ctx.fillStyle = "#88ccff"; ctx.font = "14px sans-serif";
      ctx.fillText(`价值: ${fish.score * 12} 金币`, canvas.width/2, py + 226);
      ctx.fillStyle = "#88cc88"; ctx.font = "13px sans-serif";
      ctx.fillText("按 E 继续", canvas.width/2, py + panelH - 14);
    }

    ctx.textAlign = "left";
  }

  // ---- 室内 ----
  renderIndoor() {
    const { ctx, canvas } = this;
    // 木地板背景
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 10; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#c8964a" : "#b87c38";
        ctx.fillRect(x * 80, y * 56 + 10, 80, 56);
      }
    }

    // 家具
    // 沙发
    ctx.fillStyle = "#8855aa";
    ctx.fillRect(100, 60, 200, 80);
    ctx.fillStyle = "#aa77cc";
    ctx.fillRect(100, 60, 200, 30);

    // 桌子
    ctx.fillStyle = "#c89040";
    ctx.fillRect(380, 80, 140, 80);
    ctx.fillStyle = "#a07030";
    ctx.fillRect(390, 160, 20, 30);
    ctx.fillRect(490, 160, 20, 30);

    // 书架
    ctx.fillStyle = "#8a6030";
    ctx.fillRect(560, 30, 60, 140);
    ["#cc4444","#4488cc","#44aa44","#eecc44"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(566, 40 + i*30, 10, 24);
    });

    // 植物
    ctx.fillStyle = "#6a4020";
    ctx.fillRect(30, 170, 16, 30);
    ctx.fillStyle = "#3a9830";
    ctx.beginPath(); ctx.arc(38, 165, 22, 0, Math.PI*2); ctx.fill();

    // 提示文字
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(200, 360, 400, 50);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("🏠 你的温馨小屋  按 E 或 ESC 离开", canvas.width/2, 392);
    ctx.textAlign = "left";
  }
}