// =============================================
// 温馨小镇 - 长线生活模拟版
// =============================================

const SCENE = {
  TITLE: "title",
  PLAYING: "playing",
  SHOP: "shop",
  DIALOGUE: "dialogue",
  FISHING: "fishing",
  INVENTORY: "inventory",
  INDOOR: "indoor",
};

const TILE = {
  GRASS: 0,
  PATH: 1,
  WATER: 2,
  SAND: 3,
  FLOWER: 4,
  DARK_GRASS: 5,
  WOOD_FLOOR: 6,
  FARM_SOIL: 7,
};

const TILE_COLORS = {
  [TILE.GRASS]: "#7ec850",
  [TILE.PATH]: "#d9bf96",
  [TILE.WATER]: "#4fa8e0",
  [TILE.SAND]: "#e8d9a0",
  [TILE.FLOWER]: "#7ec850",
  [TILE.DARK_GRASS]: "#5fa840",
  [TILE.WOOD_FLOOR]: "#c8964a",
  [TILE.FARM_SOIL]: "#8d6236",
};

const TILE_SIZE = 48;
const INTERACT_DISTANCE = 90;
const MAP_W = 30;
const MAP_H = 26;
const TIME_SPEED = 0.6;

const SKY_COLORS = [
  { hour: 0, color: "#1a1a3a" },
  { hour: 5, color: "#2d1b4e" },
  { hour: 6, color: "#e87c35" },
  { hour: 8, color: "#9fd8ff" },
  { hour: 12, color: "#6bbfff" },
  { hour: 17, color: "#f4a55a" },
  { hour: 20, color: "#4a3070" },
  { hour: 24, color: "#1a1a3a" },
];

const DISTRICTS = [
  { name: "🌻 农场区", x: 80, y: 690, w: 360, h: 250 },
  { name: "🏘️ 住宅区", x: 500, y: 80, w: 280, h: 260 },
  { name: "🛒 商店区", x: 780, y: 80, w: 250, h: 230 },
  { name: "🎣 湖滨区", x: 600, y: 230, w: 260, h: 220 },
  { name: "🌲 林地区", x: 1040, y: 120, w: 300, h: 380 },
  { name: "🏛️ 广场区", x: 320, y: 500, w: 310, h: 170 },
];

const ITEMS = {
  wood: { name: "木材", icon: "🪵", sellPrice: 6, buyPrice: 18, desc: "建造材料" },
  fruit: { name: "果子", icon: "🍎", sellPrice: 10, buyPrice: 24, desc: "新鲜水果" },
  fish: { name: "普通鱼", icon: "🐟", sellPrice: 18, buyPrice: 0, desc: "常见河鱼" },
  nightFish: { name: "夜行鱼", icon: "🌙🐠", sellPrice: 36, buyPrice: 0, desc: "只在夜晚活跃" },
  flower: { name: "花", icon: "🌸", sellPrice: 8, buyPrice: 0, desc: "野花" },
  stone: { name: "石头", icon: "🪨", sellPrice: 5, buyPrice: 14, desc: "坚硬石材" },
  mushroom: { name: "蘑菇", icon: "🍄", sellPrice: 14, buyPrice: 0, desc: "林地采集物" },
  shell: { name: "贝壳", icon: "🐚", sellPrice: 12, buyPrice: 0, desc: "海滩采集物" },
  turnip: { name: "萝卜", icon: "🥕", sellPrice: 18, buyPrice: 0, desc: "短周期作物" },
  potato: { name: "土豆", icon: "🥔", sellPrice: 30, buyPrice: 0, desc: "中期作物" },
  blueberry: { name: "蓝莓", icon: "🫐", sellPrice: 48, buyPrice: 0, desc: "高价值作物" },
  pumpkin: { name: "南瓜", icon: "🎃", sellPrice: 82, buyPrice: 0, desc: "后期高收益" },
  seed_turnip: { name: "萝卜种子", icon: "🌱", sellPrice: 2, buyPrice: 14, desc: "2天成熟" },
  seed_potato: { name: "土豆种子", icon: "🌾", sellPrice: 3, buyPrice: 24, desc: "3天成熟" },
  seed_blueberry: { name: "蓝莓种子", icon: "🫐", sellPrice: 4, buyPrice: 34, desc: "4天成熟" },
  seed_pumpkin: { name: "南瓜种子", icon: "🎃", sellPrice: 5, buyPrice: 52, desc: "5天成熟" },
};

const CROPS = {
  turnip: { name: "萝卜", seed: "seed_turnip", harvest: "turnip", growDays: 2, stages: 3, yield: [1, 2], unlock: 1, waterNeed: 2 },
  potato: { name: "土豆", seed: "seed_potato", harvest: "potato", growDays: 3, stages: 4, yield: [1, 2], unlock: 1, waterNeed: 3 },
  blueberry: { name: "蓝莓", seed: "seed_blueberry", harvest: "blueberry", growDays: 4, stages: 4, yield: [2, 3], unlock: 2, waterNeed: 4 },
  pumpkin: { name: "南瓜", seed: "seed_pumpkin", harvest: "pumpkin", growDays: 5, stages: 5, yield: [1, 2], unlock: 3, waterNeed: 5 },
};

const NPCS = [
  { id: "npc-lingling", name: "小玲", baseX: 450, baseY: 300, color: "#e888aa", hatColor: "#ff6688", likes: ["flower", "blueberry"] },
  { id: "npc-chen", name: "老陈", baseX: 870, baseY: 280, color: "#8855aa", hatColor: "#aa44cc", likes: ["potato", "wood"] },
  { id: "npc-maomao", name: "毛毛", baseX: 300, baseY: 620, color: "#f0c040", hatColor: "#e0a020", likes: ["fish", "nightFish"] },
  { id: "npc-zhuang", name: "阿壮", baseX: 700, baseY: 650, color: "#55aa55", hatColor: "#339933", likes: ["pumpkin", "mushroom"] },
  { id: "npc-yufu", name: "渔夫阿海", baseX: 640, baseY: 290, color: "#4f8cc9", hatColor: "#2b6ca5", likes: ["nightFish", "fish"] },
  { id: "npc-mia", name: "米娅", baseX: 1040, baseY: 220, color: "#c986c9", hatColor: "#934ba4", likes: ["flower", "pumpkin"] },
];

function lerpColor(c1, c2, t) {
  const parse = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const [r1, g1, b1] = parse(c1);
  const [r2, g2, b2] = parse(c2);
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
}

function getSkyColor(hour) {
  for (let i = 0; i < SKY_COLORS.length - 1; i++) {
    const a = SKY_COLORS[i], b = SKY_COLORS[i + 1];
    if (hour >= a.hour && hour < b.hour) {
      return lerpColor(a.color, b.color, (hour - a.hour) / (b.hour - a.hour));
    }
  }
  return "#1a1a3a";
}

export class CozyPrototypeGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.scene = SCENE.TITLE;
    this.lastTime = 0;
    this.keys = new Set();
    this.camera = { x: 0, y: 0 };
    this.interactionMessage = "";
    this.messageTimer = 0;

    this.gameMinutes = 8 * 60;
    this.gameDay = 1;
    this.gold = 120;

    this.player = { x: 420, y: 420, size: 26, speed: 185, facing: "down", name: "旅行者" };
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.walkCycle = 0;
    this.player.idlePhase = 0;
    this.player.isMoving = false;
    this.player.stepTimer = 0;
    this.inventory = { seed_turnip: 3, wood: 2 };
    this.selectedSeedIndex = 0;

    this.progress = {
      houseLevel: 1,
      farmLevel: 1,
      bridgeRepaired: false,
      eastUnlocked: false,
      harvestCount: 0,
      fishCaught: 0,
      totalEarned: 0,
      townRank: 1,
    };

    this.relationship = {};
    this.dailyActions = { talked: {}, gifted: {} };
    this.floatingTexts = [];
    this.achievementUnlocked = [];

    this.tileMap = this.createTileMap();
    this.interactables = this.createInteractables();
    this.npcs = this.createNpcs();
    this.farmPlots = this.createFarmPlots();
    this.decorations = this.createDecorations();

    this.dialogueTarget = null;
    this.dialoguePages = [];
    this.dialoguePage = 0;

    this.shopMode = "buy";
    this.shopSelection = 0;

    this.fishingState = "casting";
    this.fishingTimer = 0;
    this.fishingResult = null;
    this.fishingBarY = 180;
    this.fishingBarVel = 0;
    this.fishingFishY = 140;
    this.fishingFishDir = 1;
    this.fishingProgress = 0;

    this.quests = this.createQuests();
    this.particles = [];

    this.bindEvents();
    this.loadSave();
  }

  createTileMap() {
    return [
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
  }

  createFarmPlots() {
    const plots = [];
    const startX = 120;
    const startY = 730;
    const cols = 5;
    const rows = 4;
    let id = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        plots.push({ id: `plot-${id++}`, x: startX + x * 54, y: startY + y * 54, w: 44, h: 44, tilled: false, watered: false, cropKey: null, stage: 0, growthMinutes: 0, wateredDays: 0, ready: false, lockedLevel: y >= 2 ? 2 : 1 });
      }
    }
    return plots;
  }

  createDecorations() {
    const list = [];
    for (let i = 0; i < 26; i++) {
      list.push({ type: "bush", x: 70 + (i % 13) * 95, y: 48 + Math.floor(i / 13) * 840 + (i % 4) * 8, v: i % 3 });
    }
    for (let i = 0; i < 15; i++) {
      list.push({ type: "fence", x: 82 + i * 24, y: 706 });
    }
    for (let i = 0; i < 7; i++) {
      list.push({ type: "lamp", x: 346 + i * 154, y: 560 + (i % 2) * 12 });
    }
    for (let i = 0; i < 25; i++) {
      list.push({ type: "pebble", x: 300 + i * 26, y: 610 + Math.sin(i) * 10 });
    }
    for (let i = 0; i < 18; i++) {
      list.push({ type: "stump", x: 1020 + (i % 6) * 48 + (i % 2) * 10, y: 160 + Math.floor(i / 6) * 72 });
    }
    return list;
  }

  createInteractables() {
    return [
      { id:"tree-1",type:"tree",x:80,y:80,w:64,h:78,item:"wood",amount:1,collected:false,regrowTimer:0,regrowTime:60000,name:"大橡树" },
      { id:"tree-2",type:"tree",x:200,y:100,w:64,h:78,item:"wood",amount:1,collected:false,regrowTimer:0,regrowTime:55000,name:"小枫树" },
      { id:"tree-3",type:"tree",x:960,y:160,w:64,h:78,item:"wood",amount:2,collected:false,regrowTimer:0,regrowTime:70000,name:"果树",extraItem:"fruit" },
      { id:"tree-4",type:"tree",x:1130,y:90,w:64,h:78,item:"wood",amount:1,collected:false,regrowTimer:0,regrowTime:60000,name:"松树",eastOnly:true },
      { id:"flower-1",type:"flower",x:160,y:200,w:32,h:32,item:"flower",amount:1,collected:false,regrowTimer:0,regrowTime:40000,name:"野花丛" },
      { id:"flower-2",type:"flower",x:1050,y:200,w:32,h:32,item:"flower",amount:1,collected:false,regrowTimer:0,regrowTime:40000,name:"紫罗兰",eastOnly:true },
      { id:"mush-1",type:"mushroom",x:320,y:340,w:36,h:36,item:"mushroom",amount:1,collected:false,regrowTimer:0,regrowTime:90000,name:"红蘑菇" },
      { id:"mush-2",type:"mushroom",x:1180,y:380,w:36,h:36,item:"mushroom",amount:2,collected:false,regrowTimer:0,regrowTime:90000,name:"棕蘑菇",eastOnly:true },
      { id:"stone-1",type:"stone",x:500,y:480,w:58,h:44,item:"stone",amount:1,collected:false,regrowTimer:0,regrowTime:120000,name:"圆石" },
      { id:"stone-2",type:"stone",x:830,y:500,w:58,h:44,item:"stone",amount:1,collected:false,regrowTimer:0,regrowTime:120000,name:"大岩石",eastOnly:true },
      { id:"shell-1",type:"shell",x:100,y:430,w:28,h:20,item:"shell",amount:1,collected:false,regrowTimer:0,regrowTime:50000,name:"贝壳" },
      { id:"shell-2",type:"shell",x:180,y:460,w:28,h:20,item:"shell",amount:1,collected:false,regrowTimer:0,regrowTime:50000,name:"螺壳" },
      { id:"fish-1",type:"fishspot",x:680,y:290,w:40,h:40,item:null,amount:0,collected:false,regrowTimer:0,regrowTime:0,name:"钓鱼点" },
      { id:"house-1",type:"house",x:560,y:130,w:170,h:150,name:"你的小屋" },
      { id:"shop-1",type:"shop",x:820,y:130,w:160,h:140,name:"老陈的商店" },
      { id:"sign-1",type:"sign",x:400,y:530,w:30,h:44,name:"公告牌",text:"每日节奏：收菜→补种→采集→钓鱼→商店→社交→推进建设" },
      { id:"bridge-1",type:"bridge",x:1018,y:520,w:110,h:54,name:"旧桥" },
    ];
  }

  createNpcs() {
    return NPCS.map((n) => {
      this.relationship[n.id] = 0;
      return { ...n, size: 26, x: n.baseX, y: n.baseY, moveTimer: 0, vx: 0, vy: 0 };
    });
  }

  createQuests() {
    return [
      { id: "daily-farm", chain: 1, title: "农场起步", desc: "播种并收获 5 次作物", done: false, check: () => this.progress.harvestCount >= 5, reward: { gold: 100 } },
      { id: "daily-farm-2", chain: 1, title: "稳定供货", desc: "播种并收获 18 次作物", done: false, check: () => this.progress.harvestCount >= 18, unlockWhen: "daily-farm", reward: { item: "seed_blueberry", amount: 6 } },
      { id: "builder", chain: 2, title: "家园建设", desc: "将小屋升级到 2 级", done: false, check: () => this.progress.houseLevel >= 2, reward: { gold: 140 } },
      { id: "builder-2", chain: 2, title: "繁荣家园", desc: "将小屋升级到 3 级", done: false, check: () => this.progress.houseLevel >= 3, unlockWhen: "builder", reward: { item: "seed_pumpkin", amount: 4 } },
      { id: "social", chain: 3, title: "邻里关系", desc: "任意 NPC 好感达到 30", done: false, check: () => Object.values(this.relationship).some(v => v >= 30), reward: { gold: 140 } },
      { id: "social-2", chain: 3, title: "社区明星", desc: "任意 3 名 NPC 好感达到 40", done: false, check: () => Object.values(this.relationship).filter(v => v >= 40).length >= 3, unlockWhen: "social", reward: { gold: 240 } },
      { id: "bridge", chain: 4, title: "通往东区", desc: "修复旧桥并解锁东区", done: false, check: () => this.progress.bridgeRepaired, reward: { item: "seed_pumpkin", amount: 3 } },
      { id: "town", chain: 5, title: "镇子繁荣", desc: "累计赚到 2500 金币", done: false, check: () => this.progress.totalEarned >= 2500, reward: { gold: 300 } },
    ];
  }

  saveGame() {
    const data = {
      gold: this.gold,
      inventory: this.inventory,
      gameDay: this.gameDay,
      gameMinutes: this.gameMinutes,
      player: { x: this.player.x, y: this.player.y },
      interactables: this.interactables.map(o => ({ id: o.id, collected: o.collected, regrowTimer: o.regrowTimer || 0 })),
      farmPlots: this.farmPlots,
      progress: this.progress,
      relationship: this.relationship,
      achievementUnlocked: this.achievementUnlocked,
    };
    try { localStorage.setItem("cozytown_save", JSON.stringify(data)); } catch (e) {}
    this.showMessage("游戏已保存 💾", 2000);
  }

  loadSave() {
    try {
      const raw = localStorage.getItem("cozytown_save");
      if (!raw) return;
      const data = JSON.parse(raw);
      this.gold = data.gold ?? this.gold;
      this.inventory = data.inventory ?? this.inventory;
      this.gameDay = data.gameDay ?? this.gameDay;
      this.gameMinutes = data.gameMinutes ?? this.gameMinutes;
      if (data.player) Object.assign(this.player, data.player);
      if (data.interactables) {
        data.interactables.forEach((saved) => {
          const obj = this.interactables.find(o => o.id === saved.id);
          if (obj) {
            obj.collected = saved.collected;
            obj.regrowTimer = saved.regrowTimer || 0;
          }
        });
      }
      if (data.farmPlots?.length) this.farmPlots = data.farmPlots;
      if (data.progress) this.progress = { ...this.progress, ...data.progress };
      if (data.relationship) this.relationship = { ...this.relationship, ...data.relationship };
      if (data.achievementUnlocked) this.achievementUnlocked = data.achievementUnlocked;
    } catch (e) {}
  }

  bindEvents() {
    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      if (["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d","e","escape","enter"," ","i","tab","q","g"].includes(key)) e.preventDefault();
      this.keys.add(key);

      if (key === "enter" && this.scene === SCENE.TITLE) {
        this.scene = SCENE.PLAYING;
        this.showMessage("每日目标：先看作物，再种地、采集、钓鱼、交易和社交。", 3600);
        return;
      }

      if (this.scene === SCENE.PLAYING) {
        if (key === "e") this.tryInteract();
        if (key === "i") this.scene = SCENE.INVENTORY;
        if (key === "f5") this.saveGame();
        if (key === "q") this.cycleSeed();
        if (key === "g") this.tryGiftNpc();
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

    window.addEventListener("keyup", (e) => this.keys.delete(e.key.toLowerCase()));
  }

  cycleSeed() {
    const seeds = this.getOwnedSeedKeys();
    if (seeds.length === 0) {
      this.showMessage("没有种子可切换。", 1600);
      return;
    }
    this.selectedSeedIndex = (this.selectedSeedIndex + 1) % seeds.length;
    const key = seeds[this.selectedSeedIndex];
    this.showMessage(`当前播种：${ITEMS[key].icon} ${ITEMS[key].name}`, 1400);
  }

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
    if (this.scene === SCENE.TITLE) return;

    const deltaGameMinutes = (dt / 1000) * 60 * TIME_SPEED;
    this.gameMinutes += deltaGameMinutes;
    if (this.gameMinutes >= 1440) {
      this.gameMinutes -= 1440;
      this.gameDay++;
      this.onNewDay();
    }

    this.updateMessage(dt);
    this.updateParticles(dt);
    this.updateFloatingTexts(dt);
    this.updateInteractables(dt);
    this.updateFarm(deltaGameMinutes);
    this.updateNpcs(dt);

    if (this.scene === SCENE.PLAYING || this.scene === SCENE.INDOOR) this.updatePlayer(dt / 1000);
    if (this.scene === SCENE.FISHING) this.updateFishing(dt);

    this.updateCamera();
    this.checkQuests();
    this.updateTownRank();
    this.checkAchievements();
  }

  onNewDay() {
    this.dailyActions = { talked: {}, gifted: {} };
    this.farmPlots.forEach((p) => { p.watered = false; });
    this.interactables.forEach((o) => {
      if (o.collected && o.regrowTime > 0) {
        o.collected = false;
        o.regrowTimer = 0;
      }
    });
    this.showMessage(`第 ${this.gameDay} 天：记得先浇水和收菜，再去赚钱。`, 3200);
  }

  updateFarm(deltaGameMinutes) {
    this.farmPlots.forEach((plot) => {
      if (!plot.cropKey || plot.ready) return;
      const crop = CROPS[plot.cropKey];
      if (!crop) return;
      if (!plot.watered) return;
      plot.growthMinutes += deltaGameMinutes;
      const minutesPerStage = (crop.growDays * 1440) / crop.stages;
      const nextStage = Math.min(crop.stages, Math.floor(plot.growthMinutes / minutesPerStage));
      plot.stage = nextStage;
      if (plot.stage >= crop.stages && plot.wateredDays >= crop.waterNeed) plot.ready = true;
    });
  }

  updateTownRank() {
    const score = this.progress.harvestCount + Math.floor(this.progress.totalEarned / 300) + Object.values(this.relationship).reduce((a, b) => a + b, 0) / 20 + this.progress.houseLevel * 2 + this.progress.farmLevel * 2;
    this.progress.townRank = Math.max(1, Math.min(5, Math.floor(score / 6) + 1));
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
    this.particles.forEach((p) => {
      p.x += p.vx * dt / 1000;
      p.y += p.vy * dt / 1000;
      p.vy += 120 * dt / 1000;
      p.life -= dt;
      p.alpha = p.life / p.maxLife;
    });
  }

  updateFloatingTexts(dt) {
    this.floatingTexts = this.floatingTexts.filter((t) => t.life > 0);
    this.floatingTexts.forEach((t) => {
      t.y -= dt * 0.03;
      t.life -= dt;
      t.alpha = Math.max(0, t.life / t.maxLife);
    });
  }

  pushFloatingText(x, y, text, color = "#fff9b2") {
    this.floatingTexts.push({ x, y, text, color, life: 900, maxLife: 900, alpha: 1 });
  }

  spawnParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 60 + Math.random() * 80;
      this.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 60, color, life: 600, maxLife: 600, alpha: 1, size: 4 + Math.random() * 4 });
    }
  }

  updateInteractables(dt) {
    this.interactables.forEach((o) => {
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
    const hour = this.gameMinutes / 60;
    this.npcs.forEach((npc) => {
      const target = this.getNpcScheduleTarget(npc, hour);
      const dx = target.x - npc.x;
      const dy = target.y - npc.y;
      const d = Math.hypot(dx, dy);
      if (d > 8) {
        npc.vx = (dx / d) * 35;
        npc.vy = (dy / d) * 35;
      } else {
        npc.moveTimer -= dt;
        if (npc.moveTimer <= 0) {
          npc.moveTimer = 1500 + Math.random() * 2500;
          const ang = Math.random() * Math.PI * 2;
          npc.vx = Math.cos(ang) * 22;
          npc.vy = Math.sin(ang) * 22;
        }
      }
      const nx = npc.x + npc.vx * dt / 1000;
      const ny = npc.y + npc.vy * dt / 1000;
      if (this.canStandAt(nx, npc.y, npc.size)) npc.x = nx;
      if (this.canStandAt(npc.x, ny, npc.size)) npc.y = ny;
      npc.x = Math.max(50, Math.min(MAP_W * TILE_SIZE - 50, npc.x));
      npc.y = Math.max(50, Math.min(MAP_H * TILE_SIZE - 50, npc.y));
    });
  }

  getNpcScheduleTarget(npc, hour) {
    if (hour < 12) return { x: npc.baseX - 50, y: npc.baseY };
    if (hour < 18) {
      if (npc.id === "npc-chen") return { x: 890, y: 260 };
      if (npc.id === "npc-lingling") return { x: 200, y: 760 };
      if (npc.id === "npc-maomao") return { x: 660, y: 280 };
      if (npc.id === "npc-yufu") return { x: 660, y: 300 };
      if (npc.id === "npc-mia") return { x: 1080, y: 240 };
      return { x: 530, y: 680 };
    }
    return { x: npc.baseX + 30, y: npc.baseY + 30 };
  }

  updatePlayer(ds) {
    if (this.scene === SCENE.INDOOR) return;
    let mx = 0, my = 0;
    if (this.keys.has("arrowup") || this.keys.has("w")) { my -= 1; this.player.facing = "up"; }
    if (this.keys.has("arrowdown") || this.keys.has("s")) { my += 1; this.player.facing = "down"; }
    if (this.keys.has("arrowleft") || this.keys.has("a")) { mx -= 1; this.player.facing = "left"; }
    if (this.keys.has("arrowright") || this.keys.has("d")) { mx += 1; this.player.facing = "right"; }
    const accel = 8;
    const friction = 0.82;
    if (mx === 0 && my === 0) {
      this.player.vx *= friction;
      this.player.vy *= friction;
      this.player.isMoving = Math.hypot(this.player.vx, this.player.vy) > 8;
      this.player.idlePhase += ds * 2.2;
    } else {
      const len = Math.hypot(mx, my);
      const targetVx = (mx / len) * this.player.speed;
      const targetVy = (my / len) * this.player.speed;
      this.player.vx += (targetVx - this.player.vx) * Math.min(1, accel * ds);
      this.player.vy += (targetVy - this.player.vy) * Math.min(1, accel * ds);
      this.player.walkCycle += ds * 11;
      this.player.isMoving = true;
      this.player.stepTimer -= ds;
      if (this.player.stepTimer <= 0) {
        this.player.stepTimer = 0.18;
        this.spawnParticles(this.player.x, this.player.y + 14, "rgba(180,220,150,0.8)", 3);
      }
    }
    const nx = this.player.x + this.player.vx * ds;
    const ny = this.player.y + this.player.vy * ds;
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
    if (!this.progress.bridgeRepaired && x > 1060 && y > 460 && y < 620) return false;
    const half = (size || this.player.size) / 2;
    const corners = [[x - half, y - half], [x + half, y - half], [x - half, y + half], [x + half, y + half]];
    return corners.every(([px, py]) => {
      if (px < 0 || py < 0 || px >= MAP_W * TILE_SIZE || py >= MAP_H * TILE_SIZE) return false;
      const tx = Math.floor(px / TILE_SIZE);
      const ty = Math.floor(py / TILE_SIZE);
      return this.tileMap[ty]?.[tx] !== TILE.WATER;
    });
  }

  getOwnedSeedKeys() {
    const unlocked = this.getUnlockedSeeds();
    return Object.keys(this.inventory).filter(k => k.startsWith("seed_") && this.inventory[k] > 0 && unlocked.includes(k));
  }

  getUnlockedSeeds() {
    return Object.values(CROPS).filter(c => c.unlock <= this.progress.townRank).map(c => c.seed);
  }

  tryInteract() {
    const plot = this.getNearestPlot();
    if (plot) {
      this.interactFarmPlot(plot);
      return;
    }
    const npc = this.getNearestNpc();
    if (npc) {
      this.startDialogue(npc);
      return;
    }
    const obj = this.getNearestInteractable();
    if (!obj) {
      this.showMessage("附近没有可互动目标。", 1200);
      return;
    }
    this.interactWith(obj);
  }

  getNearestPlot() {
    let best = null, minD = 72;
    this.farmPlots.forEach((plot) => {
      if (plot.lockedLevel > this.progress.farmLevel) return;
      const cx = plot.x + plot.w / 2, cy = plot.y + plot.h / 2;
      const d = Math.hypot(cx - this.player.x, cy - this.player.y);
      if (d < minD) { minD = d; best = plot; }
    });
    return best;
  }

  interactFarmPlot(plot) {
    if (!plot.tilled) {
      plot.tilled = true;
      this.showMessage("你翻松了土地。", 1400);
      this.pushFloatingText(plot.x + 20, plot.y, "翻地", "#ffe7a8");
      return;
    }
    if (plot.cropKey && !plot.ready) {
      if (!plot.watered) {
        plot.watered = true;
        plot.wateredDays += 1;
        this.spawnParticles(plot.x + 20, plot.y + 20, "#67b6ff", 6);
        this.showMessage("已浇水，作物今日会继续生长。", 1400);
        this.pushFloatingText(plot.x + 20, plot.y, "+浇水", "#8dd8ff");
      } else {
        this.showMessage("今天已经浇过水了。", 1200);
      }
      return;
    }
    if (plot.ready && plot.cropKey) {
      const crop = CROPS[plot.cropKey];
      const amount = crop.yield[0] + Math.floor(Math.random() * (crop.yield[1] - crop.yield[0] + 1));
      this.addItem(crop.harvest, amount);
      this.progress.harvestCount += amount;
      plot.cropKey = null;
      plot.stage = 0;
      plot.ready = false;
      plot.watered = false;
      plot.wateredDays = 0;
      plot.growthMinutes = 0;
      this.spawnParticles(plot.x + 20, plot.y + 20, "#a2ff6e", 9);
      this.showMessage(`收获 ${ITEMS[crop.harvest].name} x${amount}！`, 1800);
      this.pushFloatingText(plot.x + 20, plot.y, `+${amount} ${ITEMS[crop.harvest].icon}`, "#dcff8a");
      return;
    }
    if (!plot.cropKey) {
      const seeds = this.getOwnedSeedKeys();
      if (seeds.length === 0) {
        this.showMessage("没有种子。去商店购买吧。", 1400);
        return;
      }
      if (this.selectedSeedIndex >= seeds.length) this.selectedSeedIndex = 0;
      const seedKey = seeds[this.selectedSeedIndex];
      const cropKey = Object.keys(CROPS).find(k => CROPS[k].seed === seedKey);
      if (!cropKey) return;
      this.removeItem(seedKey, 1);
      plot.cropKey = cropKey;
      plot.stage = 0;
      plot.ready = false;
      plot.watered = false;
      plot.growthMinutes = 0;
      plot.wateredDays = 0;
      this.showMessage(`播种：${CROPS[cropKey].name}。记得每日浇水！`, 1800);
      this.pushFloatingText(plot.x + 20, plot.y, `播种 ${ITEMS[seedKey].icon}`, "#ffd59a");
    }
  }

  getNearestNpc() {
    let best = null, minD = INTERACT_DISTANCE;
    this.npcs.forEach((npc) => {
      const d = Math.hypot(npc.x - this.player.x, npc.y - this.player.y);
      if (d < minD) { minD = d; best = npc; }
    });
    return best;
  }

  getNearestInteractable() {
    let best = null, minD = INTERACT_DISTANCE;
    this.interactables.forEach((obj) => {
      if (obj.eastOnly && !this.progress.eastUnlocked) return;
      const cx = obj.x + obj.w / 2, cy = obj.y + obj.h / 2;
      const d = Math.hypot(cx - this.player.x, cy - this.player.y);
      if (d < minD) { minD = d; best = obj; }
    });
    return best;
  }

  interactWith(obj) {
    if (obj.type === "house") {
      this.scene = SCENE.INDOOR;
      return;
    }
    if (obj.type === "shop") {
      const h = this.gameMinutes / 60;
      if (h < 8 || h >= 20) {
        this.showMessage("商店营业时间 08:00 - 20:00。", 1800);
        return;
      }
      this.scene = SCENE.SHOP;
      this.shopMode = "buy";
      this.shopSelection = 0;
      return;
    }
    if (obj.type === "sign") {
      this.showMessage(obj.text, 3400);
      return;
    }
    if (obj.type === "fishspot") {
      this.scene = SCENE.FISHING;
      this.fishingState = "casting";
      this.fishingTimer = 1200 + Math.random() * 2400;
      this.fishingProgress = 0;
      this.fishingBarY = 180;
      this.fishingFishY = 140;
      return;
    }
    if (obj.type === "bridge") {
      if (this.progress.bridgeRepaired) {
        this.showMessage("旧桥已修复，东区资源更丰富。", 1600);
        return;
      }
      const enough = this.gold >= 450 && (this.inventory.wood || 0) >= 20 && (this.inventory.stone || 0) >= 14;
      if (!enough) {
        this.showMessage("修桥需要 450金 + 木材20 + 石头14。", 2200);
        return;
      }
      this.gold -= 450;
      this.removeItem("wood", 20);
      this.removeItem("stone", 14);
      this.progress.bridgeRepaired = true;
      this.progress.eastUnlocked = true;
      this.showMessage("旧桥修复完成！东区解锁。", 2600);
      return;
    }

    if (obj.collected) {
      const timeLeft = Math.ceil((obj.regrowTime - obj.regrowTimer) / 1000);
      this.showMessage(`${obj.name} 已采集，${Math.max(0, timeLeft)}秒后恢复。`, 1300);
      return;
    }

    obj.collected = true;
    obj.regrowTimer = 0;
    if (obj.item) {
      this.addItem(obj.item, obj.amount || 1);
      this.showMessage(`获得 ${ITEMS[obj.item].name} x${obj.amount || 1}`, 1300);
      this.pushFloatingText(obj.x + obj.w / 2, obj.y - 4, `+${ITEMS[obj.item].icon}x${obj.amount || 1}`);
    }
    if (obj.extraItem) this.addItem(obj.extraItem, 1);
    this.spawnParticles(obj.x + obj.w / 2, obj.y, "#88ff88", 7);
  }

  addItem(key, amount) {
    this.inventory[key] = (this.inventory[key] || 0) + amount;
  }

  removeItem(key, amount) {
    this.inventory[key] = (this.inventory[key] || 0) - amount;
    if (this.inventory[key] <= 0) delete this.inventory[key];
  }

  tryGiftNpc() {
    const npc = this.getNearestNpc();
    if (!npc) {
      this.showMessage("附近没有居民。", 1200);
      return;
    }
    if (this.dailyActions.gifted[npc.id] === this.gameDay) {
      this.showMessage(`${npc.name} 今天已经收过礼物了。`, 1600);
      return;
    }
    const candidate = npc.likes.find(k => (this.inventory[k] || 0) > 0) || Object.keys(this.inventory).find(k => !k.startsWith("seed_"));
    if (!candidate) {
      this.showMessage("背包里没有可赠送物品。", 1500);
      return;
    }
    this.removeItem(candidate, 1);
    const likeBonus = npc.likes.includes(candidate) ? 8 : 3;
    this.relationship[npc.id] = Math.min(100, (this.relationship[npc.id] || 0) + likeBonus);
    this.dailyActions.gifted[npc.id] = this.gameDay;
    this.showMessage(`送出 ${ITEMS[candidate]?.name || candidate}，${npc.name} 好感 +${likeBonus}`, 2200);
    this.pushFloatingText(npc.x, npc.y - 18, `❤+${likeBonus}`, "#ff9ac4");
  }

  startDialogue(npc) {
    if (this.dailyActions.talked[npc.id] !== this.gameDay) {
      this.relationship[npc.id] = Math.min(100, (this.relationship[npc.id] || 0) + 2);
      this.dailyActions.talked[npc.id] = this.gameDay;
    }
    const h = this.gameMinutes / 60;
    const favor = this.relationship[npc.id] || 0;
    const pages = [];
    pages.push(`${npc.name}（好感 ${favor}/100）`);
    if (h < 12) pages.push("早上先看农田是个好习惯，浇水会决定今天收成。");
    else if (h < 18) pages.push("下午适合跑商和采集，别忘了商店晚上八点关门。");
    else pages.push("晚上钓鱼收益更高，还能和大家聊聊今天过得怎么样。");

    if (npc.id === "npc-chen") {
      pages.push(this.progress.townRank >= 3 ? "镇子越来越像样了，我进了新的高阶种子。" : "先靠萝卜和土豆滚资金，稳定后再上高价种子。");
    }
    if (npc.id === "npc-lingling" && this.progress.harvestCount >= 10) pages.push("你已经是靠谱农夫了！继续提升农场等级吧。");
    if (npc.id === "npc-maomao") pages.push("按 G 可以送礼物，送鱼给我加好感会更快喵！");
    if (npc.id === "npc-zhuang" && this.progress.bridgeRepaired) pages.push("东区开了，资源更多，建设速度会明显提升。");
    if (npc.id === "npc-yufu") pages.push("湖边在傍晚和夜里最热闹，夜行鱼更值钱。");
    if (npc.id === "npc-mia") pages.push("我在做花园修复，等你镇级提高后会摆上更多装饰。");

    this.dialogueTarget = npc;
    this.dialoguePages = pages;
    this.dialoguePage = 0;
    this.scene = SCENE.DIALOGUE;
  }

  advanceDialogue() {
    this.dialoguePage += 1;
    if (this.dialoguePage >= this.dialoguePages.length) {
      this.scene = SCENE.PLAYING;
      this.dialogueTarget = null;
    }
  }

  getShopBuyList() {
    const unlocked = this.getUnlockedSeeds();
    return ["seed_turnip", "seed_potato", ...(unlocked.includes("seed_blueberry") ? ["seed_blueberry"] : []), ...(unlocked.includes("seed_pumpkin") ? ["seed_pumpkin"] : []), "wood", "stone"];
  }

  getUpgradeList() {
    return [
      { id: "house", name: "小屋升级", desc: `Lv${this.progress.houseLevel}→Lv${this.progress.houseLevel + 1}`, cost: { gold: 280 + this.progress.houseLevel * 160, wood: 14 + this.progress.houseLevel * 4, stone: 8 + this.progress.houseLevel * 3 }, can: () => this.progress.houseLevel < 3, apply: () => { this.progress.houseLevel += 1; this.player.speed += 5; } },
      { id: "farm", name: "农场扩建", desc: `Lv${this.progress.farmLevel}→Lv${this.progress.farmLevel + 1}`, cost: { gold: 260 + this.progress.farmLevel * 140, wood: 10 + this.progress.farmLevel * 5 }, can: () => this.progress.farmLevel < 2, apply: () => { this.progress.farmLevel += 1; } },
      { id: "bridge", name: "修复旧桥", desc: this.progress.bridgeRepaired ? "已完成" : "解锁东区资源区", cost: { gold: 450, wood: 20, stone: 14 }, can: () => !this.progress.bridgeRepaired, apply: () => { this.progress.bridgeRepaired = true; this.progress.eastUnlocked = true; } },
    ].filter(u => u.can());
  }

  handleShopInput(key) {
    const modes = ["buy", "sell", "upgrade"];
    if (key === "tab") {
      this.shopMode = modes[(modes.indexOf(this.shopMode) + 1) % modes.length];
      this.shopSelection = 0;
      return;
    }
    if (key === "escape") {
      this.scene = SCENE.PLAYING;
      return;
    }

    const buyList = this.getShopBuyList();
    const sellList = Object.keys(this.inventory).filter(k => (this.inventory[k] || 0) > 0 && ITEMS[k]?.sellPrice > 0);
    const upgradeList = this.getUpgradeList();
    const list = this.shopMode === "buy" ? buyList : this.shopMode === "sell" ? sellList : upgradeList;
    if (list.length === 0) return;

    if (key === "arrowdown" || key === "s") this.shopSelection = (this.shopSelection + 1) % list.length;
    if (key === "arrowup" || key === "w") this.shopSelection = (this.shopSelection - 1 + list.length) % list.length;

    if (key === "e" || key === "enter") {
      if (this.shopMode === "buy") {
        const itemKey = list[this.shopSelection];
        const price = ITEMS[itemKey].buyPrice;
        if (this.gold < price) return this.showMessage("金币不足。", 1200);
        this.gold -= price;
        this.addItem(itemKey, 1);
        this.showMessage(`购买 ${ITEMS[itemKey].name} -${price}金`, 1400);
        this.pushFloatingText(this.player.x, this.player.y - 16, `-${price}金`, "#ffd39e");
      } else if (this.shopMode === "sell") {
        const itemKey = list[this.shopSelection];
        const hour = this.gameMinutes / 60;
        const nightBonus = (itemKey === "fish" || itemKey === "nightFish") && hour >= 18 ? 1.25 : 1;
        const price = Math.floor(ITEMS[itemKey].sellPrice * nightBonus);
        this.removeItem(itemKey, 1);
        this.gold += price;
        this.progress.totalEarned += price;
        this.showMessage(`卖出 ${ITEMS[itemKey].name} +${price}金`, 1400);
        this.pushFloatingText(this.player.x, this.player.y - 16, `+${price}金`, "#c3ff90");
      } else {
        const up = list[this.shopSelection];
        const c = up.cost;
        if (this.gold < (c.gold || 0) || (this.inventory.wood || 0) < (c.wood || 0) || (this.inventory.stone || 0) < (c.stone || 0)) {
          return this.showMessage("材料或金币不足。", 1500);
        }
        this.gold -= (c.gold || 0);
        if (c.wood) this.removeItem("wood", c.wood);
        if (c.stone) this.removeItem("stone", c.stone);
        up.apply();
        this.showMessage(`完成：${up.name}！`, 1800);
        this.pushFloatingText(this.player.x, this.player.y - 16, "建筑升级!", "#ffe37f");
      }
    }
  }

  handleFishingInput() {
    if (this.fishingState === "biting") {
      this.fishingState = "reeling";
      this.fishingBarY = 180;
      this.fishingFishY = 80 + Math.random() * 180;
      this.fishingProgress = 18;
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
        this.fishingTimer = 2200;
        this.showMessage("鱼咬钩！按 E 或 空格！", 0);
      }
    } else if (this.fishingState === "biting") {
      this.fishingTimer -= dt;
      if (this.fishingTimer <= 0) {
        this.fishingState = "casting";
        this.fishingTimer = 1400 + Math.random() * 2200;
      }
    } else if (this.fishingState === "reeling") {
      this.fishingFishY += this.fishingFishDir * 60 * dt / 1000;
      if (this.fishingFishY < 60 || this.fishingFishY > 260) this.fishingFishDir *= -1;
      this.fishingBarVel += 200 * dt / 1000;
      this.fishingBarY += this.fishingBarVel * dt / 1000;
      this.fishingBarY = Math.max(60, Math.min(260, this.fishingBarY));
      const overlap = this.fishingBarY <= this.fishingFishY && this.fishingFishY <= this.fishingBarY + 50;
      this.fishingProgress += overlap ? dt * 0.05 : -dt * 0.04;
      this.fishingProgress = Math.max(0, Math.min(100, this.fishingProgress));
      if (this.fishingProgress >= 100) this.catchFish();
      else if (this.fishingProgress <= 0 && !overlap) {
        this.fishingState = "casting";
        this.fishingTimer = 1400 + Math.random() * 2200;
      }
    }
  }

  catchFish() {
    const hour = this.gameMinutes / 60;
    const night = hour >= 19 || hour < 5;
    const gotNightFish = night && Math.random() < 0.55;
    const key = gotNightFish ? "nightFish" : "fish";
    this.addItem(key, 1);
    this.progress.fishCaught += 1;
    this.fishingResult = { name: ITEMS[key].name, icon: ITEMS[key].icon, value: ITEMS[key].sellPrice };
    this.fishingState = "result";
    this.spawnParticles(this.canvas.width / 2, 300, "#4fa8e0", 10);
    this.pushFloatingText(this.player.x, this.player.y - 16, `+${ITEMS[key].icon}`, "#9dd8ff");
  }

  checkQuests() {
    this.quests.forEach((q) => {
      if (q.unlockWhen && !this.quests.find((x) => x.id === q.unlockWhen)?.done) return;
      if (!q.done && q.check()) {
        q.done = true;
        let msg = `任务完成：${q.title}`;
        if (q.reward.gold) {
          this.gold += q.reward.gold;
          this.progress.totalEarned += q.reward.gold;
          msg += ` +${q.reward.gold}金`;
        }
        if (q.reward.item) {
          this.addItem(q.reward.item, q.reward.amount || 1);
          msg += ` +${ITEMS[q.reward.item].name}x${q.reward.amount || 1}`;
        }
        this.showMessage(msg, 3200);
        this.pushFloatingText(this.player.x, this.player.y - 20, "任务完成!", "#ffe17f");
      }
    });
  }

  checkAchievements() {
    const checks = [
      { id: "harvest-master", cond: this.progress.harvestCount >= 30, name: "丰收季", desc: "累计收获 30 作物" },
      { id: "social-star", cond: Object.values(this.relationship).some(v => v >= 50), name: "社交达人", desc: "任一居民好感达到 50" },
      { id: "night-angler", cond: (this.inventory.nightFish || 0) >= 5, name: "夜钓高手", desc: "收集 5 条夜行鱼" },
    ];
    checks.forEach((a) => {
      if (a.cond && !this.achievementUnlocked.includes(a.id)) {
        this.achievementUnlocked.push(a.id);
        this.showMessage(`🏆 成就解锁：${a.name}（${a.desc}）`, 3200);
      }
    });
  }

  showMessage(text, duration) {
    this.interactionMessage = text;
    this.messageTimer = duration;
  }

  render() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (this.scene === SCENE.TITLE) return this.renderTitle();
    if (this.scene === SCENE.INDOOR) { this.renderIndoor(); this.renderHud(); this.renderMessage(); return; }
    if (this.scene === SCENE.SHOP) { this.renderGame(); this.renderShop(); return; }
    if (this.scene === SCENE.DIALOGUE) { this.renderGame(); this.renderDialogue(); return; }
    if (this.scene === SCENE.INVENTORY) { this.renderGame(); this.renderInventory(); return; }
    if (this.scene === SCENE.FISHING) { this.renderGame(); this.renderFishing(); return; }
    this.renderGame();
  }

  renderGame() {
    const { ctx } = this;
    ctx.fillStyle = getSkyColor(this.gameMinutes / 60);
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));
    this.renderTileMap();
    this.renderDistrictBackdrops();
    this.renderDecorations();
    this.renderFarmPlots();
    this.renderInteractables();
    this.renderNpcs();
    this.renderPlayer();
    this.renderParticles();
    this.renderFloatingTexts();
    ctx.restore();

    this.renderNightOverlay();
    this.renderHud();
    this.renderQuestTracker();
    this.renderAchievementPanel();
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
        this.ctx.fillStyle = TILE_COLORS[tile] || "#7ec850";
        this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        if (tile === TILE.GRASS || tile === TILE.DARK_GRASS) {
          ctx.fillStyle = "rgba(255,255,255,0.05)";
          ctx.fillRect(px + ((tx * 7 + ty * 3) % 22), py + ((tx * 4 + ty * 5) % 18), 3, 3);
          ctx.fillStyle = "rgba(0,0,0,0.08)";
          ctx.fillRect(px + ((tx * 5 + ty * 9) % 26), py + ((tx * 6 + ty * 2) % 18), 2, 2);
        }
        if (tile === TILE.PATH || tile === TILE.SAND) {
          ctx.strokeStyle = "rgba(120,90,60,0.18)";
          ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        }

        if (tile === TILE.WATER) {
          const wave = Math.sin((tx + ty + this.gameMinutes * 0.05) * 0.8) * 2;
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(px + 6, py + 20 + wave);
          ctx.lineTo(px + 42, py + 20 + wave);
          ctx.stroke();
          ctx.fillStyle = "rgba(100,200,255,0.1)";
          ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
        } else {
          const nearWater = [
            this.tileMap[ty - 1]?.[tx], this.tileMap[ty + 1]?.[tx],
            this.tileMap[ty]?.[tx - 1], this.tileMap[ty]?.[tx + 1],
          ].some((n) => n === TILE.WATER);
          if (nearWater) {
            ctx.strokeStyle = "rgba(220,205,150,0.32)";
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
          }
        }
      }
    }
  }

  renderDistrictBackdrops() {
    const { ctx } = this;
    DISTRICTS.forEach((d, i) => {
      const grad = ctx.createLinearGradient(d.x, d.y, d.x, d.y + d.h);
      grad.addColorStop(0, i % 2 === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,235,205,0.08)");
      grad.addColorStop(1, "rgba(0,0,0,0.04)");
      ctx.fillStyle = grad;
      ctx.fillRect(d.x, d.y, d.w, d.h);
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 2;
      ctx.strokeRect(d.x + 1, d.y + 1, d.w - 2, d.h - 2);
      ctx.fillStyle = "rgba(40,70,30,0.65)";
      ctx.font = "12px sans-serif";
      ctx.fillText(d.name, d.x + 10, d.y + 20);
    });
  }

  renderDecorations() {
    const { ctx } = this;
    this.decorations.forEach((d) => {
      if (d.type === "bush") {
        ctx.fillStyle = ["#6cb363", "#5ea95c", "#75ba6a"][d.v];
        ctx.beginPath();
        ctx.arc(d.x, d.y, 18, 0, Math.PI * 2);
        ctx.arc(d.x + 16, d.y + 4, 14, 0, Math.PI * 2);
        ctx.arc(d.x - 14, d.y + 6, 12, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.type === "fence") {
        ctx.fillStyle = "#b98f56";
        ctx.fillRect(d.x, d.y, 18, 20);
        ctx.fillStyle = "#8f693d";
        ctx.fillRect(d.x + 6, d.y - 8, 5, 28);
      } else if (d.type === "lamp") {
        ctx.fillStyle = "#5d4d38";
        ctx.fillRect(d.x + 6, d.y - 20, 4, 28);
        ctx.fillStyle = "#ffd98a";
        ctx.beginPath();
        ctx.arc(d.x + 8, d.y - 22, 7, 0, Math.PI * 2);
        ctx.fill();
        if (this.gameMinutes / 60 >= 18 || this.gameMinutes / 60 < 6) {
          ctx.fillStyle = "rgba(255,220,150,0.24)";
          ctx.beginPath();
          ctx.arc(d.x + 8, d.y - 22, 16, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (d.type === "pebble") {
        ctx.fillStyle = "#9d9d9d";
        ctx.fillRect(d.x, d.y, 6, 4);
      } else if (d.type === "stump") {
        ctx.fillStyle = "#8b6740";
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, 9, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#b99464";
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  renderFarmPlots() {
    const { ctx } = this;
    this.farmPlots.forEach((p) => {
      const unlocked = p.lockedLevel <= this.progress.farmLevel;
      ctx.fillStyle = unlocked ? (p.tilled ? "#7a4c28" : "#557a3a") : "#444";
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.strokeRect(p.x, p.y, p.w, p.h);
      if (!unlocked) {
        ctx.fillStyle = "#ddd";
        ctx.font = "12px sans-serif";
        ctx.fillText("🔒", p.x + 12, p.y + 26);
        return;
      }
      if (p.cropKey) {
        const crop = CROPS[p.cropKey];
        const s = p.ready ? crop.stages : p.stage;
        const height = 6 + (s / crop.stages) * 24;
        ctx.fillStyle = p.ready ? "#f6d44f" : "#62c252";
        ctx.fillRect(p.x + 18, p.y + p.h - height - 4, 8, height);
        ctx.fillStyle = p.ready ? "#ffdd70" : "#76d363";
        ctx.beginPath();
        ctx.arc(p.x + 22, p.y + p.h - height - 4, 10, 0, Math.PI * 2);
        ctx.fill();
      }
      if (p.watered) {
        ctx.fillStyle = "rgba(100,170,255,0.4)";
        ctx.fillRect(p.x + 2, p.y + 2, p.w - 4, p.h - 4);
      }
    });
  }

  renderInteractables() {
    const { ctx } = this;
    this.interactables.forEach((obj) => {
      if (obj.eastOnly && !this.progress.eastUnlocked) return;
      if (obj.type === "tree") this.drawTree(obj);
      else if (obj.type === "flower") this.drawFlower(obj);
      else if (obj.type === "mushroom") this.drawMushroom(obj);
      else if (obj.type === "stone") this.drawStone(obj);
      else if (obj.type === "fishspot") this.drawFishspot(obj);
      else if (obj.type === "house") this.drawHouse(obj);
      else if (obj.type === "shop") this.drawShop(obj);
      else if (obj.type === "sign") this.drawSign(obj);
      else if (obj.type === "shell") this.drawShell(obj);
      else if (obj.type === "bridge") this.drawBridge(obj);

      const cx = obj.x + obj.w / 2, cy = obj.y + obj.h / 2;
      if (Math.hypot(cx - this.player.x, cy - this.player.y) < INTERACT_DISTANCE) {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillRect(obj.x + obj.w / 2 - 28, obj.y - 22, 56, 16);
        ctx.fillStyle = "#333";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("[E]", obj.x + obj.w / 2, obj.y - 10);
        ctx.textAlign = "left";
      }
    });
  }

  drawTree(obj){const {ctx}=this;ctx.fillStyle="#7a5c3a";ctx.fillRect(obj.x+24,obj.y+34,16,44);ctx.fillStyle=obj.collected?"#93b78d":"#52b840";ctx.beginPath();ctx.arc(obj.x+32,obj.y+28,32,0,Math.PI*2);ctx.fill();}
  drawFlower(obj){const {ctx}=this;if(obj.collected){ctx.fillStyle="#8eca66";ctx.fillRect(obj.x,obj.y,32,32);return;}ctx.fillStyle="#ff66aa";ctx.beginPath();ctx.arc(obj.x+16,obj.y+16,10,0,Math.PI*2);ctx.fill();}
  drawMushroom(obj){const {ctx}=this;ctx.fillStyle=obj.collected?"#c8a088":"#d04020";ctx.beginPath();ctx.arc(obj.x+18,obj.y+14,18,Math.PI,0);ctx.fill();ctx.fillStyle="#f0e8d0";ctx.fillRect(obj.x+12,obj.y+14,12,16);}
  drawStone(obj){const {ctx}=this;ctx.fillStyle=obj.collected?"#b0b8c0":"#7e8e9a";ctx.beginPath();ctx.ellipse(obj.x+29,obj.y+26,28,20,0,0,Math.PI*2);ctx.fill();}
  drawFishspot(obj){const {ctx}=this;ctx.strokeStyle="rgba(255,255,255,0.6)";ctx.beginPath();ctx.arc(obj.x+20,obj.y+20,15,0,Math.PI*2);ctx.stroke();ctx.fillText("🎣",obj.x+7,obj.y+30);} 
  drawHouse(obj){const {ctx}=this;ctx.fillStyle="#f4e8c0";ctx.fillRect(obj.x,obj.y+50,obj.w,obj.h-50);ctx.fillStyle="#d05030";ctx.beginPath();ctx.moveTo(obj.x-10,obj.y+50);ctx.lineTo(obj.x+obj.w/2,obj.y+5);ctx.lineTo(obj.x+obj.w+10,obj.y+50);ctx.closePath();ctx.fill();ctx.fillStyle="#8a5020";ctx.fillRect(obj.x+66,obj.y+95,38,55);} 
  drawShop(obj){const {ctx}=this;ctx.fillStyle="#dce8f8";ctx.fillRect(obj.x,obj.y+40,obj.w,obj.h-40);ctx.fillStyle="#5588cc";ctx.fillRect(obj.x,obj.y,obj.w,44);ctx.fillStyle="#fff176";ctx.fillRect(obj.x+30,obj.y+6,100,28);ctx.fillStyle="#333";ctx.font="bold 14px sans-serif";ctx.textAlign="center";ctx.fillText("老陈商店",obj.x+obj.w/2,obj.y+25);ctx.textAlign="left";} 
  drawSign(obj){const {ctx}=this;ctx.fillStyle="#a07840";ctx.fillRect(obj.x+12,obj.y,6,30);ctx.fillStyle="#c8a060";ctx.fillRect(obj.x,obj.y,30,22);} 
  drawShell(obj){const {ctx}=this;ctx.fillStyle=obj.collected?"#e8d8c0":"#f4a868";ctx.beginPath();ctx.ellipse(obj.x+14,obj.y+10,13,9,0,0,Math.PI*2);ctx.fill();}
  drawBridge(obj){const {ctx}=this;ctx.fillStyle=this.progress.bridgeRepaired?"#aa7a42":"#6a5040";ctx.fillRect(obj.x,obj.y,obj.w,obj.h);ctx.fillStyle="#d7b078";for(let i=0;i<5;i++)ctx.fillRect(obj.x+10+i*20,obj.y+8,12,obj.h-16);} 

  renderNpcs() {
    const { ctx } = this;
    this.npcs.forEach((npc) => {
      const size = npc.size;
      const favor = this.relationship[npc.id] || 0;
      ctx.fillStyle = npc.color;
      ctx.fillRect(npc.x - size / 2, npc.y - size / 2, size, size);
      ctx.fillStyle = npc.hatColor;
      ctx.fillRect(npc.x - size / 2 + 2, npc.y - size / 2 - 8, size - 4, 10);
      ctx.fillStyle = "#fff";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${npc.name}❤${favor}`, npc.x, npc.y - size / 2 - 14);
      ctx.textAlign = "left";
    });
  }

  renderPlayer() {
    const { ctx } = this;
    const { x, y, size } = this.player;
    const bob = this.player.isMoving ? Math.sin(this.player.walkCycle * 1.4) * 1.5 : Math.sin(this.player.idlePhase * 1.4) * 1.2;
    const legSwing = this.player.isMoving ? Math.sin(this.player.walkCycle) * 4 : 0;
    const py = y + bob;
    ctx.fillStyle = "rgba(0,0,0,0.24)";
    ctx.beginPath();
    ctx.ellipse(x, py + size / 2 + 6, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2f5aa1";
    ctx.fillRect(x - size / 2, py - size / 2, size, size - 2);
    ctx.fillStyle = "#223355";
    ctx.fillRect(x - 8 + legSwing * 0.3, py + 4, 6, 10);
    ctx.fillRect(x + 2 - legSwing * 0.3, py + 4, 6, 10);
    ctx.fillStyle = "#ffdbb0";
    ctx.fillRect(x - 8, py - size / 2 + 2, 16, 12);
    ctx.fillStyle = "#c03020";
    ctx.fillRect(x - size / 2 + 2, py - size / 2 - 8, size - 4, 10);
    const eyeOffset = this.player.facing === "left" ? -2 : this.player.facing === "right" ? 2 : 0;
    ctx.fillStyle = "#222";
    ctx.fillRect(x - 4 + eyeOffset, py - size / 2 + 6, 2, 2);
    ctx.fillRect(x + 2 + eyeOffset, py - size / 2 + 6, 2, 2);
  }

  renderParticles() {
    const { ctx } = this;
    this.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  renderFloatingTexts() {
    const { ctx } = this;
    this.floatingTexts.forEach((t) => {
      ctx.save();
      ctx.globalAlpha = t.alpha;
      ctx.fillStyle = t.color;
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    });
    ctx.textAlign = "left";
  }

  renderNightOverlay() {
    const hour = this.gameMinutes / 60;
    let alpha = 0;
    if (hour >= 20) alpha = Math.min(0.58, (hour - 20) / 4 * 0.58);
    else if (hour < 6) alpha = 0.58;
    else if (hour < 7) alpha = Math.max(0, 0.58 - (hour - 6) * 0.58);
    if (alpha <= 0) return;
    this.ctx.fillStyle = `rgba(0,0,40,${alpha})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawPanel(x, y, w, h, opts = {}) {
    const { ctx } = this;
    const r = opts.radius ?? 12;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fillStyle = opts.fill ?? "rgba(16,32,22,0.84)";
    ctx.fill();
    if (opts.stroke) {
      ctx.strokeStyle = opts.stroke;
      ctx.lineWidth = opts.lineWidth ?? 1.5;
      ctx.stroke();
    }
  }

  renderHud() {
    const { ctx, canvas } = this;
    const hour = Math.floor(this.gameMinutes / 60);
    const min = Math.floor(this.gameMinutes % 60);
    const timeStr = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    const seedKeys = this.getOwnedSeedKeys();
    const activeSeed = seedKeys.length ? seedKeys[Math.min(this.selectedSeedIndex, seedKeys.length - 1)] : null;

    this.drawPanel(10, 10, 330, 124, { fill: "rgba(20,36,20,0.82)", stroke: "rgba(178,225,170,0.55)" });
    ctx.fillStyle = "#f0d040";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`💰 ${this.gold} 金币`, 22, 34);
    ctx.fillStyle = "#c8f0ff";
    ctx.font = "14px sans-serif";
    ctx.fillText(`⏰ 第${this.gameDay}天  ${timeStr}`, 22, 54);
    ctx.fillText(`🏠小屋Lv${this.progress.houseLevel}  🚜农场Lv${this.progress.farmLevel}  ⭐镇级${this.progress.townRank}`, 22, 74);
    ctx.fillText(`🌾收获:${this.progress.harvestCount}  🎣钓鱼:${this.progress.fishCaught}  📈累计赚:${this.progress.totalEarned}`, 22, 94);
    ctx.fillStyle = "#b8f0b8";
    ctx.fillText(activeSeed ? `Q切换种子：${ITEMS[activeSeed].icon}${ITEMS[activeSeed].name}(${this.inventory[activeSeed]})` : "当前无种子（去商店购买）", 22, 114);

    this.drawPanel(canvas.width - 284, 10, 274, 120, { fill: "rgba(10,20,10,0.68)", stroke: "rgba(170,216,170,0.45)" });
    ctx.fillStyle = "#c8e8c8";
    ctx.font = "12px sans-serif";
    ["WASD 移动 / E 互动", "农地：翻地→播种→每日浇水→收获", "Q 切种子  G 赠礼提升好感", "I 背包  Tab商店分页  F5存档"].forEach((line, i) => ctx.fillText(line, canvas.width - 272, 30 + i * 22));
  }

  renderQuestTracker() {
    const { ctx, canvas } = this;
    const active = this.quests.filter(q => !q.done && (!q.unlockWhen || this.quests.find((x) => x.id === q.unlockWhen)?.done)).slice(0, 3);
    if (!active.length) return;
    const x = 10, y = canvas.height - 130;
    this.drawPanel(x, y, 360, 120, { fill: "rgba(20,36,20,0.84)", stroke: "rgba(178,225,170,0.45)" });
    ctx.fillStyle = "#f0d060";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("📋 长期目标", x + 12, y + 20);
    active.forEach((q, i) => {
      ctx.fillStyle = "#c8f8c8";
      ctx.font = "12px sans-serif";
      ctx.fillText(`▸ ${q.title}`, x + 12, y + 42 + i * 25);
      ctx.fillStyle = "#88c888";
      ctx.fillText(q.desc, x + 110, y + 42 + i * 25);
    });
  }

  renderAchievementPanel() {
    const { ctx, canvas } = this;
    const latest = this.achievementUnlocked.slice(-3);
    if (!latest.length) return;
    this.drawPanel(canvas.width - 260, canvas.height - 120, 250, 110, { fill: "rgba(21,35,31,0.84)", stroke: "rgba(245,218,120,0.5)" });
    ctx.fillStyle = "#f4d878";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("🏆 成就墙", canvas.width - 246, canvas.height - 98);
    latest.forEach((id, i) => {
      const label = id === "harvest-master" ? "丰收季" : id === "social-star" ? "社交达人" : "夜钓高手";
      ctx.fillStyle = "#f8f3d0";
      ctx.font = "12px sans-serif";
      ctx.fillText(`• ${label}`, canvas.width - 246, canvas.height - 76 + i * 20);
    });
  }

  renderMessage() {
    const { ctx, canvas } = this;
    if (!this.interactionMessage) return;
    const text = this.interactionMessage;
    const w = Math.min(ctx.measureText(text).width + 40, canvas.width - 40);
    const x = (canvas.width - w) / 2;
    const y = canvas.height - 56;
    this.drawPanel(x, y, w, 34, { radius: 9, fill: "rgba(10,20,10,0.9)", stroke: "#88cc88", lineWidth: 1.2 });
    ctx.fillStyle = "#f0ffe0";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, y + 22);
    ctx.textAlign = "left";
  }

  renderTitle() {
    const { ctx, canvas } = this;
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#9fd8ff");
    grad.addColorStop(1, "#c8f0b0");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillRect(160, 40, 560, 160);
    ctx.strokeStyle = "#88aa66";
    ctx.strokeRect(160, 40, 560, 160);
    ctx.fillStyle = "#2d5a1e";
    ctx.font = "bold 46px 'PingFang SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🌿 温馨小镇：生活模拟版 🌿", canvas.width / 2, 100);
    ctx.font = "18px sans-serif";
    ctx.fillText("每日种田、采集、钓鱼、交易、社交、建设，推进长期成长", canvas.width / 2, 138);
    ctx.font = "16px sans-serif";
    ctx.fillText("核心循环：收菜→补种→赚钱→投资升级→解锁内容", canvas.width / 2, 170);
    if (Math.floor(this.lastTime / 500) % 2 === 0) {
      ctx.font = "bold 22px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("▶ 按 Enter 开始 ◀", canvas.width / 2, 410);
    }
    ctx.textAlign = "left";
  }

  renderDialogue() {
    const { ctx, canvas } = this;
    const text = this.dialoguePages[this.dialoguePage] || "";
    this.drawPanel(40, canvas.height - 148, canvas.width - 80, 118, { fill: "rgba(10,28,10,0.92)", stroke: this.dialogueTarget?.hatColor || "#88cc66", lineWidth: 2 });
    ctx.fillStyle = "#f0ffe0";
    ctx.font = "16px 'PingFang SC', sans-serif";
    ctx.fillText(text, 60, canvas.height - 92);
    ctx.fillStyle = "#88cc88";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(this.dialoguePage >= this.dialoguePages.length - 1 ? "[E] 结束" : "[E] 下一句", canvas.width - 56, canvas.height - 44);
    ctx.textAlign = "left";
  }

  renderShop() {
    const { ctx, canvas } = this;
    const buyList = this.getShopBuyList();
    const sellList = Object.keys(this.inventory).filter(k => ITEMS[k]?.sellPrice > 0 && (this.inventory[k] || 0) > 0);
    const upgradeList = this.getUpgradeList();
    const list = this.shopMode === "buy" ? buyList : this.shopMode === "sell" ? sellList : upgradeList;

    const panelW = 560, panelH = 360;
    const px = (canvas.width - panelW) / 2;
    const py = (canvas.height - panelH) / 2;
    this.drawPanel(px, py, panelW, panelH, { fill: "rgba(10,28,10,0.95)", stroke: "#88cc66", lineWidth: 2 });
    ctx.fillStyle = "#f0d060";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🛒 生活商店", canvas.width / 2, py + 30);

    ["buy", "sell", "upgrade"].forEach((m, i) => {
      const active = this.shopMode === m;
      ctx.fillStyle = active ? "#88cc66" : "#446644";
      ctx.fillRect(px + 14 + i * 120, py + 44, 110, 26);
      ctx.fillStyle = active ? "#001800" : "#88cc88";
      ctx.font = "14px sans-serif";
      ctx.fillText(m === "buy" ? "购买" : m === "sell" ? "出售" : "投资", px + 69 + i * 120, py + 62);
    });

    ctx.fillStyle = "#f0d060";
    ctx.fillText(`💰 ${this.gold}`, px + panelW - 70, py + 30);
    ctx.textAlign = "left";

    list.forEach((entry, i) => {
      const y = py + 94 + i * 34;
      const selected = i === this.shopSelection;
      if (selected) {
        ctx.fillStyle = "rgba(100,180,80,0.25)";
        ctx.fillRect(px + 12, y - 16, panelW - 24, 30);
      }
      if (this.shopMode === "upgrade") {
        const u = entry;
        ctx.fillStyle = "#f0ffe0";
        ctx.fillText(`${u.name}｜${u.desc}`, px + 20, y);
        const c = u.cost;
        ctx.fillStyle = "#f0d060";
        ctx.fillText(`费用: ${c.gold || 0}金 ${c.wood ? `木${c.wood}` : ""} ${c.stone ? `石${c.stone}` : ""}`, px + 300, y);
      } else {
        const key = entry;
        ctx.fillStyle = "#f0ffe0";
        ctx.fillText(`${ITEMS[key].icon} ${ITEMS[key].name}`, px + 20, y);
        ctx.fillStyle = "#88aaaa";
        ctx.fillText(ITEMS[key].desc, px + 180, y);
        const price = this.shopMode === "buy" ? ITEMS[key].buyPrice : ITEMS[key].sellPrice;
        ctx.fillStyle = "#f0d060";
        ctx.fillText(`${price}金  持有:${this.inventory[key] || 0}`, px + 420, y);
      }
    });

    ctx.fillStyle = "#88cc88";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("↑↓ 选择  E购买/出售/投资  Tab分页  ESC离开", canvas.width / 2, py + panelH - 14);
    ctx.textAlign = "left";
  }

  renderInventory() {
    const { ctx, canvas } = this;
    const panelW = 540, panelH = 360;
    const px = (canvas.width - panelW) / 2;
    const py = (canvas.height - panelH) / 2;
    this.drawPanel(px, py, panelW, panelH, { fill: "rgba(10,28,10,0.95)", stroke: "#88cc66", lineWidth: 2 });
    ctx.fillStyle = "#f0d060";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎒 背包与经营资产", canvas.width / 2, py + 30);

    const entries = Object.entries(this.inventory);
    entries.forEach(([key, count], i) => {
      const col = i % 4, row = Math.floor(i / 4);
      const bx = px + 24 + col * 126, by = py + 66 + row * 74;
      ctx.fillStyle = "rgba(60,100,60,0.6)";
      ctx.fillRect(bx, by, 112, 62);
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(`${ITEMS[key]?.icon || "?"} ${ITEMS[key]?.name || key}`, bx + 8, by + 24);
      ctx.fillStyle = "#f0d060";
      ctx.fillText(`数量: ${count}  估值:${(ITEMS[key]?.sellPrice || 0) * count}`, bx + 8, by + 46);
    });

    ctx.fillStyle = "#88cc88";
    ctx.font = "13px sans-serif";
    ctx.fillText("提示：农作物卖钱→投资升级→解锁新区域与新种子。", canvas.width / 2, py + panelH - 18);
    ctx.textAlign = "left";
  }

  renderFishing() {
    const { ctx, canvas } = this;
    ctx.fillStyle = "rgba(0,20,60,0.55)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const panelW = 220, panelH = 340;
    const px = canvas.width / 2 - panelW / 2;
    const py = canvas.height / 2 - panelH / 2;
    ctx.fillStyle = "rgba(10,40,80,0.92)";
    ctx.fillRect(px, py, panelW, panelH);
    ctx.strokeStyle = "#4fa8e0";
    ctx.strokeRect(px, py, panelW, panelH);
    ctx.fillStyle = "#c8e8ff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎣 钓鱼", canvas.width / 2, py + 28);

    if (this.fishingState === "casting" || this.fishingState === "biting") {
      ctx.fillStyle = "#88ccff";
      ctx.font = "14px sans-serif";
      ctx.fillText(this.fishingState === "casting" ? "等待鱼上钩…" : "鱼咬钩了！", canvas.width / 2, py + 170);
    }
    if (this.fishingState === "reeling") {
      const trackX = px + 30, trackY = py + 50, trackW = 30, trackH = 240;
      ctx.fillStyle = "rgba(100,200,255,0.2)";
      ctx.fillRect(trackX, trackY, trackW, trackH);
      ctx.fillStyle = "#4fa8e0";
      ctx.beginPath();
      ctx.arc(trackX + trackW / 2, py + 50 + (this.fishingFishY / 320) * trackH, 14, 0, Math.PI * 2);
      ctx.fill();
      const barY = py + 50 + (this.fishingBarY / 320) * trackH;
      ctx.fillStyle = "rgba(100,255,100,0.6)";
      ctx.fillRect(trackX + trackW + 8, barY, 20, (50 / 320) * trackH);
      ctx.fillStyle = `hsl(${this.fishingProgress * 1.2}, 90%, 55%)`;
      ctx.fillRect(px + 90, py + 60 + (1 - this.fishingProgress / 100) * 220, 30, (this.fishingProgress / 100) * 220);
      ctx.strokeStyle = "#88cc88";
      ctx.strokeRect(px + 90, py + 60, 30, 220);
    }
    if (this.fishingState === "result" && this.fishingResult) {
      ctx.fillStyle = "#f0d060";
      ctx.font = "36px serif";
      ctx.fillText(this.fishingResult.icon, canvas.width / 2, py + 160);
      ctx.fillStyle = "#f0ffe0";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`钓到 ${this.fishingResult.name}`, canvas.width / 2, py + 200);
      ctx.fillStyle = "#88ccff";
      ctx.fillText(`基础价值: ${this.fishingResult.value}`, canvas.width / 2, py + 226);
    }
    ctx.fillStyle = "#88cc88";
    ctx.font = "13px sans-serif";
    ctx.fillText("空格/E 操作", canvas.width / 2, py + panelH - 14);
    ctx.textAlign = "left";
  }

  renderIndoor() {
    const { ctx, canvas } = this;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 10; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#c8964a" : "#b87c38";
        ctx.fillRect(x * 80, y * 56 + 10, 80, 56);
      }
    }
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(160, 340, 480, 80);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`🏠 小屋 Lv${this.progress.houseLevel}`, canvas.width / 2, 378);
    ctx.font = "14px sans-serif";
    ctx.fillText("升级小屋可提升移动效率并作为长期目标。按 E 返回。", canvas.width / 2, 402);
    ctx.textAlign = "left";
  }
}
