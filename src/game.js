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

const WEATHER = {
  sunny: { name: "晴朗", icon: "☀️", desc: "适合种田和跑图", autoWater: false, fishingProgress: 1, rareFishBonus: 0, forageBonus: 0, energyScale: 1, requestBonus: 1 },
  rain: { name: "细雨", icon: "🌧️", desc: "农田会自动浇水，钓鱼更稳定", autoWater: true, fishingProgress: 1.12, rareFishBonus: 0.03, forageBonus: 0, energyScale: 0.9, requestBonus: 1 },
  windy: { name: "大风", icon: "🍃", desc: "采集更容易获得额外掉落", autoWater: false, fishingProgress: 1, rareFishBonus: 0, forageBonus: 0.24, energyScale: 1, requestBonus: 1 },
  mist: { name: "薄雾", icon: "🌫️", desc: "稀有鱼更活跃，委托奖励略高", autoWater: false, fishingProgress: 1.05, rareFishBonus: 0.08, forageBonus: 0.08, energyScale: 1, requestBonus: 1.08 },
};

const SKILL_INFO = {
  farming: { label: "农耕", icon: "🌾", color: "#82d45e" },
  fishing: { label: "钓鱼", icon: "🎣", color: "#5cbaf0" },
  foraging: { label: "采集", icon: "🌿", color: "#77c37a" },
  social: { label: "社交", icon: "💬", color: "#f08ab8" },
};

const RECIPES = [
  {
    id: "fruitTea",
    name: "花果茶",
    ingredients: { fruit: 1, flower: 1 },
    energy: 20,
    effect: "social",
    amount: 2,
    desc: "恢复 20 体力，今日聊天额外 +2 好感",
  },
  {
    id: "heartyStew",
    name: "丰收炖菜",
    ingredients: { mushroom: 1, potato: 1 },
    energy: 32,
    effect: "harvest",
    amount: 0.22,
    desc: "恢复 32 体力，今日收获更容易额外 +1",
  },
  {
    id: "seaSnack",
    name: "海风小食",
    ingredients: { fish: 1, shell: 1 },
    energy: 28,
    effect: "fishing",
    amount: 0.18,
    desc: "恢复 28 体力，钓鱼进度更快、稀有鱼略多",
  },
];

const REQUEST_TEMPLATES = [
  { id: "wood-bundle", requester: "npc-chen", item: "wood", amount: [4, 6], gold: 70, favor: 5, minRank: 1 },
  { id: "stone-pile", requester: "npc-zhuang", item: "stone", amount: [4, 6], gold: 62, favor: 4, minRank: 1 },
  { id: "flower-bouquet", requester: "npc-lingling", item: "flower", amount: [2, 3], gold: 48, favor: 6, minRank: 1 },
  { id: "fruit-basket", requester: "npc-lingling", item: "fruit", amount: [2, 4], gold: 62, favor: 5, minRank: 1 },
  { id: "river-supply", requester: "npc-maomao", item: "fish", amount: [1, 2], gold: 74, favor: 6, minRank: 1 },
  { id: "mushroom-soup", requester: "npc-zhuang", item: "mushroom", amount: [2, 3], gold: 78, favor: 6, minRank: 2 },
  { id: "blueberry-jam", requester: "npc-lingling", item: "blueberry", amount: [2, 3], gold: 126, favor: 8, minRank: 2 },
  { id: "night-catch", requester: "npc-maomao", item: "nightFish", amount: [1, 2], gold: 138, favor: 8, minRank: 2 },
  { id: "corn-stock", requester: "npc-chen", item: "corn", amount: [2, 3], gold: 148, favor: 8, minRank: 3 },
  { id: "gold-koi", requester: "npc-maomao", item: "goldKoi", amount: [1, 1], gold: 220, favor: 12, minRank: 3 },
  { id: "melon-feast", requester: "npc-zhuang", item: "melon", amount: [1, 2], gold: 188, favor: 10, minRank: 4 },
];

const ITEMS = {
  wood: { name: "木材", icon: "🪵", sellPrice: 6, buyPrice: 18, desc: "建造材料" },
  fruit: { name: "果子", icon: "🍎", sellPrice: 10, buyPrice: 24, desc: "新鲜水果" },
  fish: { name: "普通鱼", icon: "🐟", sellPrice: 18, buyPrice: 0, desc: "常见河鱼" },
  nightFish: { name: "夜行鱼", icon: "🌙🐠", sellPrice: 36, buyPrice: 0, desc: "只在夜晚活跃" },
  silverFish: { name: "银鳞鱼", icon: "🐠", sellPrice: 26, buyPrice: 0, desc: "雨天更容易钓到" },
  goldKoi: { name: "锦鲤", icon: "🐡", sellPrice: 74, buyPrice: 0, desc: "很少见的漂亮鱼" },
  flower: { name: "花", icon: "🌸", sellPrice: 8, buyPrice: 0, desc: "野花" },
  stone: { name: "石头", icon: "🪨", sellPrice: 5, buyPrice: 14, desc: "坚硬石材" },
  mushroom: { name: "蘑菇", icon: "🍄", sellPrice: 14, buyPrice: 0, desc: "林地采集物" },
  shell: { name: "贝壳", icon: "🐚", sellPrice: 12, buyPrice: 0, desc: "海滩采集物" },
  turnip: { name: "萝卜", icon: "🥕", sellPrice: 18, buyPrice: 0, desc: "短周期作物" },
  potato: { name: "土豆", icon: "🥔", sellPrice: 30, buyPrice: 0, desc: "中期作物" },
  blueberry: { name: "蓝莓", icon: "🫐", sellPrice: 48, buyPrice: 0, desc: "高价值作物" },
  corn: { name: "玉米", icon: "🌽", sellPrice: 68, buyPrice: 0, desc: "高产耐种作物" },
  pumpkin: { name: "南瓜", icon: "🎃", sellPrice: 82, buyPrice: 0, desc: "后期高收益" },
  melon: { name: "甜瓜", icon: "🍈", sellPrice: 110, buyPrice: 0, desc: "高阶高价作物" },
  seed_turnip: { name: "萝卜种子", icon: "🌱", sellPrice: 2, buyPrice: 14, desc: "2天成熟" },
  seed_potato: { name: "土豆种子", icon: "🌾", sellPrice: 3, buyPrice: 24, desc: "3天成熟" },
  seed_blueberry: { name: "蓝莓种子", icon: "🫐", sellPrice: 4, buyPrice: 34, desc: "4天成熟" },
  seed_corn: { name: "玉米种子", icon: "🌽", sellPrice: 6, buyPrice: 44, desc: "4天成熟，产量稳定" },
  seed_pumpkin: { name: "南瓜种子", icon: "🎃", sellPrice: 5, buyPrice: 52, desc: "5天成熟" },
  seed_melon: { name: "甜瓜种子", icon: "🍈", sellPrice: 8, buyPrice: 72, desc: "6天成熟，高阶作物" },
};

const CROPS = {
  turnip: { name: "萝卜", seed: "seed_turnip", harvest: "turnip", growDays: 2, stages: 3, yield: [1, 2], unlock: 1, waterNeed: 2 },
  potato: { name: "土豆", seed: "seed_potato", harvest: "potato", growDays: 3, stages: 4, yield: [1, 2], unlock: 1, waterNeed: 3 },
  blueberry: { name: "蓝莓", seed: "seed_blueberry", harvest: "blueberry", growDays: 4, stages: 4, yield: [2, 3], unlock: 2, waterNeed: 4 },
  corn: { name: "玉米", seed: "seed_corn", harvest: "corn", growDays: 4, stages: 4, yield: [2, 4], unlock: 3, waterNeed: 4 },
  pumpkin: { name: "南瓜", seed: "seed_pumpkin", harvest: "pumpkin", growDays: 5, stages: 5, yield: [1, 2], unlock: 3, waterNeed: 5 },
  melon: { name: "甜瓜", seed: "seed_melon", harvest: "melon", growDays: 6, stages: 5, yield: [1, 2], unlock: 4, waterNeed: 5 },
};

const NPCS = [
  { id: "npc-lingling", name: "小玲", baseX: 450, baseY: 300, color: "#e888aa", hatColor: "#ff6688", likes: ["flower", "blueberry", "melon"] },
  { id: "npc-chen", name: "老陈", baseX: 870, baseY: 280, color: "#8855aa", hatColor: "#aa44cc", likes: ["potato", "wood", "corn"] },
  { id: "npc-maomao", name: "毛毛", baseX: 300, baseY: 620, color: "#f0c040", hatColor: "#e0a020", likes: ["fish", "nightFish", "goldKoi"] },
  { id: "npc-zhuang", name: "阿壮", baseX: 700, baseY: 650, color: "#55aa55", hatColor: "#339933", likes: ["pumpkin", "mushroom", "melon"] },
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
    this.baseMoveSpeed = 185;
    this.baseEnergy = 100;
    this.energy = this.baseEnergy;
    this.maxEnergy = this.baseEnergy;
    this.weather = this.rollWeather(this.gameDay);
    this.tomorrowWeather = this.rollWeather(this.gameDay + 1);
    this.currentBuff = null;

    this.player = { x: 420, y: 420, size: 26, speed: this.baseMoveSpeed, facing: "down", name: "旅行者" };
    this.inventory = { seed_turnip: 3, wood: 2 };
    this.selectedSeedIndex = 0;

    this.progress = {
      houseLevel: 1,
      farmLevel: 1,
      bridgeRepaired: false,
      eastUnlocked: false,
      harvestCount: 0,
      fishCaught: 0,
      forageCount: 0,
      requestsCompleted: 0,
      mealsCooked: 0,
      totalEarned: 0,
      townRank: 1,
    };

    this.relationship = {};
    this.dailyActions = { talked: {}, gifted: {} };
    this.skills = this.createSkills();
    this.dayStats = this.createDayStats();

    this.tileMap = this.createTileMap();
    this.interactables = this.createInteractables();
    this.npcs = this.createNpcs();
    this.farmPlots = this.createFarmPlots();

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
    this.dailyRequests = this.createDailyRequests();
    this.particles = [];
    this.houseSelection = 0;

    this.applyProgressDerivedStats();
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
    const startX = 92;
    const startY = 724;
    const cols = 6;
    const rows = 5;
    let id = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const lockedLevel = y >= 4 || x >= 5 ? 3 : y >= 2 ? 2 : 1;
        plots.push({ id: `plot-${id++}`, x: startX + x * 54, y: startY + y * 54, w: 44, h: 44, tilled: false, watered: false, cropKey: null, stage: 0, growthMinutes: 0, wateredDays: 0, ready: false, lockedLevel });
      }
    }
    return plots;
  }

  createInteractables() {
    return [
      { id:"tree-1",type:"tree",x:80,y:80,w:64,h:78,item:"wood",amount:1,collected:false,regrowTimer:0,regrowTime:60000,name:"大橡树" },
      { id:"tree-2",type:"tree",x:200,y:100,w:64,h:78,item:"wood",amount:1,collected:false,regrowTimer:0,regrowTime:55000,name:"小枫树" },
      { id:"tree-3",type:"tree",x:960,y:160,w:64,h:78,item:"wood",amount:2,collected:false,regrowTimer:0,regrowTime:70000,name:"果树",extraItem:"fruit" },
      { id:"tree-4",type:"tree",x:1130,y:90,w:64,h:78,item:"wood",amount:1,collected:false,regrowTimer:0,regrowTime:60000,name:"松树",eastOnly:true },
      { id:"bush-1",type:"bush",x:258,y:198,w:58,h:42,item:"fruit",amount:2,collected:false,regrowTimer:0,regrowTime:70000,name:"莓果灌木" },
      { id:"bush-2",type:"bush",x:1096,y:252,w:58,h:42,item:"fruit",amount:2,collected:false,regrowTimer:0,regrowTime:70000,name:"东区果丛",eastOnly:true },
      { id:"flower-1",type:"flower",x:160,y:200,w:32,h:32,item:"flower",amount:1,collected:false,regrowTimer:0,regrowTime:40000,name:"野花丛" },
      { id:"flower-2",type:"flower",x:1050,y:200,w:32,h:32,item:"flower",amount:1,collected:false,regrowTimer:0,regrowTime:40000,name:"紫罗兰",eastOnly:true },
      { id:"mush-1",type:"mushroom",x:320,y:340,w:36,h:36,item:"mushroom",amount:1,collected:false,regrowTimer:0,regrowTime:90000,name:"红蘑菇" },
      { id:"mush-2",type:"mushroom",x:1180,y:380,w:36,h:36,item:"mushroom",amount:2,collected:false,regrowTimer:0,regrowTime:90000,name:"棕蘑菇",eastOnly:true },
      { id:"stone-1",type:"stone",x:500,y:480,w:58,h:44,item:"stone",amount:1,collected:false,regrowTimer:0,regrowTime:120000,name:"圆石" },
      { id:"stone-2",type:"stone",x:830,y:500,w:58,h:44,item:"stone",amount:1,collected:false,regrowTimer:0,regrowTime:120000,name:"大岩石",eastOnly:true },
      { id:"shell-1",type:"shell",x:100,y:430,w:28,h:20,item:"shell",amount:1,collected:false,regrowTimer:0,regrowTime:50000,name:"贝壳" },
      { id:"shell-2",type:"shell",x:180,y:460,w:28,h:20,item:"shell",amount:1,collected:false,regrowTimer:0,regrowTime:50000,name:"螺壳" },
      { id:"fish-1",type:"fishspot",x:680,y:290,w:40,h:40,item:null,amount:0,collected:false,regrowTimer:0,regrowTime:0,name:"钓鱼点" },
      { id:"fish-2",type:"fishspot",x:1080,y:322,w:40,h:40,item:null,amount:0,collected:false,regrowTimer:0,regrowTime:0,name:"东区深水点",eastOnly:true },
      { id:"house-1",type:"house",x:560,y:130,w:170,h:150,name:"你的小屋" },
      { id:"shop-1",type:"shop",x:820,y:130,w:160,h:140,name:"老陈的商店" },
      { id:"sign-1",type:"sign",x:400,y:530,w:30,h:44,name:"公告牌",text:"公告牌会刷新每日委托；小屋里可以做料理和休息。" },
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
      { id: "daily-farm", title: "农场起步", desc: "播种并收获 5 次作物", done: false, check: () => this.progress.harvestCount >= 5, reward: { gold: 100 } },
      { id: "builder", title: "家园建设", desc: "将小屋升级到 2 级", done: false, check: () => this.progress.houseLevel >= 2, reward: { item: "seed_blueberry", amount: 4 } },
      { id: "social", title: "邻里关系", desc: "任意 NPC 好感达到 30", done: false, check: () => Object.values(this.relationship).some(v => v >= 30), reward: { gold: 140 } },
      { id: "bridge", title: "通往东区", desc: "修复旧桥并解锁东区", done: false, check: () => this.progress.bridgeRepaired, reward: { item: "seed_pumpkin", amount: 3 } },
      { id: "cook", title: "温暖餐桌", desc: "在小屋完成 3 次料理", done: false, check: () => this.progress.mealsCooked >= 3, reward: { gold: 180 } },
      { id: "farm-expand", title: "大农庄", desc: "将农场扩建到 3 级", done: false, check: () => this.progress.farmLevel >= 3, reward: { item: "seed_corn", amount: 4 } },
      { id: "request-board", title: "镇上帮手", desc: "完成 6 个每日委托", done: false, check: () => this.progress.requestsCompleted >= 6, reward: { gold: 220 } },
      { id: "town", title: "镇子繁荣", desc: "累计赚到 2500 金币", done: false, check: () => this.progress.totalEarned >= 2500, reward: { gold: 300 } },
    ];
  }

  createSkills() {
    return Object.fromEntries(Object.keys(SKILL_INFO).map((key) => [key, { level: 1, xp: 0 }]));
  }

  createDayStats() {
    return { harvested: 0, foraged: 0, fishCaught: 0, requests: 0, cooked: 0 };
  }

  createDailyRequests() {
    const available = REQUEST_TEMPLATES.filter((template) => template.minRank <= this.progress.townRank + 1);
    const pool = [...available];
    const chosen = [];
    while (pool.length > 0 && chosen.length < 3) {
      const index = Math.floor(Math.random() * pool.length);
      chosen.push(this.instantiateRequest(pool.splice(index, 1)[0]));
    }
    return chosen;
  }

  instantiateRequest(template) {
    const [minAmount, maxAmount] = template.amount;
    const amount = minAmount + Math.floor(Math.random() * (maxAmount - minAmount + 1));
    const weatherCfg = this.getWeatherConfig();
    const marketBonus = this.isMarketDay() ? 1.12 : 1;
    return {
      id: `${template.id}-${this.gameDay}-${Math.floor(Math.random() * 10000)}`,
      requester: template.requester,
      item: template.item,
      amount,
      gold: Math.round(template.gold * marketBonus * weatherCfg.requestBonus),
      favor: template.favor,
      done: false,
    };
  }

  applyProgressDerivedStats() {
    this.player.speed = this.baseMoveSpeed + (this.progress.houseLevel - 1) * 6;
    this.maxEnergy = this.baseEnergy + (this.progress.houseLevel - 1) * 14;
    this.energy = Math.min(this.energy, this.maxEnergy);
  }

  rollWeather(day) {
    const townRank = this.progress?.townRank || 1;
    const seed = Math.abs(Math.sin(day * 97.13 + townRank * 0.73));
    if (seed < 0.4) return "sunny";
    if (seed < 0.67) return "rain";
    if (seed < 0.88) return "windy";
    return "mist";
  }

  saveGame() {
    const data = {
      gold: this.gold,
      energy: this.energy,
      inventory: this.inventory,
      gameDay: this.gameDay,
      gameMinutes: this.gameMinutes,
      weather: this.weather,
      tomorrowWeather: this.tomorrowWeather,
      currentBuff: this.currentBuff,
      player: { x: this.player.x, y: this.player.y },
      interactables: this.interactables.map(o => ({ id: o.id, collected: o.collected, regrowTimer: o.regrowTimer || 0 })),
      farmPlots: this.farmPlots,
      progress: this.progress,
      relationship: this.relationship,
      skills: this.skills,
      dailyRequests: this.dailyRequests,
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
      this.energy = data.energy ?? this.energy;
      this.inventory = data.inventory ?? this.inventory;
      this.gameDay = data.gameDay ?? this.gameDay;
      this.gameMinutes = data.gameMinutes ?? this.gameMinutes;
      this.weather = data.weather || this.weather;
      this.tomorrowWeather = data.tomorrowWeather || this.tomorrowWeather;
      this.currentBuff = data.currentBuff && data.currentBuff.day === this.gameDay ? data.currentBuff : null;
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
      if (data.skills) {
        this.skills = Object.fromEntries(Object.keys(SKILL_INFO).map((key) => [
          key,
          { ...this.skills[key], ...data.skills[key] },
        ]));
      }
      if (Array.isArray(data.dailyRequests) && data.dailyRequests.length) this.dailyRequests = data.dailyRequests;
      this.applyProgressDerivedStats();
      if (!this.dailyRequests?.length) this.dailyRequests = this.createDailyRequests();
    } catch (e) {}
  }

  bindEvents() {
    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      if (["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d","e","escape","enter"," ","i","tab","q","g","r"].includes(key)) e.preventDefault();
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
        this.handleIndoorInput(key);
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
      this.advanceToNextDay(false);
    }

    this.updateMessage(dt);
    this.updateParticles(dt);
    this.updateInteractables(dt);
    this.updateFarm(deltaGameMinutes);
    this.updateNpcs(dt);

    if (this.scene === SCENE.PLAYING || this.scene === SCENE.INDOOR) this.updatePlayer(dt / 1000);
    if (this.scene === SCENE.FISHING) this.updateFishing(dt);

    this.updateCamera();
    this.checkQuests();
    this.updateTownRank();
  }

  advanceToNextDay(rested = false) {
    this.gameDay += 1;
    this.gameMinutes = 6 * 60;
    this.onNewDay(rested);
  }

  onNewDay(rested = false) {
    const summary = `昨日 收${this.dayStats.harvested} / 采${this.dayStats.foraged} / 钓${this.dayStats.fishCaught} / 委${this.dayStats.requests}`;
    this.dailyActions = { talked: {}, gifted: {} };
    this.currentBuff = null;
    this.dayStats = this.createDayStats();
    this.weather = this.tomorrowWeather || this.rollWeather(this.gameDay);
    this.tomorrowWeather = this.rollWeather(this.gameDay + 1);
    this.dailyRequests = this.createDailyRequests();
    this.farmPlots.forEach((p) => {
      p.watered = false;
      if (this.getWeatherConfig().autoWater && p.cropKey) {
        p.watered = true;
        p.wateredDays += 1;
      }
    });
    this.interactables.forEach((o) => {
      if (o.collected && o.regrowTime > 0) {
        o.collected = false;
        o.regrowTimer = 0;
      }
    });
    this.energy = rested ? this.maxEnergy : Math.max(44, Math.floor(this.maxEnergy * 0.72));
    const dayTip = this.isMarketDay() ? "今天是集市日，出售收益更高。" : "公告牌委托已经刷新。";
    const restTip = rested ? "睡了个好觉，体力已回满。" : "忙到了天亮，体力没有完全恢复。";
    this.showMessage(`第 ${this.gameDay} 天：${this.getWeatherConfig().icon}${this.getWeatherConfig().name}。${dayTip}${restTip} ${summary}`, 4200);
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
    const relationScore = Object.values(this.relationship).reduce((a, b) => a + b, 0) / 14;
    const skillScore = Object.values(this.skills).reduce((sum, skill) => sum + (skill.level - 1), 0) * 1.5;
    const score = this.progress.harvestCount + this.progress.forageCount + Math.floor(this.progress.totalEarned / 250) + relationScore + this.progress.houseLevel * 2 + this.progress.farmLevel * 3 + this.progress.requestsCompleted * 2 + this.progress.mealsCooked + skillScore + (this.progress.bridgeRepaired ? 4 : 0);
    this.progress.townRank = Math.max(1, Math.min(6, Math.floor(score / 8) + 1));
  }

  getWeatherConfig() {
    return WEATHER[this.weather] || WEATHER.sunny;
  }

  isMarketDay() {
    return this.gameDay % 5 === 0;
  }

  getSkillLevel(key) {
    return this.skills[key]?.level || 1;
  }

  getSkillXpNeed(level) {
    return 18 + level * 14;
  }

  gainSkillXp(key, amount) {
    const skill = this.skills[key];
    if (!skill || amount <= 0) return [];
    skill.xp += amount;
    const messages = [];
    while (skill.xp >= this.getSkillXpNeed(skill.level)) {
      skill.xp -= this.getSkillXpNeed(skill.level);
      skill.level += 1;
      messages.push(`${SKILL_INFO[key].label} Lv${skill.level}`);
    }
    return messages;
  }

  formatLevelUps(levelUps) {
    return levelUps.length ? ` ｜ ${levelUps.join("、")}` : "";
  }

  getBuffValue(effect) {
    return this.currentBuff?.day === this.gameDay && this.currentBuff.effect === effect ? this.currentBuff.amount : 0;
  }

  getHarvestBonusChance() {
    return Math.min(0.75, 0.08 * (this.getSkillLevel("farming") - 1) + this.getBuffValue("harvest"));
  }

  getForageBonusChance() {
    return Math.min(0.85, 0.12 * (this.getSkillLevel("foraging") - 1) + this.getWeatherConfig().forageBonus);
  }

  getTalkBonus() {
    return 2 + Math.floor((this.getSkillLevel("social") - 1) / 2) + this.getBuffValue("social");
  }

  getGiftBonus(isFavorite) {
    return (isFavorite ? 8 : 3) + Math.floor((this.getSkillLevel("social") - 1) / 2);
  }

  getFishingProgressMultiplier() {
    return this.getWeatherConfig().fishingProgress + (this.getSkillLevel("fishing") - 1) * 0.06 + this.getBuffValue("fishing");
  }

  getRareFishChance() {
    return 0.06 + this.getWeatherConfig().rareFishBonus + (this.getSkillLevel("fishing") - 1) * 0.03 + this.getBuffValue("fishing") * 0.35;
  }

  getCurrentMoveSpeed() {
    if (this.energy <= 15) return this.player.speed * 0.74;
    if (this.energy <= 35) return this.player.speed * 0.88;
    return this.player.speed;
  }

  consumeEnergy(cost, failText = "体力不足，先回小屋休息或做料理。") {
    const scaledCost = Math.max(1, Math.round(cost * this.getWeatherConfig().energyScale));
    if (this.energy < scaledCost) {
      this.showMessage(failText, 1700);
      return false;
    }
    this.energy = Math.max(0, this.energy - scaledCost);
    return true;
  }

  restoreEnergy(amount) {
    this.energy = Math.min(this.maxEnergy, this.energy + amount);
  }

  getNpcName(id) {
    return NPCS.find((npc) => npc.id === id)?.name || "居民";
  }

  getPendingRequests() {
    return this.dailyRequests.filter((request) => !request.done);
  }

  getRecipeList() {
    return RECIPES;
  }

  getHouseActions() {
    return [
      { type: "rest", label: "休息到次日", desc: "恢复全部体力，并刷新天气与委托" },
      { type: "save", label: "整理日记", desc: "立即手动保存当前进度" },
      ...this.getRecipeList().map((recipe) => ({ type: "recipe", recipe, label: `做料理：${recipe.name}`, desc: recipe.desc })),
    ];
  }

  handleIndoorInput(key) {
    const actions = this.getHouseActions();
    if (key === "escape") {
      this.scene = SCENE.PLAYING;
      return;
    }
    if (key === "arrowdown" || key === "s") {
      this.houseSelection = (this.houseSelection + 1) % actions.length;
      return;
    }
    if (key === "arrowup" || key === "w") {
      this.houseSelection = (this.houseSelection - 1 + actions.length) % actions.length;
      return;
    }
    if (key === "e" || key === "enter" || key === " ") {
      this.performHouseAction(actions[this.houseSelection]);
    }
  }

  performHouseAction(action) {
    if (!action) return;
    if (action.type === "rest") {
      this.advanceToNextDay(true);
      this.scene = SCENE.PLAYING;
      return;
    }
    if (action.type === "save") {
      this.saveGame();
      return;
    }
    if (action.type === "recipe") this.cookRecipe(action.recipe);
  }

  cookRecipe(recipe) {
    if (!recipe) return;
    const missing = Object.entries(recipe.ingredients).find(([key, count]) => (this.inventory[key] || 0) < count);
    if (missing) {
      this.showMessage(`材料不足：${ITEMS[missing[0]].name} x${missing[1]}`, 1700);
      return;
    }
    Object.entries(recipe.ingredients).forEach(([key, count]) => this.removeItem(key, count));
    this.restoreEnergy(recipe.energy);
    this.currentBuff = { id: recipe.id, effect: recipe.effect, amount: recipe.amount, label: recipe.name, day: this.gameDay };
    this.progress.mealsCooked += 1;
    this.dayStats.cooked += 1;
    const skillKey = recipe.effect === "fishing" ? "fishing" : recipe.effect === "social" ? "social" : "farming";
    const levelUps = this.gainSkillXp(skillKey, 2);
    this.showMessage(`做出了 ${recipe.name}，体力 +${recipe.energy}${this.formatLevelUps(levelUps)}`, 2200);
  }

  tryCompleteRequests() {
    const ready = [];
    const available = { ...this.inventory };
    this.getPendingRequests().forEach((request) => {
      if ((available[request.item] || 0) >= request.amount) {
        ready.push(request);
        available[request.item] -= request.amount;
      }
    });
    if (!ready.length) return false;

    let totalGold = 0;
    ready.forEach((request) => {
      this.removeItem(request.item, request.amount);
      this.gold += request.gold;
      this.progress.totalEarned += request.gold;
      totalGold += request.gold;
      request.done = true;
      const favorGain = request.favor + Math.floor((this.getSkillLevel("social") - 1) / 2);
      this.relationship[request.requester] = Math.min(100, (this.relationship[request.requester] || 0) + favorGain);
      this.progress.requestsCompleted += 1;
      this.dayStats.requests += 1;
    });

    const levelUps = this.gainSkillXp("social", ready.length * 4);
    this.showMessage(`提交 ${ready.length} 份委托，获得 ${totalGold} 金${this.formatLevelUps(levelUps)}`, 2600);
    return true;
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
    if (this.isMarketDay() && hour >= 12 && hour < 20) {
      if (npc.id === "npc-chen") return { x: 500, y: 548 };
      if (npc.id === "npc-lingling") return { x: 430, y: 560 };
      if (npc.id === "npc-maomao") return { x: 370, y: 594 };
      return { x: 560, y: 592 };
    }
    if (this.weather === "rain" && hour >= 9 && hour < 18) {
      if (npc.id === "npc-chen") return { x: 890, y: 260 };
      if (npc.id === "npc-lingling") return { x: 720, y: 300 };
      if (npc.id === "npc-maomao") return { x: 690, y: 336 };
      return { x: 650, y: 372 };
    }
    if (hour < 12) return { x: npc.baseX - 50, y: npc.baseY };
    if (hour < 18) {
      if (npc.id === "npc-chen") return { x: 890, y: 260 };
      if (npc.id === "npc-lingling") return { x: 200, y: 760 };
      if (npc.id === "npc-maomao") return { x: 660, y: 280 };
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
    if (mx === 0 && my === 0) return;
    const len = Math.hypot(mx, my);
    const speed = this.getCurrentMoveSpeed();
    const nx = this.player.x + (mx / len) * speed * ds;
    const ny = this.player.y + (my / len) * speed * ds;
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
    return Object.entries(CROPS)
      .sort((a, b) => a[1].unlock - b[1].unlock || a[1].growDays - b[1].growDays)
      .filter(([, crop]) => crop.unlock <= this.progress.townRank)
      .map(([, crop]) => crop.seed);
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
      if (!this.consumeEnergy(4)) return;
      plot.tilled = true;
      const levelUps = this.gainSkillXp("farming", 2);
      this.showMessage(`你翻松了土地。${this.formatLevelUps(levelUps)}`, 1500);
      return;
    }
    if (plot.cropKey && !plot.ready) {
      if (!plot.watered) {
        if (!this.consumeEnergy(2)) return;
        plot.watered = true;
        plot.wateredDays += 1;
        this.spawnParticles(plot.x + 20, plot.y + 20, "#67b6ff", 6);
        const levelUps = this.gainSkillXp("farming", 1);
        this.showMessage(`已浇水，作物今日会继续生长。${this.formatLevelUps(levelUps)}`, 1500);
      } else {
        this.showMessage("今天已经浇过水了。", 1200);
      }
      return;
    }
    if (plot.ready && plot.cropKey) {
      if (!this.consumeEnergy(2)) return;
      const crop = CROPS[plot.cropKey];
      let amount = crop.yield[0] + Math.floor(Math.random() * (crop.yield[1] - crop.yield[0] + 1));
      let bonusText = "";
      if (Math.random() < this.getHarvestBonusChance()) {
        amount += 1;
        bonusText = " 额外丰收 +1";
      }
      this.addItem(crop.harvest, amount);
      this.progress.harvestCount += amount;
      this.dayStats.harvested += amount;
      plot.cropKey = null;
      plot.stage = 0;
      plot.ready = false;
      plot.watered = false;
      plot.wateredDays = 0;
      plot.growthMinutes = 0;
      this.spawnParticles(plot.x + 20, plot.y + 20, "#a2ff6e", 9);
      const levelUps = this.gainSkillXp("farming", 4 + amount);
      this.showMessage(`收获 ${ITEMS[crop.harvest].name} x${amount}！${bonusText}${this.formatLevelUps(levelUps)}`, 2200);
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
      if (!this.consumeEnergy(1)) return;
      this.removeItem(seedKey, 1);
      plot.cropKey = cropKey;
      plot.stage = 0;
      plot.ready = false;
      plot.watered = false;
      plot.growthMinutes = 0;
      plot.wateredDays = 0;
      const levelUps = this.gainSkillXp("farming", 1);
      this.showMessage(`播种：${CROPS[cropKey].name}。记得每日浇水！${this.formatLevelUps(levelUps)}`, 1800);
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
      this.houseSelection = 0;
      this.scene = SCENE.INDOOR;
      return;
    }
    if (obj.type === "shop") {
      const h = this.gameMinutes / 60;
      const closeHour = this.isMarketDay() ? 22 : 20;
      if (h < 8 || h >= closeHour) {
        this.showMessage(`商店营业时间 08:00 - ${String(closeHour).padStart(2, "0")}:00。`, 1800);
        return;
      }
      this.scene = SCENE.SHOP;
      this.shopMode = "buy";
      this.shopSelection = 0;
      return;
    }
    if (obj.type === "sign") {
      if (this.tryCompleteRequests()) return;
      const pending = this.getPendingRequests();
      if (!pending.length) {
        this.showMessage("今天的委托都完成了，镇上的大家对你很满意。", 2600);
        return;
      }
      const preview = pending.slice(0, 2).map((request) => `${this.getNpcName(request.requester)}要 ${ITEMS[request.item].name}x${request.amount}`).join(" / ");
      this.showMessage(`公告牌：${preview}`, 3600);
      return;
    }
    if (obj.type === "fishspot") {
      if (!this.consumeEnergy(4, "体力不足，钓鱼前先回家歇会儿。")) return;
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

    if (!this.consumeEnergy(2)) return;
    obj.collected = true;
    obj.regrowTimer = 0;
    let totalAmount = 0;
    let gainedText = "";
    if (obj.item) {
      let amount = obj.amount || 1;
      if (Math.random() < this.getForageBonusChance()) amount += 1;
      this.addItem(obj.item, amount);
      totalAmount += amount;
      gainedText = `获得 ${ITEMS[obj.item].name} x${amount}`;
    }
    if (obj.extraItem) {
      const extraAmount = Math.random() < this.getForageBonusChance() ? 2 : 1;
      this.addItem(obj.extraItem, extraAmount);
      totalAmount += extraAmount;
      gainedText += ` ${ITEMS[obj.extraItem].name} x${extraAmount}`;
    }
    this.progress.forageCount += totalAmount;
    this.dayStats.foraged += totalAmount;
    const levelUps = this.gainSkillXp("foraging", 3 + totalAmount);
    this.showMessage(`${gainedText}${this.formatLevelUps(levelUps)}`, 1800);
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
    const likeBonus = this.getGiftBonus(npc.likes.includes(candidate));
    this.relationship[npc.id] = Math.min(100, (this.relationship[npc.id] || 0) + likeBonus);
    this.dailyActions.gifted[npc.id] = this.gameDay;
    const levelUps = this.gainSkillXp("social", npc.likes.includes(candidate) ? 5 : 3);
    this.showMessage(`送出 ${ITEMS[candidate]?.name || candidate}，${npc.name} 好感 +${likeBonus}${this.formatLevelUps(levelUps)}`, 2200);
  }

  startDialogue(npc) {
    let talkLevelUps = [];
    if (this.dailyActions.talked[npc.id] !== this.gameDay) {
      this.relationship[npc.id] = Math.min(100, (this.relationship[npc.id] || 0) + this.getTalkBonus());
      this.dailyActions.talked[npc.id] = this.gameDay;
      talkLevelUps = this.gainSkillXp("social", 2);
    }
    const h = this.gameMinutes / 60;
    const favor = this.relationship[npc.id] || 0;
    const pages = [];
    pages.push(`${npc.name}（好感 ${favor}/100）`);
    if (h < 12) pages.push("早上先看农田是个好习惯，浇水会决定今天收成。");
    else if (h < 18) pages.push("下午适合跑商和采集，别忘了商店晚上八点关门。");
    else pages.push("晚上钓鱼收益更高，还能和大家聊聊今天过得怎么样。");

    if (npc.id === "npc-chen") {
      pages.push(this.progress.townRank >= 4 ? "镇子越来越像样了，玉米和甜瓜种子已经进货。" : "先靠萝卜和土豆滚资金，稳定后再上高价种子。");
    }
    if (npc.id === "npc-lingling" && this.progress.harvestCount >= 10) pages.push("你已经是靠谱农夫了！继续提升农场等级吧。");
    if (npc.id === "npc-maomao") pages.push("按 G 可以送礼物，送鱼给我加好感会更快喵！");
    if (npc.id === "npc-zhuang" && this.progress.bridgeRepaired) pages.push("东区开了，资源更多，建设速度会明显提升。");
    if (this.weather === "rain") pages.push("下雨天真省心，作物会自己喝饱水。");
    if (this.isMarketDay()) pages.push("今天是集市日，卖货价格会更漂亮。");
    const request = this.getPendingRequests().find((entry) => entry.requester === npc.id);
    if (request) pages.push(`如果你愿意，今天可以帮我准备 ${ITEMS[request.item].name} x${request.amount}，去公告牌交付就行。`);
    if (talkLevelUps.length) pages.push(`交流越来越熟练了：${talkLevelUps.join("、")}`);

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
    return [...this.getUnlockedSeeds(), "wood", "stone"];
  }

  getUpgradeList() {
    return [
      { id: "house", name: "小屋升级", desc: `Lv${this.progress.houseLevel}→Lv${this.progress.houseLevel + 1} / 体力上限提升`, cost: { gold: 280 + this.progress.houseLevel * 180, wood: 14 + this.progress.houseLevel * 4, stone: 8 + this.progress.houseLevel * 3 }, can: () => this.progress.houseLevel < 4, apply: () => { this.progress.houseLevel += 1; this.applyProgressDerivedStats(); } },
      { id: "farm", name: "农场扩建", desc: `Lv${this.progress.farmLevel}→Lv${this.progress.farmLevel + 1} / 解锁更多地块`, cost: { gold: 260 + this.progress.farmLevel * 150, wood: 10 + this.progress.farmLevel * 5 }, can: () => this.progress.farmLevel < 3, apply: () => { this.progress.farmLevel += 1; } },
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
      } else if (this.shopMode === "sell") {
        const itemKey = list[this.shopSelection];
        const hour = this.gameMinutes / 60;
        const nightBonus = (itemKey === "fish" || itemKey === "nightFish") && hour >= 18 ? 1.25 : 1;
        const marketBonus = this.isMarketDay() ? 1.15 : 1;
        const price = Math.floor(ITEMS[itemKey].sellPrice * nightBonus * marketBonus);
        this.removeItem(itemKey, 1);
        this.gold += price;
        this.progress.totalEarned += price;
        this.showMessage(`卖出 ${ITEMS[itemKey].name} +${price}金`, 1400);
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
      }
    }
  }

  handleFishingInput() {
    if (this.fishingState === "biting") {
      this.fishingState = "reeling";
      this.fishingBarY = 180;
      this.fishingFishY = 80 + Math.random() * 180;
      this.fishingProgress = 18 + (this.getSkillLevel("fishing") - 1) * 4 + Math.round(this.getBuffValue("fishing") * 30);
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
      this.fishingProgress += overlap ? dt * 0.05 * this.getFishingProgressMultiplier() : -dt * 0.04;
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
    const rareChance = this.getRareFishChance();
    let key = "fish";
    if (Math.random() < rareChance) key = "goldKoi";
    else if (night && Math.random() < 0.55) key = "nightFish";
    else if ((this.weather === "rain" || this.weather === "mist") && Math.random() < 0.32) key = "silverFish";
    this.addItem(key, 1);
    this.progress.fishCaught += 1;
    this.dayStats.fishCaught += 1;
    const xp = key === "goldKoi" ? 10 : key === "nightFish" ? 7 : 5;
    const levelUps = this.gainSkillXp("fishing", xp);
    this.fishingResult = { name: ITEMS[key].name, icon: ITEMS[key].icon, value: ITEMS[key].sellPrice };
    this.fishingState = "result";
    this.spawnParticles(this.canvas.width / 2, 300, "#4fa8e0", 10);
    this.showMessage(`钓到 ${ITEMS[key].name}${this.formatLevelUps(levelUps)}`, 2200);
  }

  checkQuests() {
    this.quests.forEach((q) => {
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
    if (this.scene === SCENE.INDOOR) { this.renderIndoor(); this.renderMessage(); return; }
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
    this.renderFarmPlots();
    this.renderInteractables();
    this.renderNpcs();
    this.renderPlayer();
    this.renderParticles();
    ctx.restore();

    this.renderNightOverlay();
    this.renderWeatherEffects();
    this.renderHud();
    this.renderQuestTracker();
    this.renderSkillPanel();
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

        if (tile === TILE.WATER) {
          const wave = Math.sin((tx + ty + this.gameMinutes * 0.05) * 0.8) * 2;
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(px + 6, py + 20 + wave);
          ctx.lineTo(px + 42, py + 20 + wave);
          ctx.stroke();
        }
      }
    }
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
      else if (obj.type === "bush") this.drawBush(obj);
      else if (obj.type === "flower") this.drawFlower(obj);
      else if (obj.type === "mushroom") this.drawMushroom(obj);
      else if (obj.type === "stone") this.drawStone(obj);
      else if (obj.type === "fishspot") this.drawFishspot(obj);
      else if (obj.type === "house") this.drawHouse(obj);
      else if (obj.type === "shop") this.drawShop(obj);
      else if (obj.type === "sign") this.drawSign(obj);
      else if (obj.type === "shell") this.drawShell(obj);
      else if (obj.type === "bridge") this.drawBridge(obj);

      if (obj.type === "sign" && this.getPendingRequests().some((request) => (this.inventory[request.item] || 0) >= request.amount)) {
        ctx.fillStyle = "#ffd86b";
        ctx.beginPath();
        ctx.arc(obj.x + obj.w - 2, obj.y - 6, 7, 0, Math.PI * 2);
        ctx.fill();
      }

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
  drawBush(obj){const {ctx}=this;ctx.fillStyle="#4e853a";ctx.beginPath();ctx.ellipse(obj.x+30,obj.y+24,28,20,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=obj.collected?"#9acb82":"#d44d62";for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(obj.x+14+i*10,obj.y+18+(i%2)*8,4,0,Math.PI*2);ctx.fill();}}
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
    ctx.fillStyle = "#3a6abf";
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
    ctx.fillStyle = "#ffdbb0";
    ctx.fillRect(x - 8, y - size / 2 + 2, 16, 12);
    ctx.fillStyle = "#c03020";
    ctx.fillRect(x - size / 2 + 2, y - size / 2 - 8, size - 4, 10);
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

  renderWeatherEffects() {
    const { ctx, canvas } = this;
    if (this.weather === "rain") {
      ctx.save();
      ctx.strokeStyle = "rgba(185,220,255,0.45)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 34; i++) {
        const x = (i * 31 + this.lastTime * 0.22) % (canvas.width + 40);
        const y = (i * 17 + this.lastTime * 0.36) % (canvas.height + 30);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 10, y + 18);
        ctx.stroke();
      }
      ctx.restore();
    }
    if (this.weather === "windy") {
      ctx.save();
      ctx.strokeStyle = "rgba(222,255,200,0.35)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 12; i++) {
        const x = (i * 70 + this.lastTime * 0.08) % (canvas.width + 120) - 60;
        const y = 70 + (i % 4) * 86;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x + 18, y - 10, x + 50, y + 10, x + 74, y);
        ctx.stroke();
      }
      ctx.restore();
    }
    if (this.weather === "mist") {
      ctx.fillStyle = "rgba(230,240,245,0.14)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  renderHud() {
    const { ctx, canvas } = this;
    const hour = Math.floor(this.gameMinutes / 60);
    const min = Math.floor(this.gameMinutes % 60);
    const timeStr = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    const seedKeys = this.getOwnedSeedKeys();
    const activeSeed = seedKeys.length ? seedKeys[Math.min(this.selectedSeedIndex, seedKeys.length - 1)] : null;
    const weather = this.getWeatherConfig();
    const forecast = WEATHER[this.tomorrowWeather] || WEATHER.sunny;
    const energyRatio = this.maxEnergy > 0 ? this.energy / this.maxEnergy : 0;

    ctx.fillStyle = "rgba(20,36,20,0.82)";
    ctx.fillRect(10, 10, 356, 156);
    ctx.fillStyle = "#f0d040";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`💰 ${this.gold} 金币`, 22, 34);
    ctx.fillStyle = "#c8f0ff";
    ctx.font = "14px sans-serif";
    ctx.fillText(`⏰ 第${this.gameDay}天  ${timeStr}`, 22, 54);
    ctx.fillText(`🏠小屋Lv${this.progress.houseLevel}  🚜农场Lv${this.progress.farmLevel}  ⭐镇级${this.progress.townRank}`, 22, 74);
    ctx.fillText(`${weather.icon} ${weather.name}  明日 ${forecast.icon} ${forecast.name}`, 22, 94);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(22, 105, 180, 12);
    ctx.fillStyle = energyRatio > 0.35 ? "#77e07d" : "#ffb45c";
    ctx.fillRect(22, 105, 180 * energyRatio, 12);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.strokeRect(22, 105, 180, 12);
    ctx.fillStyle = "#eaf7de";
    ctx.fillText(`⚡ 体力 ${Math.round(this.energy)}/${this.maxEnergy}`, 210, 116);
    ctx.fillStyle = "#c8f0ff";
    ctx.fillText(`🌾收获:${this.progress.harvestCount}  🌿采集:${this.progress.forageCount}  📈累计赚:${this.progress.totalEarned}`, 22, 136);
    ctx.fillStyle = "#b8f0b8";
    ctx.fillText(activeSeed ? `Q切换种子：${ITEMS[activeSeed].icon}${ITEMS[activeSeed].name}(${this.inventory[activeSeed]})` : "当前无种子（去商店购买）", 22, 154);

    ctx.fillStyle = "rgba(10,20,10,0.65)";
    ctx.fillRect(canvas.width - 292, 10, 282, 156);
    ctx.fillStyle = "#c8e8c8";
    ctx.font = "12px sans-serif";
    [
      "WASD 移动 / E 互动",
      "农地：翻地→播种→浇水→收获",
      "Q 切种子 / G 送礼 / I 背包",
      "公告牌能交每日委托",
      "小屋里可做料理和休息",
      this.isMarketDay() ? "今日集市日：卖货有加成" : "Tab 商店分页 / F5 存档",
    ].forEach((line, i) => ctx.fillText(line, canvas.width - 278, 30 + i * 22));
    if (this.currentBuff) {
      ctx.fillStyle = "#ffe48f";
      ctx.fillText(`🍲 当前状态：${this.currentBuff.label}`, canvas.width - 278, 162);
    }
  }

  renderQuestTracker() {
    const { ctx, canvas } = this;
    const active = this.quests.filter(q => !q.done).slice(0, 2);
    const requests = this.getPendingRequests().slice(0, 2);
    const x = 10, y = canvas.height - 158;
    ctx.fillStyle = "rgba(20,36,20,0.82)";
    ctx.fillRect(x, y, 386, 148);
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
    ctx.fillStyle = "#f0d060";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("📬 今日委托", x + 12, y + 86);
    if (requests.length) {
      requests.forEach((request, i) => {
        ctx.fillStyle = "#d9f4ff";
        ctx.font = "12px sans-serif";
        ctx.fillText(`◆ ${this.getNpcName(request.requester)}`, x + 12, y + 108 + i * 20);
        ctx.fillStyle = "#9fd9a3";
        ctx.fillText(`${ITEMS[request.item].name}x${request.amount}  奖励${request.gold}金`, x + 104, y + 108 + i * 20);
      });
    } else {
      ctx.fillStyle = "#9fd9a3";
      ctx.fillText("今天的委托都完成了。", x + 12, y + 108);
    }
  }

  renderSkillPanel() {
    const { ctx, canvas } = this;
    const x = canvas.width - 292;
    const y = canvas.height - 122;
    ctx.fillStyle = "rgba(18,28,18,0.82)";
    ctx.fillRect(x, y, 282, 112);
    ctx.fillStyle = "#f0d060";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("📚 生活技能", x + 12, y + 20);
    Object.keys(SKILL_INFO).forEach((key, i) => {
      const info = SKILL_INFO[key];
      const skill = this.skills[key];
      const rowY = y + 40 + i * 17;
      const need = this.getSkillXpNeed(skill.level);
      const ratio = need > 0 ? skill.xp / need : 0;
      ctx.fillStyle = "#f5fff0";
      ctx.font = "11px sans-serif";
      ctx.fillText(`${info.icon} ${info.label} Lv${skill.level}`, x + 12, rowY);
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.fillRect(x + 112, rowY - 9, 148, 8);
      ctx.fillStyle = info.color;
      ctx.fillRect(x + 112, rowY - 9, 148 * ratio, 8);
    });
  }

  renderMessage() {
    const { ctx, canvas } = this;
    if (!this.interactionMessage) return;
    const text = this.interactionMessage;
    const w = Math.min(ctx.measureText(text).width + 40, canvas.width - 40);
    const x = (canvas.width - w) / 2;
    const y = canvas.height - 56;
    ctx.fillStyle = "rgba(10,20,10,0.9)";
    ctx.fillRect(x, y, w, 34);
    ctx.strokeStyle = "#88cc88";
    ctx.strokeRect(x, y, w, 34);
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
    ctx.fillText("种田、采集、钓鱼、交易、社交、料理与委托，推进长期成长", canvas.width / 2, 138);
    ctx.font = "16px sans-serif";
    ctx.fillText("核心循环：收菜→补种→跑委托→赚钱→投资升级→解锁内容", canvas.width / 2, 170);
    ctx.font = "14px sans-serif";
    ctx.fillText("天气、技能、集市日和屋内菜单都会影响你的每日节奏", canvas.width / 2, 194);
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
    ctx.fillStyle = "rgba(10,28,10,0.92)";
    ctx.fillRect(40, canvas.height - 148, canvas.width - 80, 118);
    ctx.strokeStyle = this.dialogueTarget?.hatColor || "#88cc66";
    ctx.strokeRect(40, canvas.height - 148, canvas.width - 80, 118);
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
    const sellList = Object.keys(this.inventory).filter(k => ITEMS[k]?.sellPrice > 0);
    const upgradeList = this.getUpgradeList();
    const list = this.shopMode === "buy" ? buyList : this.shopMode === "sell" ? sellList : upgradeList;

    const panelW = 560, panelH = 360;
    const px = (canvas.width - panelW) / 2;
    const py = (canvas.height - panelH) / 2;
    ctx.fillStyle = "rgba(10,28,10,0.95)";
    ctx.fillRect(px, py, panelW, panelH);
    ctx.strokeStyle = "#88cc66";
    ctx.strokeRect(px, py, panelW, panelH);
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
    const panelW = 560, panelH = 360;
    const px = (canvas.width - panelW) / 2;
    const py = (canvas.height - panelH) / 2;
    ctx.fillStyle = "rgba(10,28,10,0.95)";
    ctx.fillRect(px, py, panelW, panelH);
    ctx.strokeStyle = "#88cc66";
    ctx.strokeRect(px, py, panelW, panelH);
    ctx.fillStyle = "#f0d060";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎒 背包与经营资产", canvas.width / 2, py + 30);

    const entries = Object.entries(this.inventory).sort((a, b) => (ITEMS[a[0]]?.name || a[0]).localeCompare(ITEMS[b[0]]?.name || b[0], "zh-CN"));
    const visibleEntries = entries.slice(0, 20);
    visibleEntries.forEach(([key, count], i) => {
      const col = i % 5, row = Math.floor(i / 5);
      const bx = px + 18 + col * 106, by = py + 66 + row * 66;
      ctx.fillStyle = "rgba(60,100,60,0.6)";
      ctx.fillRect(bx, by, 96, 56);
      ctx.fillStyle = "#fff";
      ctx.font = "12px sans-serif";
      ctx.fillText(`${ITEMS[key]?.icon || "?"} ${ITEMS[key]?.name || key}`, bx + 6, by + 20);
      ctx.fillStyle = "#f0d060";
      ctx.fillText(`数量:${count}`, bx + 6, by + 38);
      ctx.fillText(`估值:${(ITEMS[key]?.sellPrice || 0) * count}`, bx + 6, by + 52);
    });

    ctx.fillStyle = "#88cc88";
    ctx.font = "13px sans-serif";
    const overflowText = entries.length > visibleEntries.length ? `  另有 ${entries.length - visibleEntries.length} 项暂未展开。` : "";
    ctx.fillText(`提示：农作物卖钱→投资升级→解锁新区域与新种子。${overflowText}`, canvas.width / 2, py + panelH - 18);
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
    const warmGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    warmGrad.addColorStop(0, "#f5ddb0");
    warmGrad.addColorStop(1, "#c89758");
    ctx.fillStyle = warmGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 10; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#c8964a" : "#b87c38";
        ctx.fillRect(x * 80, y * 56 + 10, 80, 56);
      }
    }

    ctx.fillStyle = "rgba(255,255,255,0.26)";
    ctx.fillRect(70, 40, 92, 70);
    ctx.fillRect(640, 54, 84, 62);
    ctx.fillStyle = "rgba(70,42,18,0.18)";
    ctx.fillRect(0, 340, canvas.width, 140);

    const weather = this.getWeatherConfig();
    const forecast = WEATHER[this.tomorrowWeather] || WEATHER.sunny;
    const actions = this.getHouseActions();

    ctx.fillStyle = "rgba(38,24,12,0.72)";
    ctx.fillRect(34, 34, 294, 324);
    ctx.fillStyle = "#fff1cf";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText(`🏠 小屋 Lv${this.progress.houseLevel}`, 54, 68);
    ctx.font = "14px sans-serif";
    ctx.fillText(`⚡ 体力 ${Math.round(this.energy)}/${this.maxEnergy}`, 54, 100);
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.fillRect(54, 114, 200, 12);
    ctx.fillStyle = this.energy / this.maxEnergy > 0.35 ? "#84de79" : "#ffb65f";
    ctx.fillRect(54, 114, 200 * (this.energy / this.maxEnergy), 12);
    ctx.fillStyle = "#fff1cf";
    ctx.fillText(`${weather.icon} 今天：${weather.name}`, 54, 154);
    ctx.fillText(`🔭 明天：${forecast.icon} ${forecast.name}`, 54, 180);
    ctx.fillText(this.isMarketDay() ? "🧺 今天是集市日，卖货价格更高。" : "📬 公告牌会刷新 3 个委托。", 54, 206);
    ctx.fillText(this.currentBuff ? `🍲 当前状态：${this.currentBuff.label}` : "🍲 当前状态：没有料理增益", 54, 232);
    ctx.fillText("小屋用途：恢复体力、做料理、整理节奏。", 54, 270);
    ctx.fillText("料理会立刻恢复体力，并在当天提供额外加成。", 54, 296);
    ctx.fillText("睡到次日会刷新天气、委托和商店节奏。", 54, 322);

    ctx.fillStyle = "rgba(28,18,10,0.76)";
    ctx.fillRect(360, 34, 406, 324);
    ctx.fillStyle = "#ffe2a0";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("室内安排", 382, 68);
    actions.forEach((action, i) => {
      const y = 102 + i * 52;
      const selected = i === this.houseSelection;
      ctx.fillStyle = selected ? "rgba(255,232,170,0.18)" : "rgba(255,255,255,0.06)";
      ctx.fillRect(378, y - 22, 368, 42);
      ctx.fillStyle = selected ? "#fff6d0" : "#f0e1b2";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText(action.label, 392, y);
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#d8caa0";
      if (action.type === "recipe") {
        const ingredients = Object.entries(action.recipe.ingredients).map(([key, count]) => `${ITEMS[key].name}x${count}`).join(" / ");
        const canCook = Object.entries(action.recipe.ingredients).every(([key, count]) => (this.inventory[key] || 0) >= count);
        ctx.fillText(`${ingredients} ｜ ${action.desc}`, 392, y + 18);
        ctx.fillStyle = canCook ? "#aef3a6" : "#ffb995";
        ctx.fillText(canCook ? "可制作" : "材料不足", 684, y);
      } else {
        ctx.fillText(action.desc, 392, y + 18);
      }
    });

    ctx.fillStyle = "rgba(30,18,10,0.72)";
    ctx.fillRect(140, 382, 520, 56);
    ctx.fillStyle = "#fff0cf";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("W/S 或 ↑↓ 选择，E/Enter 执行，ESC 离开小屋", canvas.width / 2, 415);
    ctx.textAlign = "left";
  }
}
