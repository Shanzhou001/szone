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
  JOURNAL: "journal",
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
  ore: { name: "矿石", icon: "⛏️", sellPrice: 32, buyPrice: 0, desc: "山地矿脉产物" },
  herb: { name: "药草", icon: "🌿", sellPrice: 22, buyPrice: 0, desc: "湖畔草丛采集物" },
  relic: { name: "遗迹碎片", icon: "🧿", sellPrice: 90, buyPrice: 0, desc: "稀有收藏品" },
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
  { id: "npc-baker", name: "面包师罗莎", baseX: 520, baseY: 610, color: "#d49c6f", hatColor: "#b56d3d", likes: ["turnip", "potato"] },
  { id: "npc-carpenter", name: "木匠高伯", baseX: 760, baseY: 610, color: "#7b6a4d", hatColor: "#5c4b32", likes: ["wood", "pumpkin"] },
  { id: "npc-doctor", name: "医生安宁", baseX: 560, baseY: 240, color: "#a7c7e7", hatColor: "#7da8d6", likes: ["mushroom", "blueberry"] },
  { id: "npc-librarian", name: "图书管理员墨言", baseX: 420, baseY: 560, color: "#9d8cc1", hatColor: "#6b5a98", likes: ["flower", "shell"] },
  { id: "npc-gardener", name: "园丁阿棠", baseX: 300, baseY: 760, color: "#5cad6f", hatColor: "#3f8a52", likes: ["flower", "fruit"] },
  { id: "npc-miner", name: "矿工石叔", baseX: 1090, baseY: 420, color: "#808c98", hatColor: "#5f6973", likes: ["stone", "mushroom"] },
];

const DIALOGUE_LIBRARY = {
  "npc-lingling": {
    morning: [
      "npc-lingling 在morning的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-lingling 在morning的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-lingling 在morning的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-lingling 在morning的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-lingling 在morning的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-lingling 在morning的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-lingling 在morning的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-lingling 在morning的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-lingling 在morning的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-lingling 在morning的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-lingling 在morning的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-lingling 在morning的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-lingling 在morning的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-lingling 在morning的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-lingling 在morning的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    afternoon: [
      "npc-lingling 在afternoon的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-lingling 在afternoon的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-lingling 在afternoon的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-lingling 在afternoon的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-lingling 在afternoon的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-lingling 在afternoon的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-lingling 在afternoon的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-lingling 在afternoon的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-lingling 在afternoon的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-lingling 在afternoon的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-lingling 在afternoon的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-lingling 在afternoon的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-lingling 在afternoon的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-lingling 在afternoon的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-lingling 在afternoon的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    night: [
      "npc-lingling 在night的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-lingling 在night的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-lingling 在night的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-lingling 在night的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-lingling 在night的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-lingling 在night的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-lingling 在night的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-lingling 在night的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-lingling 在night的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-lingling 在night的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-lingling 在night的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-lingling 在night的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-lingling 在night的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-lingling 在night的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-lingling 在night的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
  },
  "npc-chen": {
    morning: [
      "npc-chen 在morning的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-chen 在morning的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-chen 在morning的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-chen 在morning的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-chen 在morning的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-chen 在morning的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-chen 在morning的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-chen 在morning的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-chen 在morning的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-chen 在morning的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-chen 在morning的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-chen 在morning的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-chen 在morning的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-chen 在morning的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-chen 在morning的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    afternoon: [
      "npc-chen 在afternoon的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-chen 在afternoon的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-chen 在afternoon的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-chen 在afternoon的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-chen 在afternoon的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-chen 在afternoon的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-chen 在afternoon的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-chen 在afternoon的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-chen 在afternoon的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-chen 在afternoon的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-chen 在afternoon的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-chen 在afternoon的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-chen 在afternoon的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-chen 在afternoon的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-chen 在afternoon的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    night: [
      "npc-chen 在night的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-chen 在night的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-chen 在night的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-chen 在night的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-chen 在night的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-chen 在night的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-chen 在night的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-chen 在night的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-chen 在night的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-chen 在night的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-chen 在night的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-chen 在night的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-chen 在night的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-chen 在night的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-chen 在night的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
  },
  "npc-maomao": {
    morning: [
      "npc-maomao 在morning的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-maomao 在morning的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-maomao 在morning的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-maomao 在morning的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-maomao 在morning的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-maomao 在morning的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-maomao 在morning的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-maomao 在morning的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-maomao 在morning的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-maomao 在morning的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-maomao 在morning的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-maomao 在morning的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-maomao 在morning的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-maomao 在morning的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-maomao 在morning的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    afternoon: [
      "npc-maomao 在afternoon的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-maomao 在afternoon的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-maomao 在afternoon的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-maomao 在afternoon的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-maomao 在afternoon的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-maomao 在afternoon的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-maomao 在afternoon的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-maomao 在afternoon的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-maomao 在afternoon的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-maomao 在afternoon的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-maomao 在afternoon的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-maomao 在afternoon的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-maomao 在afternoon的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-maomao 在afternoon的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-maomao 在afternoon的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    night: [
      "npc-maomao 在night的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-maomao 在night的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-maomao 在night的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-maomao 在night的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-maomao 在night的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-maomao 在night的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-maomao 在night的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-maomao 在night的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-maomao 在night的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-maomao 在night的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-maomao 在night的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-maomao 在night的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-maomao 在night的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-maomao 在night的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-maomao 在night的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
  },
  "npc-zhuang": {
    morning: [
      "npc-zhuang 在morning的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-zhuang 在morning的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-zhuang 在morning的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-zhuang 在morning的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-zhuang 在morning的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-zhuang 在morning的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-zhuang 在morning的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-zhuang 在morning的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-zhuang 在morning的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-zhuang 在morning的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-zhuang 在morning的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-zhuang 在morning的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-zhuang 在morning的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-zhuang 在morning的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-zhuang 在morning的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    afternoon: [
      "npc-zhuang 在afternoon的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-zhuang 在afternoon的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-zhuang 在afternoon的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-zhuang 在afternoon的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-zhuang 在afternoon的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-zhuang 在afternoon的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-zhuang 在afternoon的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-zhuang 在afternoon的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-zhuang 在afternoon的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-zhuang 在afternoon的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-zhuang 在afternoon的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-zhuang 在afternoon的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-zhuang 在afternoon的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-zhuang 在afternoon的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-zhuang 在afternoon的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    night: [
      "npc-zhuang 在night的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-zhuang 在night的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-zhuang 在night的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-zhuang 在night的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-zhuang 在night的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-zhuang 在night的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-zhuang 在night的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-zhuang 在night的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-zhuang 在night的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-zhuang 在night的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-zhuang 在night的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-zhuang 在night的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-zhuang 在night的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-zhuang 在night的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-zhuang 在night的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
  },
  "npc-yufu": {
    morning: [
      "npc-yufu 在morning的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-yufu 在morning的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-yufu 在morning的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-yufu 在morning的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-yufu 在morning的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-yufu 在morning的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-yufu 在morning的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-yufu 在morning的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-yufu 在morning的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-yufu 在morning的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-yufu 在morning的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-yufu 在morning的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-yufu 在morning的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-yufu 在morning的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-yufu 在morning的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    afternoon: [
      "npc-yufu 在afternoon的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-yufu 在afternoon的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-yufu 在afternoon的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-yufu 在afternoon的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-yufu 在afternoon的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-yufu 在afternoon的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-yufu 在afternoon的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-yufu 在afternoon的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-yufu 在afternoon的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-yufu 在afternoon的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-yufu 在afternoon的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-yufu 在afternoon的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-yufu 在afternoon的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-yufu 在afternoon的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-yufu 在afternoon的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    night: [
      "npc-yufu 在night的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-yufu 在night的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-yufu 在night的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-yufu 在night的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-yufu 在night的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-yufu 在night的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-yufu 在night的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-yufu 在night的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-yufu 在night的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-yufu 在night的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-yufu 在night的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-yufu 在night的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-yufu 在night的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-yufu 在night的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-yufu 在night的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
  },
  "npc-mia": {
    morning: [
      "npc-mia 在morning的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-mia 在morning的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-mia 在morning的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-mia 在morning的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-mia 在morning的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-mia 在morning的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-mia 在morning的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-mia 在morning的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-mia 在morning的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-mia 在morning的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-mia 在morning的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-mia 在morning的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-mia 在morning的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-mia 在morning的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-mia 在morning的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    afternoon: [
      "npc-mia 在afternoon的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-mia 在afternoon的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-mia 在afternoon的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-mia 在afternoon的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-mia 在afternoon的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-mia 在afternoon的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-mia 在afternoon的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-mia 在afternoon的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-mia 在afternoon的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-mia 在afternoon的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-mia 在afternoon的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-mia 在afternoon的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-mia 在afternoon的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-mia 在afternoon的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-mia 在afternoon的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    night: [
      "npc-mia 在night的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-mia 在night的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-mia 在night的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-mia 在night的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-mia 在night的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-mia 在night的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-mia 在night的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-mia 在night的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-mia 在night的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-mia 在night的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-mia 在night的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-mia 在night的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-mia 在night的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-mia 在night的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-mia 在night的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
  },
  "npc-baker": {
    morning: [
      "npc-baker 在morning的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-baker 在morning的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-baker 在morning的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-baker 在morning的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-baker 在morning的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-baker 在morning的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-baker 在morning的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-baker 在morning的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-baker 在morning的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-baker 在morning的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-baker 在morning的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-baker 在morning的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-baker 在morning的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-baker 在morning的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-baker 在morning的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    afternoon: [
      "npc-baker 在afternoon的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-baker 在afternoon的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-baker 在afternoon的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-baker 在afternoon的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-baker 在afternoon的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-baker 在afternoon的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-baker 在afternoon的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-baker 在afternoon的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-baker 在afternoon的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-baker 在afternoon的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-baker 在afternoon的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-baker 在afternoon的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-baker 在afternoon的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-baker 在afternoon的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-baker 在afternoon的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    night: [
      "npc-baker 在night的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-baker 在night的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-baker 在night的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-baker 在night的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-baker 在night的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-baker 在night的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-baker 在night的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-baker 在night的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-baker 在night的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-baker 在night的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-baker 在night的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-baker 在night的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-baker 在night的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-baker 在night的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-baker 在night的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
  },
  "npc-carpenter": {
    morning: [
      "npc-carpenter 在morning的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-carpenter 在morning的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-carpenter 在morning的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-carpenter 在morning的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-carpenter 在morning的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-carpenter 在morning的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-carpenter 在morning的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-carpenter 在morning的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-carpenter 在morning的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-carpenter 在morning的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-carpenter 在morning的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-carpenter 在morning的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-carpenter 在morning的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-carpenter 在morning的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-carpenter 在morning的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    afternoon: [
      "npc-carpenter 在afternoon的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-carpenter 在afternoon的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-carpenter 在afternoon的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-carpenter 在afternoon的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-carpenter 在afternoon的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-carpenter 在afternoon的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-carpenter 在afternoon的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-carpenter 在afternoon的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-carpenter 在afternoon的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-carpenter 在afternoon的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-carpenter 在afternoon的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-carpenter 在afternoon的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-carpenter 在afternoon的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-carpenter 在afternoon的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-carpenter 在afternoon的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    night: [
      "npc-carpenter 在night的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-carpenter 在night的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-carpenter 在night的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-carpenter 在night的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-carpenter 在night的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-carpenter 在night的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-carpenter 在night的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-carpenter 在night的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-carpenter 在night的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-carpenter 在night的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-carpenter 在night的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-carpenter 在night的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-carpenter 在night的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-carpenter 在night的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-carpenter 在night的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
  },
  "npc-doctor": {
    morning: [
      "npc-doctor 在morning的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-doctor 在morning的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-doctor 在morning的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-doctor 在morning的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-doctor 在morning的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-doctor 在morning的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-doctor 在morning的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-doctor 在morning的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-doctor 在morning的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-doctor 在morning的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-doctor 在morning的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-doctor 在morning的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-doctor 在morning的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-doctor 在morning的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-doctor 在morning的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    afternoon: [
      "npc-doctor 在afternoon的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-doctor 在afternoon的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-doctor 在afternoon的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-doctor 在afternoon的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-doctor 在afternoon的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-doctor 在afternoon的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-doctor 在afternoon的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-doctor 在afternoon的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-doctor 在afternoon的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-doctor 在afternoon的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-doctor 在afternoon的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-doctor 在afternoon的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-doctor 在afternoon的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-doctor 在afternoon的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-doctor 在afternoon的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    night: [
      "npc-doctor 在night的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-doctor 在night的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-doctor 在night的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-doctor 在night的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-doctor 在night的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-doctor 在night的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-doctor 在night的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-doctor 在night的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-doctor 在night的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-doctor 在night的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-doctor 在night的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-doctor 在night的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-doctor 在night的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-doctor 在night的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-doctor 在night的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
  },
  "npc-librarian": {
    morning: [
      "npc-librarian 在morning的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-librarian 在morning的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-librarian 在morning的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-librarian 在morning的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-librarian 在morning的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-librarian 在morning的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-librarian 在morning的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-librarian 在morning的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-librarian 在morning的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-librarian 在morning的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-librarian 在morning的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-librarian 在morning的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-librarian 在morning的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-librarian 在morning的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-librarian 在morning的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    afternoon: [
      "npc-librarian 在afternoon的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-librarian 在afternoon的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-librarian 在afternoon的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-librarian 在afternoon的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-librarian 在afternoon的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-librarian 在afternoon的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-librarian 在afternoon的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-librarian 在afternoon的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-librarian 在afternoon的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-librarian 在afternoon的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-librarian 在afternoon的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-librarian 在afternoon的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-librarian 在afternoon的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-librarian 在afternoon的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-librarian 在afternoon的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    night: [
      "npc-librarian 在night的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-librarian 在night的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-librarian 在night的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-librarian 在night的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-librarian 在night的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-librarian 在night的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-librarian 在night的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-librarian 在night的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-librarian 在night的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-librarian 在night的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-librarian 在night的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-librarian 在night的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-librarian 在night的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-librarian 在night的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-librarian 在night的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
  },
  "npc-gardener": {
    morning: [
      "npc-gardener 在morning的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-gardener 在morning的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-gardener 在morning的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-gardener 在morning的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-gardener 在morning的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-gardener 在morning的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-gardener 在morning的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-gardener 在morning的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-gardener 在morning的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-gardener 在morning的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-gardener 在morning的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-gardener 在morning的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-gardener 在morning的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-gardener 在morning的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-gardener 在morning的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    afternoon: [
      "npc-gardener 在afternoon的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-gardener 在afternoon的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-gardener 在afternoon的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-gardener 在afternoon的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-gardener 在afternoon的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-gardener 在afternoon的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-gardener 在afternoon的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-gardener 在afternoon的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-gardener 在afternoon的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-gardener 在afternoon的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-gardener 在afternoon的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-gardener 在afternoon的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-gardener 在afternoon的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-gardener 在afternoon的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-gardener 在afternoon的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    night: [
      "npc-gardener 在night的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-gardener 在night的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-gardener 在night的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-gardener 在night的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-gardener 在night的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-gardener 在night的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-gardener 在night的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-gardener 在night的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-gardener 在night的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-gardener 在night的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-gardener 在night的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-gardener 在night的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-gardener 在night的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-gardener 在night的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-gardener 在night的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
  },
  "npc-miner": {
    morning: [
      "npc-miner 在morning的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-miner 在morning的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-miner 在morning的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-miner 在morning的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-miner 在morning的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-miner 在morning的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-miner 在morning的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-miner 在morning的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-miner 在morning的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-miner 在morning的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-miner 在morning的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-miner 在morning的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-miner 在morning的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-miner 在morning的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-miner 在morning的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    afternoon: [
      "npc-miner 在afternoon的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-miner 在afternoon的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-miner 在afternoon的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-miner 在afternoon的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-miner 在afternoon的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-miner 在afternoon的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-miner 在afternoon的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-miner 在afternoon的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-miner 在afternoon的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-miner 在afternoon的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-miner 在afternoon的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-miner 在afternoon的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-miner 在afternoon的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-miner 在afternoon的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-miner 在afternoon的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
    night: [
      "npc-miner 在night的生活絮语 #1：今天的小镇也很有烟火气。",
      "npc-miner 在night的生活絮语 #2：今天的小镇也很有烟火气。",
      "npc-miner 在night的生活絮语 #3：今天的小镇也很有烟火气。",
      "npc-miner 在night的生活絮语 #4：今天的小镇也很有烟火气。",
      "npc-miner 在night的生活絮语 #5：今天的小镇也很有烟火气。",
      "npc-miner 在night的生活絮语 #6：今天的小镇也很有烟火气。",
      "npc-miner 在night的生活絮语 #7：今天的小镇也很有烟火气。",
      "npc-miner 在night的生活絮语 #8：今天的小镇也很有烟火气。",
      "npc-miner 在night的生活絮语 #9：今天的小镇也很有烟火气。",
      "npc-miner 在night的生活絮语 #10：今天的小镇也很有烟火气。",
      "npc-miner 在night的生活絮语 #11：今天的小镇也很有烟火气。",
      "npc-miner 在night的生活絮语 #12：今天的小镇也很有烟火气。",
      "npc-miner 在night的生活絮语 #13：今天的小镇也很有烟火气。",
      "npc-miner 在night的生活絮语 #14：今天的小镇也很有烟火气。",
      "npc-miner 在night的生活絮语 #15：今天的小镇也很有烟火气。",
    ],
  },
};

const TOWN_LORE = [
  "小镇笔记 1：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 2：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 3：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 4：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 5：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 6：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 7：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 8：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 9：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 10：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 11：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 12：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 13：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 14：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 15：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 16：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 17：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 18：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 19：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 20：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 21：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 22：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 23：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 24：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 25：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 26：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 27：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 28：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 29：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 30：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 31：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 32：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 33：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 34：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 35：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 36：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 37：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 38：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 39：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 40：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 41：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 42：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 43：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 44：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 45：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 46：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 47：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 48：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 49：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 50：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 51：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 52：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 53：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 54：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 55：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 56：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 57：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 58：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 59：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 60：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 61：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 62：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 63：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 64：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 65：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 66：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 67：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 68：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 69：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 70：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 71：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 72：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 73：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 74：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 75：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 76：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 77：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 78：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 79：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 80：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 81：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 82：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 83：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 84：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 85：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 86：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 87：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 88：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 89：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 90：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 91：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 92：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 93：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 94：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 95：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 96：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 97：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 98：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 99：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 100：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 101：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 102：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 103：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 104：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 105：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 106：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 107：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 108：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 109：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 110：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 111：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 112：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 113：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 114：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 115：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 116：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 117：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 118：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 119：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 120：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 121：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 122：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 123：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 124：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 125：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 126：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 127：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 128：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 129：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 130：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 131：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 132：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 133：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 134：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 135：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 136：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 137：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 138：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 139：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 140：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 141：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 142：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 143：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 144：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 145：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 146：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 147：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 148：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 149：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 150：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 151：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 152：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 153：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 154：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 155：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 156：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 157：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 158：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 159：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 160：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 161：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 162：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 163：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 164：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 165：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 166：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 167：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 168：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 169：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 170：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 171：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 172：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 173：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 174：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 175：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 176：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 177：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 178：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 179：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 180：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 181：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 182：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 183：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 184：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 185：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 186：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 187：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 188：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 189：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 190：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 191：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 192：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 193：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 194：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 195：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 196：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 197：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 198：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 199：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 200：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 201：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 202：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 203：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 204：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 205：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 206：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 207：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 208：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 209：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 210：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 211：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 212：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 213：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 214：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 215：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 216：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 217：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 218：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 219：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 220：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 221：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 222：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 223：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 224：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 225：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 226：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 227：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 228：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 229：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 230：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 231：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 232：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 233：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 234：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 235：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 236：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 237：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 238：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 239：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 240：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 241：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 242：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 243：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 244：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 245：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 246：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 247：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 248：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 249：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 250：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 251：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 252：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 253：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 254：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 255：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 256：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 257：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 258：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 259：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 260：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 261：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 262：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 263：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 264：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 265：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 266：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 267：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 268：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 269：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 270：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 271：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 272：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 273：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 274：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 275：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 276：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 277：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 278：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 279：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 280：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 281：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 282：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 283：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 284：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 285：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 286：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 287：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 288：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 289：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 290：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 291：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 292：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 293：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 294：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 295：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 296：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 297：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 298：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 299：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 300：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 301：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 302：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 303：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 304：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 305：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 306：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 307：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 308：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 309：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 310：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 311：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 312：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 313：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 314：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 315：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 316：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 317：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 318：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 319：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 320：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 321：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 322：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 323：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 324：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 325：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 326：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 327：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 328：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 329：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 330：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 331：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 332：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 333：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 334：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 335：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 336：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 337：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 338：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 339：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 340：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 341：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 342：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 343：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 344：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 345：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 346：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 347：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 348：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 349：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 350：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 351：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 352：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 353：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 354：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 355：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 356：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 357：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 358：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 359：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 360：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 361：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 362：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 363：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 364：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 365：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 366：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 367：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 368：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 369：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 370：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 371：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 372：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 373：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 374：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 375：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 376：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 377：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 378：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 379：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 380：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 381：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 382：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 383：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 384：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 385：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 386：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 387：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 388：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 389：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 390：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 391：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 392：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 393：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 394：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 395：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 396：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 397：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 398：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 399：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 400：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 401：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 402：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 403：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 404：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 405：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 406：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 407：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 408：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 409：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 410：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 411：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 412：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 413：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 414：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 415：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 416：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 417：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 418：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 419：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 420：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 421：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 422：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 423：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 424：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 425：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 426：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 427：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 428：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 429：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 430：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 431：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 432：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 433：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 434：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 435：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 436：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 437：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 438：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 439：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 440：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 441：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 442：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 443：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 444：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 445：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 446：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 447：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 448：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 449：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 450：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 451：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 452：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 453：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 454：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 455：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 456：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 457：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 458：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 459：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 460：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 461：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 462：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 463：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 464：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 465：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 466：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 467：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 468：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 469：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 470：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 471：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 472：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 473：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 474：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 475：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 476：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 477：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 478：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 479：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 480：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 481：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 482：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 483：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 484：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 485：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 486：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 487：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 488：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 489：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 490：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 491：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 492：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 493：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 494：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 495：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 496：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 497：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 498：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 499：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 500：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 501：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 502：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 503：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 504：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 505：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 506：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 507：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 508：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 509：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 510：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 511：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 512：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 513：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 514：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 515：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 516：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 517：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 518：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 519：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 520：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 521：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 522：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 523：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 524：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 525：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 526：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 527：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 528：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 529：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 530：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 531：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 532：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 533：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 534：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 535：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 536：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 537：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 538：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 539：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 540：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 541：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 542：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 543：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 544：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 545：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 546：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 547：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 548：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 549：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 550：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 551：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 552：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 553：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 554：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 555：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 556：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 557：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 558：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 559：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 560：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 561：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 562：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 563：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 564：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 565：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 566：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 567：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 568：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 569：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 570：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 571：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 572：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 573：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 574：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 575：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 576：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 577：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 578：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 579：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 580：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 581：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 582：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 583：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 584：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 585：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 586：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 587：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 588：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 589：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 590：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 591：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 592：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 593：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 594：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 595：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 596：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 597：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 598：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 599：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 600：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 601：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 602：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 603：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 604：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 605：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 606：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 607：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 608：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 609：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 610：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 611：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 612：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 613：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 614：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 615：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 616：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 617：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 618：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 619：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 620：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 621：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 622：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 623：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 624：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 625：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 626：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 627：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 628：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 629：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 630：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 631：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 632：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 633：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 634：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 635：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 636：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 637：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 638：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 639：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 640：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 641：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 642：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 643：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 644：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 645：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 646：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 647：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 648：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 649：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 650：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 651：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 652：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 653：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 654：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 655：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 656：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 657：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 658：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 659：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 660：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 661：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 662：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 663：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 664：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 665：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 666：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 667：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 668：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 669：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 670：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 671：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 672：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 673：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 674：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 675：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 676：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 677：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 678：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 679：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 680：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 681：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 682：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 683：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 684：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 685：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 686：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 687：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 688：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 689：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 690：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 691：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 692：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 693：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 694：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 695：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 696：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 697：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 698：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 699：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 700：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 701：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 702：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 703：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 704：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 705：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 706：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 707：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 708：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 709：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 710：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 711：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 712：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 713：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 714：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 715：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 716：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 717：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 718：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 719：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 720：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 721：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 722：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 723：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 724：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 725：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 726：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 727：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 728：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 729：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 730：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 731：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 732：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 733：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 734：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 735：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 736：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 737：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 738：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 739：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 740：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 741：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 742：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 743：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 744：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 745：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 746：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 747：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 748：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 749：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 750：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 751：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 752：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 753：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 754：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 755：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 756：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 757：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 758：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 759：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 760：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 761：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 762：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 763：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 764：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 765：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 766：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 767：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 768：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 769：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 770：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 771：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 772：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 773：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 774：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 775：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 776：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 777：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 778：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 779：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 780：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 781：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 782：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 783：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 784：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 785：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 786：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 787：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 788：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 789：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 790：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 791：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 792：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 793：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 794：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 795：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 796：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 797：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 798：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 799：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 800：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 801：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 802：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 803：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 804：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 805：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 806：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 807：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 808：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 809：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 810：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 811：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 812：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 813：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 814：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 815：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 816：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 817：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 818：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 819：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 820：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 821：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 822：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 823：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 824：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 825：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 826：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 827：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 828：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 829：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 830：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 831：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 832：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 833：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 834：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 835：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 836：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 837：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 838：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 839：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 840：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 841：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 842：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 843：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 844：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 845：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 846：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 847：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 848：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 849：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 850：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 851：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 852：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 853：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 854：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 855：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 856：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 857：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 858：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 859：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 860：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 861：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 862：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 863：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 864：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 865：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 866：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 867：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 868：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 869：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 870：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 871：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 872：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 873：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 874：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 875：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 876：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 877：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 878：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 879：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 880：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 881：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 882：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 883：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 884：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 885：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 886：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 887：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 888：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 889：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 890：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 891：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 892：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 893：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 894：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 895：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 896：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 897：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 898：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 899：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 900：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 901：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 902：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 903：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 904：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 905：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 906：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 907：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 908：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 909：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 910：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 911：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 912：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 913：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 914：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 915：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 916：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 917：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 918：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 919：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 920：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 921：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 922：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 923：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 924：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 925：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 926：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 927：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 928：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 929：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 930：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 931：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 932：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 933：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 934：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 935：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 936：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 937：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 938：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 939：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 940：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 941：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 942：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 943：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 944：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 945：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 946：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 947：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 948：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 949：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 950：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 951：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 952：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 953：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 954：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 955：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 956：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 957：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 958：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 959：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 960：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 961：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 962：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 963：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 964：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 965：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 966：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 967：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 968：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 969：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 970：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 971：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 972：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 973：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 974：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 975：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 976：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 977：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 978：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 979：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 980：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 981：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 982：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 983：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 984：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 985：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 986：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 987：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 988：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 989：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 990：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 991：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 992：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 993：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 994：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 995：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 996：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 997：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 998：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 999：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1000：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1001：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1002：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1003：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1004：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1005：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1006：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1007：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1008：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1009：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1010：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1011：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1012：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1013：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1014：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1015：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1016：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1017：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1018：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1019：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1020：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1021：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1022：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1023：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1024：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1025：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1026：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1027：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1028：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1029：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1030：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1031：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1032：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1033：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1034：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1035：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1036：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1037：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1038：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1039：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1040：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1041：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1042：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1043：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1044：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1045：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1046：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1047：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1048：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1049：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1050：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1051：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1052：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1053：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1054：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1055：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1056：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1057：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1058：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1059：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1060：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1061：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1062：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1063：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1064：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1065：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1066：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1067：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1068：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1069：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1070：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1071：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1072：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1073：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1074：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1075：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1076：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1077：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1078：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1079：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1080：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1081：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1082：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1083：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1084：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1085：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1086：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1087：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1088：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1089：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1090：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1091：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1092：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1093：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1094：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1095：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1096：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1097：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1098：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1099：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1100：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1101：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1102：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1103：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1104：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1105：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1106：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1107：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1108：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1109：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1110：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1111：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1112：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1113：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1114：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1115：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1116：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1117：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1118：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1119：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1120：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1121：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1122：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1123：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1124：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1125：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1126：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1127：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1128：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1129：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1130：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1131：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1132：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1133：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1134：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1135：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1136：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1137：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1138：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1139：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1140：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1141：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1142：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1143：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1144：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1145：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1146：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1147：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1148：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1149：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1150：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1151：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1152：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1153：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1154：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1155：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1156：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1157：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1158：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1159：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1160：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1161：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1162：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1163：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1164：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1165：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1166：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1167：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1168：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1169：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1170：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1171：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1172：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1173：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1174：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1175：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1176：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1177：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1178：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1179：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1180：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1181：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1182：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1183：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1184：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1185：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1186：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1187：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1188：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1189：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1190：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1191：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1192：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1193：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1194：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1195：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1196：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1197：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1198：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1199：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1200：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1201：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1202：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1203：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1204：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1205：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1206：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1207：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1208：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1209：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1210：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1211：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1212：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1213：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1214：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1215：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1216：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1217：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1218：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1219：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1220：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1221：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1222：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1223：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1224：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1225：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1226：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1227：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1228：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1229：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1230：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1231：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1232：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1233：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1234：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1235：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1236：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1237：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1238：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1239：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1240：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1241：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1242：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1243：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1244：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1245：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1246：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1247：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1248：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1249：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1250：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1251：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1252：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1253：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1254：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1255：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1256：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1257：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1258：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1259：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1260：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1261：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1262：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1263：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1264：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1265：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1266：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1267：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1268：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1269：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1270：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1271：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1272：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1273：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1274：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1275：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1276：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1277：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1278：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1279：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1280：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1281：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1282：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1283：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1284：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1285：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1286：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1287：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1288：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1289：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1290：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1291：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1292：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1293：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1294：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1295：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1296：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1297：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1298：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1299：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1300：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1301：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1302：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1303：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1304：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1305：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1306：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1307：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1308：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1309：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1310：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1311：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1312：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1313：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1314：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1315：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1316：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1317：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1318：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1319：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1320：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1321：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1322：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1323：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1324：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1325：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1326：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1327：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1328：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1329：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1330：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1331：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1332：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1333：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1334：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1335：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1336：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1337：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1338：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1339：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1340：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1341：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1342：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1343：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1344：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1345：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1346：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1347：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1348：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1349：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1350：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1351：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1352：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1353：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1354：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1355：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1356：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1357：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1358：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1359：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1360：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1361：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1362：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1363：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1364：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1365：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1366：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1367：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1368：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1369：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1370：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1371：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1372：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1373：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1374：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1375：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1376：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1377：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1378：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1379：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1380：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1381：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1382：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1383：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1384：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1385：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1386：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1387：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1388：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1389：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1390：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1391：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1392：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1393：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1394：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1395：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1396：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1397：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1398：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1399：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1400：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1401：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1402：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1403：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1404：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1405：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1406：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1407：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1408：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1409：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1410：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1411：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1412：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1413：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1414：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1415：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1416：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1417：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1418：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1419：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1420：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1421：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1422：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1423：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1424：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1425：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1426：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1427：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1428：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1429：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1430：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1431：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1432：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1433：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1434：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1435：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1436：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1437：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1438：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1439：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1440：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1441：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1442：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1443：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1444：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1445：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1446：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1447：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1448：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1449：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1450：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1451：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1452：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1453：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1454：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1455：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1456：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1457：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1458：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1459：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1460：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1461：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1462：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1463：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1464：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1465：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1466：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1467：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1468：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1469：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1470：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1471：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1472：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1473：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1474：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1475：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1476：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1477：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1478：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1479：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1480：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1481：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1482：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1483：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1484：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1485：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1486：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1487：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1488：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1489：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1490：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1491：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1492：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1493：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1494：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1495：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1496：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1497：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1498：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1499：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
  "小镇笔记 1500：河边的风会在傍晚带来湿润泥土香，适合整理第二天的农务计划。",
];

const BULLETIN_TASKS = [
  { id: "order-1", title: "居民委托 1", item: "stone", need: 2, reward: 48 },
  { id: "order-2", title: "居民委托 2", item: "flower", need: 3, reward: 56 },
  { id: "order-3", title: "居民委托 3", item: "fish", need: 4, reward: 64 },
  { id: "order-4", title: "居民委托 4", item: "turnip", need: 5, reward: 72 },
  { id: "order-5", title: "居民委托 5", item: "potato", need: 1, reward: 80 },
  { id: "order-6", title: "居民委托 6", item: "blueberry", need: 2, reward: 88 },
  { id: "order-7", title: "居民委托 7", item: "pumpkin", need: 3, reward: 96 },
  { id: "order-8", title: "居民委托 8", item: "mushroom", need: 4, reward: 104 },
  { id: "order-9", title: "居民委托 9", item: "shell", need: 5, reward: 40 },
  { id: "order-10", title: "居民委托 10", item: "wood", need: 1, reward: 48 },
  { id: "order-11", title: "居民委托 11", item: "stone", need: 2, reward: 56 },
  { id: "order-12", title: "居民委托 12", item: "flower", need: 3, reward: 64 },
  { id: "order-13", title: "居民委托 13", item: "fish", need: 4, reward: 72 },
  { id: "order-14", title: "居民委托 14", item: "turnip", need: 5, reward: 80 },
  { id: "order-15", title: "居民委托 15", item: "potato", need: 1, reward: 88 },
  { id: "order-16", title: "居民委托 16", item: "blueberry", need: 2, reward: 96 },
  { id: "order-17", title: "居民委托 17", item: "pumpkin", need: 3, reward: 104 },
  { id: "order-18", title: "居民委托 18", item: "mushroom", need: 4, reward: 40 },
  { id: "order-19", title: "居民委托 19", item: "shell", need: 5, reward: 48 },
  { id: "order-20", title: "居民委托 20", item: "wood", need: 1, reward: 56 },
  { id: "order-21", title: "居民委托 21", item: "stone", need: 2, reward: 64 },
  { id: "order-22", title: "居民委托 22", item: "flower", need: 3, reward: 72 },
  { id: "order-23", title: "居民委托 23", item: "fish", need: 4, reward: 80 },
  { id: "order-24", title: "居民委托 24", item: "turnip", need: 5, reward: 88 },
  { id: "order-25", title: "居民委托 25", item: "potato", need: 1, reward: 96 },
  { id: "order-26", title: "居民委托 26", item: "blueberry", need: 2, reward: 104 },
  { id: "order-27", title: "居民委托 27", item: "pumpkin", need: 3, reward: 40 },
  { id: "order-28", title: "居民委托 28", item: "mushroom", need: 4, reward: 48 },
  { id: "order-29", title: "居民委托 29", item: "shell", need: 5, reward: 56 },
  { id: "order-30", title: "居民委托 30", item: "wood", need: 1, reward: 64 },
  { id: "order-31", title: "居民委托 31", item: "stone", need: 2, reward: 72 },
  { id: "order-32", title: "居民委托 32", item: "flower", need: 3, reward: 80 },
  { id: "order-33", title: "居民委托 33", item: "fish", need: 4, reward: 88 },
  { id: "order-34", title: "居民委托 34", item: "turnip", need: 5, reward: 96 },
  { id: "order-35", title: "居民委托 35", item: "potato", need: 1, reward: 104 },
  { id: "order-36", title: "居民委托 36", item: "blueberry", need: 2, reward: 40 },
  { id: "order-37", title: "居民委托 37", item: "pumpkin", need: 3, reward: 48 },
  { id: "order-38", title: "居民委托 38", item: "mushroom", need: 4, reward: 56 },
  { id: "order-39", title: "居民委托 39", item: "shell", need: 5, reward: 64 },
  { id: "order-40", title: "居民委托 40", item: "wood", need: 1, reward: 72 },
  { id: "order-41", title: "居民委托 41", item: "stone", need: 2, reward: 80 },
  { id: "order-42", title: "居民委托 42", item: "flower", need: 3, reward: 88 },
  { id: "order-43", title: "居民委托 43", item: "fish", need: 4, reward: 96 },
  { id: "order-44", title: "居民委托 44", item: "turnip", need: 5, reward: 104 },
  { id: "order-45", title: "居民委托 45", item: "potato", need: 1, reward: 40 },
  { id: "order-46", title: "居民委托 46", item: "blueberry", need: 2, reward: 48 },
  { id: "order-47", title: "居民委托 47", item: "pumpkin", need: 3, reward: 56 },
  { id: "order-48", title: "居民委托 48", item: "mushroom", need: 4, reward: 64 },
  { id: "order-49", title: "居民委托 49", item: "shell", need: 5, reward: 72 },
  { id: "order-50", title: "居民委托 50", item: "wood", need: 1, reward: 80 },
  { id: "order-51", title: "居民委托 51", item: "stone", need: 2, reward: 88 },
  { id: "order-52", title: "居民委托 52", item: "flower", need: 3, reward: 96 },
  { id: "order-53", title: "居民委托 53", item: "fish", need: 4, reward: 104 },
  { id: "order-54", title: "居民委托 54", item: "turnip", need: 5, reward: 40 },
  { id: "order-55", title: "居民委托 55", item: "potato", need: 1, reward: 48 },
  { id: "order-56", title: "居民委托 56", item: "blueberry", need: 2, reward: 56 },
  { id: "order-57", title: "居民委托 57", item: "pumpkin", need: 3, reward: 64 },
  { id: "order-58", title: "居民委托 58", item: "mushroom", need: 4, reward: 72 },
  { id: "order-59", title: "居民委托 59", item: "shell", need: 5, reward: 80 },
  { id: "order-60", title: "居民委托 60", item: "wood", need: 1, reward: 88 },
  { id: "order-61", title: "居民委托 61", item: "stone", need: 2, reward: 96 },
  { id: "order-62", title: "居民委托 62", item: "flower", need: 3, reward: 104 },
  { id: "order-63", title: "居民委托 63", item: "fish", need: 4, reward: 40 },
  { id: "order-64", title: "居民委托 64", item: "turnip", need: 5, reward: 48 },
  { id: "order-65", title: "居民委托 65", item: "potato", need: 1, reward: 56 },
  { id: "order-66", title: "居民委托 66", item: "blueberry", need: 2, reward: 64 },
  { id: "order-67", title: "居民委托 67", item: "pumpkin", need: 3, reward: 72 },
  { id: "order-68", title: "居民委托 68", item: "mushroom", need: 4, reward: 80 },
  { id: "order-69", title: "居民委托 69", item: "shell", need: 5, reward: 88 },
  { id: "order-70", title: "居民委托 70", item: "wood", need: 1, reward: 96 },
  { id: "order-71", title: "居民委托 71", item: "stone", need: 2, reward: 104 },
  { id: "order-72", title: "居民委托 72", item: "flower", need: 3, reward: 40 },
  { id: "order-73", title: "居民委托 73", item: "fish", need: 4, reward: 48 },
  { id: "order-74", title: "居民委托 74", item: "turnip", need: 5, reward: 56 },
  { id: "order-75", title: "居民委托 75", item: "potato", need: 1, reward: 64 },
  { id: "order-76", title: "居民委托 76", item: "blueberry", need: 2, reward: 72 },
  { id: "order-77", title: "居民委托 77", item: "pumpkin", need: 3, reward: 80 },
  { id: "order-78", title: "居民委托 78", item: "mushroom", need: 4, reward: 88 },
  { id: "order-79", title: "居民委托 79", item: "shell", need: 5, reward: 96 },
  { id: "order-80", title: "居民委托 80", item: "wood", need: 1, reward: 104 },
  { id: "order-81", title: "居民委托 81", item: "stone", need: 2, reward: 40 },
  { id: "order-82", title: "居民委托 82", item: "flower", need: 3, reward: 48 },
  { id: "order-83", title: "居民委托 83", item: "fish", need: 4, reward: 56 },
  { id: "order-84", title: "居民委托 84", item: "turnip", need: 5, reward: 64 },
  { id: "order-85", title: "居民委托 85", item: "potato", need: 1, reward: 72 },
  { id: "order-86", title: "居民委托 86", item: "blueberry", need: 2, reward: 80 },
  { id: "order-87", title: "居民委托 87", item: "pumpkin", need: 3, reward: 88 },
  { id: "order-88", title: "居民委托 88", item: "mushroom", need: 4, reward: 96 },
  { id: "order-89", title: "居民委托 89", item: "shell", need: 5, reward: 104 },
  { id: "order-90", title: "居民委托 90", item: "wood", need: 1, reward: 40 },
  { id: "order-91", title: "居民委托 91", item: "stone", need: 2, reward: 48 },
  { id: "order-92", title: "居民委托 92", item: "flower", need: 3, reward: 56 },
  { id: "order-93", title: "居民委托 93", item: "fish", need: 4, reward: 64 },
  { id: "order-94", title: "居民委托 94", item: "turnip", need: 5, reward: 72 },
  { id: "order-95", title: "居民委托 95", item: "potato", need: 1, reward: 80 },
  { id: "order-96", title: "居民委托 96", item: "blueberry", need: 2, reward: 88 },
  { id: "order-97", title: "居民委托 97", item: "pumpkin", need: 3, reward: 96 },
  { id: "order-98", title: "居民委托 98", item: "mushroom", need: 4, reward: 104 },
  { id: "order-99", title: "居民委托 99", item: "shell", need: 5, reward: 40 },
  { id: "order-100", title: "居民委托 100", item: "wood", need: 1, reward: 48 },
  { id: "order-101", title: "居民委托 101", item: "stone", need: 2, reward: 56 },
  { id: "order-102", title: "居民委托 102", item: "flower", need: 3, reward: 64 },
  { id: "order-103", title: "居民委托 103", item: "fish", need: 4, reward: 72 },
  { id: "order-104", title: "居民委托 104", item: "turnip", need: 5, reward: 80 },
  { id: "order-105", title: "居民委托 105", item: "potato", need: 1, reward: 88 },
  { id: "order-106", title: "居民委托 106", item: "blueberry", need: 2, reward: 96 },
  { id: "order-107", title: "居民委托 107", item: "pumpkin", need: 3, reward: 104 },
  { id: "order-108", title: "居民委托 108", item: "mushroom", need: 4, reward: 40 },
  { id: "order-109", title: "居民委托 109", item: "shell", need: 5, reward: 48 },
  { id: "order-110", title: "居民委托 110", item: "wood", need: 1, reward: 56 },
  { id: "order-111", title: "居民委托 111", item: "stone", need: 2, reward: 64 },
  { id: "order-112", title: "居民委托 112", item: "flower", need: 3, reward: 72 },
  { id: "order-113", title: "居民委托 113", item: "fish", need: 4, reward: 80 },
  { id: "order-114", title: "居民委托 114", item: "turnip", need: 5, reward: 88 },
  { id: "order-115", title: "居民委托 115", item: "potato", need: 1, reward: 96 },
  { id: "order-116", title: "居民委托 116", item: "blueberry", need: 2, reward: 104 },
  { id: "order-117", title: "居民委托 117", item: "pumpkin", need: 3, reward: 40 },
  { id: "order-118", title: "居民委托 118", item: "mushroom", need: 4, reward: 48 },
  { id: "order-119", title: "居民委托 119", item: "shell", need: 5, reward: 56 },
  { id: "order-120", title: "居民委托 120", item: "wood", need: 1, reward: 64 },
  { id: "order-121", title: "居民委托 121", item: "stone", need: 2, reward: 72 },
  { id: "order-122", title: "居民委托 122", item: "flower", need: 3, reward: 80 },
  { id: "order-123", title: "居民委托 123", item: "fish", need: 4, reward: 88 },
  { id: "order-124", title: "居民委托 124", item: "turnip", need: 5, reward: 96 },
  { id: "order-125", title: "居民委托 125", item: "potato", need: 1, reward: 104 },
  { id: "order-126", title: "居民委托 126", item: "blueberry", need: 2, reward: 40 },
  { id: "order-127", title: "居民委托 127", item: "pumpkin", need: 3, reward: 48 },
  { id: "order-128", title: "居民委托 128", item: "mushroom", need: 4, reward: 56 },
  { id: "order-129", title: "居民委托 129", item: "shell", need: 5, reward: 64 },
  { id: "order-130", title: "居民委托 130", item: "wood", need: 1, reward: 72 },
  { id: "order-131", title: "居民委托 131", item: "stone", need: 2, reward: 80 },
  { id: "order-132", title: "居民委托 132", item: "flower", need: 3, reward: 88 },
  { id: "order-133", title: "居民委托 133", item: "fish", need: 4, reward: 96 },
  { id: "order-134", title: "居民委托 134", item: "turnip", need: 5, reward: 104 },
  { id: "order-135", title: "居民委托 135", item: "potato", need: 1, reward: 40 },
  { id: "order-136", title: "居民委托 136", item: "blueberry", need: 2, reward: 48 },
  { id: "order-137", title: "居民委托 137", item: "pumpkin", need: 3, reward: 56 },
  { id: "order-138", title: "居民委托 138", item: "mushroom", need: 4, reward: 64 },
  { id: "order-139", title: "居民委托 139", item: "shell", need: 5, reward: 72 },
  { id: "order-140", title: "居民委托 140", item: "wood", need: 1, reward: 80 },
  { id: "order-141", title: "居民委托 141", item: "stone", need: 2, reward: 88 },
  { id: "order-142", title: "居民委托 142", item: "flower", need: 3, reward: 96 },
  { id: "order-143", title: "居民委托 143", item: "fish", need: 4, reward: 104 },
  { id: "order-144", title: "居民委托 144", item: "turnip", need: 5, reward: 40 },
  { id: "order-145", title: "居民委托 145", item: "potato", need: 1, reward: 48 },
  { id: "order-146", title: "居民委托 146", item: "blueberry", need: 2, reward: 56 },
  { id: "order-147", title: "居民委托 147", item: "pumpkin", need: 3, reward: 64 },
  { id: "order-148", title: "居民委托 148", item: "mushroom", need: 4, reward: 72 },
  { id: "order-149", title: "居民委托 149", item: "shell", need: 5, reward: 80 },
  { id: "order-150", title: "居民委托 150", item: "wood", need: 1, reward: 88 },
  { id: "order-151", title: "居民委托 151", item: "stone", need: 2, reward: 96 },
  { id: "order-152", title: "居民委托 152", item: "flower", need: 3, reward: 104 },
  { id: "order-153", title: "居民委托 153", item: "fish", need: 4, reward: 40 },
  { id: "order-154", title: "居民委托 154", item: "turnip", need: 5, reward: 48 },
  { id: "order-155", title: "居民委托 155", item: "potato", need: 1, reward: 56 },
  { id: "order-156", title: "居民委托 156", item: "blueberry", need: 2, reward: 64 },
  { id: "order-157", title: "居民委托 157", item: "pumpkin", need: 3, reward: 72 },
  { id: "order-158", title: "居民委托 158", item: "mushroom", need: 4, reward: 80 },
  { id: "order-159", title: "居民委托 159", item: "shell", need: 5, reward: 88 },
  { id: "order-160", title: "居民委托 160", item: "wood", need: 1, reward: 96 },
  { id: "order-161", title: "居民委托 161", item: "stone", need: 2, reward: 104 },
  { id: "order-162", title: "居民委托 162", item: "flower", need: 3, reward: 40 },
  { id: "order-163", title: "居民委托 163", item: "fish", need: 4, reward: 48 },
  { id: "order-164", title: "居民委托 164", item: "turnip", need: 5, reward: 56 },
  { id: "order-165", title: "居民委托 165", item: "potato", need: 1, reward: 64 },
  { id: "order-166", title: "居民委托 166", item: "blueberry", need: 2, reward: 72 },
  { id: "order-167", title: "居民委托 167", item: "pumpkin", need: 3, reward: 80 },
  { id: "order-168", title: "居民委托 168", item: "mushroom", need: 4, reward: 88 },
  { id: "order-169", title: "居民委托 169", item: "shell", need: 5, reward: 96 },
  { id: "order-170", title: "居民委托 170", item: "wood", need: 1, reward: 104 },
  { id: "order-171", title: "居民委托 171", item: "stone", need: 2, reward: 40 },
  { id: "order-172", title: "居民委托 172", item: "flower", need: 3, reward: 48 },
  { id: "order-173", title: "居民委托 173", item: "fish", need: 4, reward: 56 },
  { id: "order-174", title: "居民委托 174", item: "turnip", need: 5, reward: 64 },
  { id: "order-175", title: "居民委托 175", item: "potato", need: 1, reward: 72 },
  { id: "order-176", title: "居民委托 176", item: "blueberry", need: 2, reward: 80 },
  { id: "order-177", title: "居民委托 177", item: "pumpkin", need: 3, reward: 88 },
  { id: "order-178", title: "居民委托 178", item: "mushroom", need: 4, reward: 96 },
  { id: "order-179", title: "居民委托 179", item: "shell", need: 5, reward: 104 },
  { id: "order-180", title: "居民委托 180", item: "wood", need: 1, reward: 40 },
  { id: "order-181", title: "居民委托 181", item: "stone", need: 2, reward: 48 },
  { id: "order-182", title: "居民委托 182", item: "flower", need: 3, reward: 56 },
  { id: "order-183", title: "居民委托 183", item: "fish", need: 4, reward: 64 },
  { id: "order-184", title: "居民委托 184", item: "turnip", need: 5, reward: 72 },
  { id: "order-185", title: "居民委托 185", item: "potato", need: 1, reward: 80 },
  { id: "order-186", title: "居民委托 186", item: "blueberry", need: 2, reward: 88 },
  { id: "order-187", title: "居民委托 187", item: "pumpkin", need: 3, reward: 96 },
  { id: "order-188", title: "居民委托 188", item: "mushroom", need: 4, reward: 104 },
  { id: "order-189", title: "居民委托 189", item: "shell", need: 5, reward: 40 },
  { id: "order-190", title: "居民委托 190", item: "wood", need: 1, reward: 48 },
  { id: "order-191", title: "居民委托 191", item: "stone", need: 2, reward: 56 },
  { id: "order-192", title: "居民委托 192", item: "flower", need: 3, reward: 64 },
  { id: "order-193", title: "居民委托 193", item: "fish", need: 4, reward: 72 },
  { id: "order-194", title: "居民委托 194", item: "turnip", need: 5, reward: 80 },
  { id: "order-195", title: "居民委托 195", item: "potato", need: 1, reward: 88 },
  { id: "order-196", title: "居民委托 196", item: "blueberry", need: 2, reward: 96 },
  { id: "order-197", title: "居民委托 197", item: "pumpkin", need: 3, reward: 104 },
  { id: "order-198", title: "居民委托 198", item: "mushroom", need: 4, reward: 40 },
  { id: "order-199", title: "居民委托 199", item: "shell", need: 5, reward: 48 },
  { id: "order-200", title: "居民委托 200", item: "wood", need: 1, reward: 56 },
  { id: "order-201", title: "居民委托 201", item: "stone", need: 2, reward: 64 },
  { id: "order-202", title: "居民委托 202", item: "flower", need: 3, reward: 72 },
  { id: "order-203", title: "居民委托 203", item: "fish", need: 4, reward: 80 },
  { id: "order-204", title: "居民委托 204", item: "turnip", need: 5, reward: 88 },
  { id: "order-205", title: "居民委托 205", item: "potato", need: 1, reward: 96 },
  { id: "order-206", title: "居民委托 206", item: "blueberry", need: 2, reward: 104 },
  { id: "order-207", title: "居民委托 207", item: "pumpkin", need: 3, reward: 40 },
  { id: "order-208", title: "居民委托 208", item: "mushroom", need: 4, reward: 48 },
  { id: "order-209", title: "居民委托 209", item: "shell", need: 5, reward: 56 },
  { id: "order-210", title: "居民委托 210", item: "wood", need: 1, reward: 64 },
  { id: "order-211", title: "居民委托 211", item: "stone", need: 2, reward: 72 },
  { id: "order-212", title: "居民委托 212", item: "flower", need: 3, reward: 80 },
  { id: "order-213", title: "居民委托 213", item: "fish", need: 4, reward: 88 },
  { id: "order-214", title: "居民委托 214", item: "turnip", need: 5, reward: 96 },
  { id: "order-215", title: "居民委托 215", item: "potato", need: 1, reward: 104 },
  { id: "order-216", title: "居民委托 216", item: "blueberry", need: 2, reward: 40 },
  { id: "order-217", title: "居民委托 217", item: "pumpkin", need: 3, reward: 48 },
  { id: "order-218", title: "居民委托 218", item: "mushroom", need: 4, reward: 56 },
  { id: "order-219", title: "居民委托 219", item: "shell", need: 5, reward: 64 },
  { id: "order-220", title: "居民委托 220", item: "wood", need: 1, reward: 72 },
  { id: "order-221", title: "居民委托 221", item: "stone", need: 2, reward: 80 },
  { id: "order-222", title: "居民委托 222", item: "flower", need: 3, reward: 88 },
  { id: "order-223", title: "居民委托 223", item: "fish", need: 4, reward: 96 },
  { id: "order-224", title: "居民委托 224", item: "turnip", need: 5, reward: 104 },
  { id: "order-225", title: "居民委托 225", item: "potato", need: 1, reward: 40 },
  { id: "order-226", title: "居民委托 226", item: "blueberry", need: 2, reward: 48 },
  { id: "order-227", title: "居民委托 227", item: "pumpkin", need: 3, reward: 56 },
  { id: "order-228", title: "居民委托 228", item: "mushroom", need: 4, reward: 64 },
  { id: "order-229", title: "居民委托 229", item: "shell", need: 5, reward: 72 },
  { id: "order-230", title: "居民委托 230", item: "wood", need: 1, reward: 80 },
  { id: "order-231", title: "居民委托 231", item: "stone", need: 2, reward: 88 },
  { id: "order-232", title: "居民委托 232", item: "flower", need: 3, reward: 96 },
  { id: "order-233", title: "居民委托 233", item: "fish", need: 4, reward: 104 },
  { id: "order-234", title: "居民委托 234", item: "turnip", need: 5, reward: 40 },
  { id: "order-235", title: "居民委托 235", item: "potato", need: 1, reward: 48 },
  { id: "order-236", title: "居民委托 236", item: "blueberry", need: 2, reward: 56 },
  { id: "order-237", title: "居民委托 237", item: "pumpkin", need: 3, reward: 64 },
  { id: "order-238", title: "居民委托 238", item: "mushroom", need: 4, reward: 72 },
  { id: "order-239", title: "居民委托 239", item: "shell", need: 5, reward: 80 },
  { id: "order-240", title: "居民委托 240", item: "wood", need: 1, reward: 88 },
  { id: "order-241", title: "居民委托 241", item: "stone", need: 2, reward: 96 },
  { id: "order-242", title: "居民委托 242", item: "flower", need: 3, reward: 104 },
  { id: "order-243", title: "居民委托 243", item: "fish", need: 4, reward: 40 },
  { id: "order-244", title: "居民委托 244", item: "turnip", need: 5, reward: 48 },
  { id: "order-245", title: "居民委托 245", item: "potato", need: 1, reward: 56 },
  { id: "order-246", title: "居民委托 246", item: "blueberry", need: 2, reward: 64 },
  { id: "order-247", title: "居民委托 247", item: "pumpkin", need: 3, reward: 72 },
  { id: "order-248", title: "居民委托 248", item: "mushroom", need: 4, reward: 80 },
  { id: "order-249", title: "居民委托 249", item: "shell", need: 5, reward: 88 },
  { id: "order-250", title: "居民委托 250", item: "wood", need: 1, reward: 96 },
  { id: "order-251", title: "居民委托 251", item: "stone", need: 2, reward: 104 },
  { id: "order-252", title: "居民委托 252", item: "flower", need: 3, reward: 40 },
  { id: "order-253", title: "居民委托 253", item: "fish", need: 4, reward: 48 },
  { id: "order-254", title: "居民委托 254", item: "turnip", need: 5, reward: 56 },
  { id: "order-255", title: "居民委托 255", item: "potato", need: 1, reward: 64 },
  { id: "order-256", title: "居民委托 256", item: "blueberry", need: 2, reward: 72 },
  { id: "order-257", title: "居民委托 257", item: "pumpkin", need: 3, reward: 80 },
  { id: "order-258", title: "居民委托 258", item: "mushroom", need: 4, reward: 88 },
  { id: "order-259", title: "居民委托 259", item: "shell", need: 5, reward: 96 },
  { id: "order-260", title: "居民委托 260", item: "wood", need: 1, reward: 104 },
  { id: "order-261", title: "居民委托 261", item: "stone", need: 2, reward: 40 },
  { id: "order-262", title: "居民委托 262", item: "flower", need: 3, reward: 48 },
  { id: "order-263", title: "居民委托 263", item: "fish", need: 4, reward: 56 },
  { id: "order-264", title: "居民委托 264", item: "turnip", need: 5, reward: 64 },
  { id: "order-265", title: "居民委托 265", item: "potato", need: 1, reward: 72 },
  { id: "order-266", title: "居民委托 266", item: "blueberry", need: 2, reward: 80 },
  { id: "order-267", title: "居民委托 267", item: "pumpkin", need: 3, reward: 88 },
  { id: "order-268", title: "居民委托 268", item: "mushroom", need: 4, reward: 96 },
  { id: "order-269", title: "居民委托 269", item: "shell", need: 5, reward: 104 },
  { id: "order-270", title: "居民委托 270", item: "wood", need: 1, reward: 40 },
  { id: "order-271", title: "居民委托 271", item: "stone", need: 2, reward: 48 },
  { id: "order-272", title: "居民委托 272", item: "flower", need: 3, reward: 56 },
  { id: "order-273", title: "居民委托 273", item: "fish", need: 4, reward: 64 },
  { id: "order-274", title: "居民委托 274", item: "turnip", need: 5, reward: 72 },
  { id: "order-275", title: "居民委托 275", item: "potato", need: 1, reward: 80 },
  { id: "order-276", title: "居民委托 276", item: "blueberry", need: 2, reward: 88 },
  { id: "order-277", title: "居民委托 277", item: "pumpkin", need: 3, reward: 96 },
  { id: "order-278", title: "居民委托 278", item: "mushroom", need: 4, reward: 104 },
  { id: "order-279", title: "居民委托 279", item: "shell", need: 5, reward: 40 },
  { id: "order-280", title: "居民委托 280", item: "wood", need: 1, reward: 48 },
  { id: "order-281", title: "居民委托 281", item: "stone", need: 2, reward: 56 },
  { id: "order-282", title: "居民委托 282", item: "flower", need: 3, reward: 64 },
  { id: "order-283", title: "居民委托 283", item: "fish", need: 4, reward: 72 },
  { id: "order-284", title: "居民委托 284", item: "turnip", need: 5, reward: 80 },
  { id: "order-285", title: "居民委托 285", item: "potato", need: 1, reward: 88 },
  { id: "order-286", title: "居民委托 286", item: "blueberry", need: 2, reward: 96 },
  { id: "order-287", title: "居民委托 287", item: "pumpkin", need: 3, reward: 104 },
  { id: "order-288", title: "居民委托 288", item: "mushroom", need: 4, reward: 40 },
  { id: "order-289", title: "居民委托 289", item: "shell", need: 5, reward: 48 },
  { id: "order-290", title: "居民委托 290", item: "wood", need: 1, reward: 56 },
  { id: "order-291", title: "居民委托 291", item: "stone", need: 2, reward: 64 },
  { id: "order-292", title: "居民委托 292", item: "flower", need: 3, reward: 72 },
  { id: "order-293", title: "居民委托 293", item: "fish", need: 4, reward: 80 },
  { id: "order-294", title: "居民委托 294", item: "turnip", need: 5, reward: 88 },
  { id: "order-295", title: "居民委托 295", item: "potato", need: 1, reward: 96 },
  { id: "order-296", title: "居民委托 296", item: "blueberry", need: 2, reward: 104 },
  { id: "order-297", title: "居民委托 297", item: "pumpkin", need: 3, reward: 40 },
  { id: "order-298", title: "居民委托 298", item: "mushroom", need: 4, reward: 48 },
  { id: "order-299", title: "居民委托 299", item: "shell", need: 5, reward: 56 },
  { id: "order-300", title: "居民委托 300", item: "wood", need: 1, reward: 64 },
  { id: "order-301", title: "居民委托 301", item: "stone", need: 2, reward: 72 },
  { id: "order-302", title: "居民委托 302", item: "flower", need: 3, reward: 80 },
  { id: "order-303", title: "居民委托 303", item: "fish", need: 4, reward: 88 },
  { id: "order-304", title: "居民委托 304", item: "turnip", need: 5, reward: 96 },
  { id: "order-305", title: "居民委托 305", item: "potato", need: 1, reward: 104 },
  { id: "order-306", title: "居民委托 306", item: "blueberry", need: 2, reward: 40 },
  { id: "order-307", title: "居民委托 307", item: "pumpkin", need: 3, reward: 48 },
  { id: "order-308", title: "居民委托 308", item: "mushroom", need: 4, reward: 56 },
  { id: "order-309", title: "居民委托 309", item: "shell", need: 5, reward: 64 },
  { id: "order-310", title: "居民委托 310", item: "wood", need: 1, reward: 72 },
  { id: "order-311", title: "居民委托 311", item: "stone", need: 2, reward: 80 },
  { id: "order-312", title: "居民委托 312", item: "flower", need: 3, reward: 88 },
  { id: "order-313", title: "居民委托 313", item: "fish", need: 4, reward: 96 },
  { id: "order-314", title: "居民委托 314", item: "turnip", need: 5, reward: 104 },
  { id: "order-315", title: "居民委托 315", item: "potato", need: 1, reward: 40 },
  { id: "order-316", title: "居民委托 316", item: "blueberry", need: 2, reward: 48 },
  { id: "order-317", title: "居民委托 317", item: "pumpkin", need: 3, reward: 56 },
  { id: "order-318", title: "居民委托 318", item: "mushroom", need: 4, reward: 64 },
  { id: "order-319", title: "居民委托 319", item: "shell", need: 5, reward: 72 },
  { id: "order-320", title: "居民委托 320", item: "wood", need: 1, reward: 80 },
  { id: "order-321", title: "居民委托 321", item: "stone", need: 2, reward: 88 },
  { id: "order-322", title: "居民委托 322", item: "flower", need: 3, reward: 96 },
  { id: "order-323", title: "居民委托 323", item: "fish", need: 4, reward: 104 },
  { id: "order-324", title: "居民委托 324", item: "turnip", need: 5, reward: 40 },
  { id: "order-325", title: "居民委托 325", item: "potato", need: 1, reward: 48 },
  { id: "order-326", title: "居民委托 326", item: "blueberry", need: 2, reward: 56 },
  { id: "order-327", title: "居民委托 327", item: "pumpkin", need: 3, reward: 64 },
  { id: "order-328", title: "居民委托 328", item: "mushroom", need: 4, reward: 72 },
  { id: "order-329", title: "居民委托 329", item: "shell", need: 5, reward: 80 },
  { id: "order-330", title: "居民委托 330", item: "wood", need: 1, reward: 88 },
  { id: "order-331", title: "居民委托 331", item: "stone", need: 2, reward: 96 },
  { id: "order-332", title: "居民委托 332", item: "flower", need: 3, reward: 104 },
  { id: "order-333", title: "居民委托 333", item: "fish", need: 4, reward: 40 },
  { id: "order-334", title: "居民委托 334", item: "turnip", need: 5, reward: 48 },
  { id: "order-335", title: "居民委托 335", item: "potato", need: 1, reward: 56 },
  { id: "order-336", title: "居民委托 336", item: "blueberry", need: 2, reward: 64 },
  { id: "order-337", title: "居民委托 337", item: "pumpkin", need: 3, reward: 72 },
  { id: "order-338", title: "居民委托 338", item: "mushroom", need: 4, reward: 80 },
  { id: "order-339", title: "居民委托 339", item: "shell", need: 5, reward: 88 },
  { id: "order-340", title: "居民委托 340", item: "wood", need: 1, reward: 96 },
  { id: "order-341", title: "居民委托 341", item: "stone", need: 2, reward: 104 },
  { id: "order-342", title: "居民委托 342", item: "flower", need: 3, reward: 40 },
  { id: "order-343", title: "居民委托 343", item: "fish", need: 4, reward: 48 },
  { id: "order-344", title: "居民委托 344", item: "turnip", need: 5, reward: 56 },
  { id: "order-345", title: "居民委托 345", item: "potato", need: 1, reward: 64 },
  { id: "order-346", title: "居民委托 346", item: "blueberry", need: 2, reward: 72 },
  { id: "order-347", title: "居民委托 347", item: "pumpkin", need: 3, reward: 80 },
  { id: "order-348", title: "居民委托 348", item: "mushroom", need: 4, reward: 88 },
  { id: "order-349", title: "居民委托 349", item: "shell", need: 5, reward: 96 },
  { id: "order-350", title: "居民委托 350", item: "wood", need: 1, reward: 104 },
  { id: "order-351", title: "居民委托 351", item: "stone", need: 2, reward: 40 },
  { id: "order-352", title: "居民委托 352", item: "flower", need: 3, reward: 48 },
  { id: "order-353", title: "居民委托 353", item: "fish", need: 4, reward: 56 },
  { id: "order-354", title: "居民委托 354", item: "turnip", need: 5, reward: 64 },
  { id: "order-355", title: "居民委托 355", item: "potato", need: 1, reward: 72 },
  { id: "order-356", title: "居民委托 356", item: "blueberry", need: 2, reward: 80 },
  { id: "order-357", title: "居民委托 357", item: "pumpkin", need: 3, reward: 88 },
  { id: "order-358", title: "居民委托 358", item: "mushroom", need: 4, reward: 96 },
  { id: "order-359", title: "居民委托 359", item: "shell", need: 5, reward: 104 },
  { id: "order-360", title: "居民委托 360", item: "wood", need: 1, reward: 40 },
  { id: "order-361", title: "居民委托 361", item: "stone", need: 2, reward: 48 },
  { id: "order-362", title: "居民委托 362", item: "flower", need: 3, reward: 56 },
  { id: "order-363", title: "居民委托 363", item: "fish", need: 4, reward: 64 },
  { id: "order-364", title: "居民委托 364", item: "turnip", need: 5, reward: 72 },
  { id: "order-365", title: "居民委托 365", item: "potato", need: 1, reward: 80 },
  { id: "order-366", title: "居民委托 366", item: "blueberry", need: 2, reward: 88 },
  { id: "order-367", title: "居民委托 367", item: "pumpkin", need: 3, reward: 96 },
  { id: "order-368", title: "居民委托 368", item: "mushroom", need: 4, reward: 104 },
  { id: "order-369", title: "居民委托 369", item: "shell", need: 5, reward: 40 },
  { id: "order-370", title: "居民委托 370", item: "wood", need: 1, reward: 48 },
  { id: "order-371", title: "居民委托 371", item: "stone", need: 2, reward: 56 },
  { id: "order-372", title: "居民委托 372", item: "flower", need: 3, reward: 64 },
  { id: "order-373", title: "居民委托 373", item: "fish", need: 4, reward: 72 },
  { id: "order-374", title: "居民委托 374", item: "turnip", need: 5, reward: 80 },
  { id: "order-375", title: "居民委托 375", item: "potato", need: 1, reward: 88 },
  { id: "order-376", title: "居民委托 376", item: "blueberry", need: 2, reward: 96 },
  { id: "order-377", title: "居民委托 377", item: "pumpkin", need: 3, reward: 104 },
  { id: "order-378", title: "居民委托 378", item: "mushroom", need: 4, reward: 40 },
  { id: "order-379", title: "居民委托 379", item: "shell", need: 5, reward: 48 },
  { id: "order-380", title: "居民委托 380", item: "wood", need: 1, reward: 56 },
  { id: "order-381", title: "居民委托 381", item: "stone", need: 2, reward: 64 },
  { id: "order-382", title: "居民委托 382", item: "flower", need: 3, reward: 72 },
  { id: "order-383", title: "居民委托 383", item: "fish", need: 4, reward: 80 },
  { id: "order-384", title: "居民委托 384", item: "turnip", need: 5, reward: 88 },
  { id: "order-385", title: "居民委托 385", item: "potato", need: 1, reward: 96 },
  { id: "order-386", title: "居民委托 386", item: "blueberry", need: 2, reward: 104 },
  { id: "order-387", title: "居民委托 387", item: "pumpkin", need: 3, reward: 40 },
  { id: "order-388", title: "居民委托 388", item: "mushroom", need: 4, reward: 48 },
  { id: "order-389", title: "居民委托 389", item: "shell", need: 5, reward: 56 },
  { id: "order-390", title: "居民委托 390", item: "wood", need: 1, reward: 64 },
  { id: "order-391", title: "居民委托 391", item: "stone", need: 2, reward: 72 },
  { id: "order-392", title: "居民委托 392", item: "flower", need: 3, reward: 80 },
  { id: "order-393", title: "居民委托 393", item: "fish", need: 4, reward: 88 },
  { id: "order-394", title: "居民委托 394", item: "turnip", need: 5, reward: 96 },
  { id: "order-395", title: "居民委托 395", item: "potato", need: 1, reward: 104 },
  { id: "order-396", title: "居民委托 396", item: "blueberry", need: 2, reward: 40 },
  { id: "order-397", title: "居民委托 397", item: "pumpkin", need: 3, reward: 48 },
  { id: "order-398", title: "居民委托 398", item: "mushroom", need: 4, reward: 56 },
  { id: "order-399", title: "居民委托 399", item: "shell", need: 5, reward: 64 },
  { id: "order-400", title: "居民委托 400", item: "wood", need: 1, reward: 72 },
  { id: "order-401", title: "居民委托 401", item: "stone", need: 2, reward: 80 },
  { id: "order-402", title: "居民委托 402", item: "flower", need: 3, reward: 88 },
  { id: "order-403", title: "居民委托 403", item: "fish", need: 4, reward: 96 },
  { id: "order-404", title: "居民委托 404", item: "turnip", need: 5, reward: 104 },
  { id: "order-405", title: "居民委托 405", item: "potato", need: 1, reward: 40 },
  { id: "order-406", title: "居民委托 406", item: "blueberry", need: 2, reward: 48 },
  { id: "order-407", title: "居民委托 407", item: "pumpkin", need: 3, reward: 56 },
  { id: "order-408", title: "居民委托 408", item: "mushroom", need: 4, reward: 64 },
  { id: "order-409", title: "居民委托 409", item: "shell", need: 5, reward: 72 },
  { id: "order-410", title: "居民委托 410", item: "wood", need: 1, reward: 80 },
  { id: "order-411", title: "居民委托 411", item: "stone", need: 2, reward: 88 },
  { id: "order-412", title: "居民委托 412", item: "flower", need: 3, reward: 96 },
  { id: "order-413", title: "居民委托 413", item: "fish", need: 4, reward: 104 },
  { id: "order-414", title: "居民委托 414", item: "turnip", need: 5, reward: 40 },
  { id: "order-415", title: "居民委托 415", item: "potato", need: 1, reward: 48 },
  { id: "order-416", title: "居民委托 416", item: "blueberry", need: 2, reward: 56 },
  { id: "order-417", title: "居民委托 417", item: "pumpkin", need: 3, reward: 64 },
  { id: "order-418", title: "居民委托 418", item: "mushroom", need: 4, reward: 72 },
  { id: "order-419", title: "居民委托 419", item: "shell", need: 5, reward: 80 },
  { id: "order-420", title: "居民委托 420", item: "wood", need: 1, reward: 88 },
  { id: "order-421", title: "居民委托 421", item: "stone", need: 2, reward: 96 },
  { id: "order-422", title: "居民委托 422", item: "flower", need: 3, reward: 104 },
  { id: "order-423", title: "居民委托 423", item: "fish", need: 4, reward: 40 },
  { id: "order-424", title: "居民委托 424", item: "turnip", need: 5, reward: 48 },
  { id: "order-425", title: "居民委托 425", item: "potato", need: 1, reward: 56 },
  { id: "order-426", title: "居民委托 426", item: "blueberry", need: 2, reward: 64 },
  { id: "order-427", title: "居民委托 427", item: "pumpkin", need: 3, reward: 72 },
  { id: "order-428", title: "居民委托 428", item: "mushroom", need: 4, reward: 80 },
  { id: "order-429", title: "居民委托 429", item: "shell", need: 5, reward: 88 },
  { id: "order-430", title: "居民委托 430", item: "wood", need: 1, reward: 96 },
  { id: "order-431", title: "居民委托 431", item: "stone", need: 2, reward: 104 },
  { id: "order-432", title: "居民委托 432", item: "flower", need: 3, reward: 40 },
  { id: "order-433", title: "居民委托 433", item: "fish", need: 4, reward: 48 },
  { id: "order-434", title: "居民委托 434", item: "turnip", need: 5, reward: 56 },
  { id: "order-435", title: "居民委托 435", item: "potato", need: 1, reward: 64 },
  { id: "order-436", title: "居民委托 436", item: "blueberry", need: 2, reward: 72 },
  { id: "order-437", title: "居民委托 437", item: "pumpkin", need: 3, reward: 80 },
  { id: "order-438", title: "居民委托 438", item: "mushroom", need: 4, reward: 88 },
  { id: "order-439", title: "居民委托 439", item: "shell", need: 5, reward: 96 },
  { id: "order-440", title: "居民委托 440", item: "wood", need: 1, reward: 104 },
  { id: "order-441", title: "居民委托 441", item: "stone", need: 2, reward: 40 },
  { id: "order-442", title: "居民委托 442", item: "flower", need: 3, reward: 48 },
  { id: "order-443", title: "居民委托 443", item: "fish", need: 4, reward: 56 },
  { id: "order-444", title: "居民委托 444", item: "turnip", need: 5, reward: 64 },
  { id: "order-445", title: "居民委托 445", item: "potato", need: 1, reward: 72 },
  { id: "order-446", title: "居民委托 446", item: "blueberry", need: 2, reward: 80 },
  { id: "order-447", title: "居民委托 447", item: "pumpkin", need: 3, reward: 88 },
  { id: "order-448", title: "居民委托 448", item: "mushroom", need: 4, reward: 96 },
  { id: "order-449", title: "居民委托 449", item: "shell", need: 5, reward: 104 },
  { id: "order-450", title: "居民委托 450", item: "wood", need: 1, reward: 40 },
  { id: "order-451", title: "居民委托 451", item: "stone", need: 2, reward: 48 },
  { id: "order-452", title: "居民委托 452", item: "flower", need: 3, reward: 56 },
  { id: "order-453", title: "居民委托 453", item: "fish", need: 4, reward: 64 },
  { id: "order-454", title: "居民委托 454", item: "turnip", need: 5, reward: 72 },
  { id: "order-455", title: "居民委托 455", item: "potato", need: 1, reward: 80 },
  { id: "order-456", title: "居民委托 456", item: "blueberry", need: 2, reward: 88 },
  { id: "order-457", title: "居民委托 457", item: "pumpkin", need: 3, reward: 96 },
  { id: "order-458", title: "居民委托 458", item: "mushroom", need: 4, reward: 104 },
  { id: "order-459", title: "居民委托 459", item: "shell", need: 5, reward: 40 },
  { id: "order-460", title: "居民委托 460", item: "wood", need: 1, reward: 48 },
  { id: "order-461", title: "居民委托 461", item: "stone", need: 2, reward: 56 },
  { id: "order-462", title: "居民委托 462", item: "flower", need: 3, reward: 64 },
  { id: "order-463", title: "居民委托 463", item: "fish", need: 4, reward: 72 },
  { id: "order-464", title: "居民委托 464", item: "turnip", need: 5, reward: 80 },
  { id: "order-465", title: "居民委托 465", item: "potato", need: 1, reward: 88 },
  { id: "order-466", title: "居民委托 466", item: "blueberry", need: 2, reward: 96 },
  { id: "order-467", title: "居民委托 467", item: "pumpkin", need: 3, reward: 104 },
  { id: "order-468", title: "居民委托 468", item: "mushroom", need: 4, reward: 40 },
  { id: "order-469", title: "居民委托 469", item: "shell", need: 5, reward: 48 },
  { id: "order-470", title: "居民委托 470", item: "wood", need: 1, reward: 56 },
  { id: "order-471", title: "居民委托 471", item: "stone", need: 2, reward: 64 },
  { id: "order-472", title: "居民委托 472", item: "flower", need: 3, reward: 72 },
  { id: "order-473", title: "居民委托 473", item: "fish", need: 4, reward: 80 },
  { id: "order-474", title: "居民委托 474", item: "turnip", need: 5, reward: 88 },
  { id: "order-475", title: "居民委托 475", item: "potato", need: 1, reward: 96 },
  { id: "order-476", title: "居民委托 476", item: "blueberry", need: 2, reward: 104 },
  { id: "order-477", title: "居民委托 477", item: "pumpkin", need: 3, reward: 40 },
  { id: "order-478", title: "居民委托 478", item: "mushroom", need: 4, reward: 48 },
  { id: "order-479", title: "居民委托 479", item: "shell", need: 5, reward: 56 },
  { id: "order-480", title: "居民委托 480", item: "wood", need: 1, reward: 64 },
  { id: "order-481", title: "居民委托 481", item: "stone", need: 2, reward: 72 },
  { id: "order-482", title: "居民委托 482", item: "flower", need: 3, reward: 80 },
  { id: "order-483", title: "居民委托 483", item: "fish", need: 4, reward: 88 },
  { id: "order-484", title: "居民委托 484", item: "turnip", need: 5, reward: 96 },
  { id: "order-485", title: "居民委托 485", item: "potato", need: 1, reward: 104 },
  { id: "order-486", title: "居民委托 486", item: "blueberry", need: 2, reward: 40 },
  { id: "order-487", title: "居民委托 487", item: "pumpkin", need: 3, reward: 48 },
  { id: "order-488", title: "居民委托 488", item: "mushroom", need: 4, reward: 56 },
  { id: "order-489", title: "居民委托 489", item: "shell", need: 5, reward: 64 },
  { id: "order-490", title: "居民委托 490", item: "wood", need: 1, reward: 72 },
  { id: "order-491", title: "居民委托 491", item: "stone", need: 2, reward: 80 },
  { id: "order-492", title: "居民委托 492", item: "flower", need: 3, reward: 88 },
  { id: "order-493", title: "居民委托 493", item: "fish", need: 4, reward: 96 },
  { id: "order-494", title: "居民委托 494", item: "turnip", need: 5, reward: 104 },
  { id: "order-495", title: "居民委托 495", item: "potato", need: 1, reward: 40 },
  { id: "order-496", title: "居民委托 496", item: "blueberry", need: 2, reward: 48 },
  { id: "order-497", title: "居民委托 497", item: "pumpkin", need: 3, reward: 56 },
  { id: "order-498", title: "居民委托 498", item: "mushroom", need: 4, reward: 64 },
  { id: "order-499", title: "居民委托 499", item: "shell", need: 5, reward: 72 },
  { id: "order-500", title: "居民委托 500", item: "wood", need: 1, reward: 80 },
  { id: "order-501", title: "居民委托 501", item: "stone", need: 2, reward: 88 },
  { id: "order-502", title: "居民委托 502", item: "flower", need: 3, reward: 96 },
  { id: "order-503", title: "居民委托 503", item: "fish", need: 4, reward: 104 },
  { id: "order-504", title: "居民委托 504", item: "turnip", need: 5, reward: 40 },
  { id: "order-505", title: "居民委托 505", item: "potato", need: 1, reward: 48 },
  { id: "order-506", title: "居民委托 506", item: "blueberry", need: 2, reward: 56 },
  { id: "order-507", title: "居民委托 507", item: "pumpkin", need: 3, reward: 64 },
  { id: "order-508", title: "居民委托 508", item: "mushroom", need: 4, reward: 72 },
  { id: "order-509", title: "居民委托 509", item: "shell", need: 5, reward: 80 },
  { id: "order-510", title: "居民委托 510", item: "wood", need: 1, reward: 88 },
  { id: "order-511", title: "居民委托 511", item: "stone", need: 2, reward: 96 },
  { id: "order-512", title: "居民委托 512", item: "flower", need: 3, reward: 104 },
  { id: "order-513", title: "居民委托 513", item: "fish", need: 4, reward: 40 },
  { id: "order-514", title: "居民委托 514", item: "turnip", need: 5, reward: 48 },
  { id: "order-515", title: "居民委托 515", item: "potato", need: 1, reward: 56 },
  { id: "order-516", title: "居民委托 516", item: "blueberry", need: 2, reward: 64 },
  { id: "order-517", title: "居民委托 517", item: "pumpkin", need: 3, reward: 72 },
  { id: "order-518", title: "居民委托 518", item: "mushroom", need: 4, reward: 80 },
  { id: "order-519", title: "居民委托 519", item: "shell", need: 5, reward: 88 },
  { id: "order-520", title: "居民委托 520", item: "wood", need: 1, reward: 96 },
  { id: "order-521", title: "居民委托 521", item: "stone", need: 2, reward: 104 },
  { id: "order-522", title: "居民委托 522", item: "flower", need: 3, reward: 40 },
  { id: "order-523", title: "居民委托 523", item: "fish", need: 4, reward: 48 },
  { id: "order-524", title: "居民委托 524", item: "turnip", need: 5, reward: 56 },
  { id: "order-525", title: "居民委托 525", item: "potato", need: 1, reward: 64 },
  { id: "order-526", title: "居民委托 526", item: "blueberry", need: 2, reward: 72 },
  { id: "order-527", title: "居民委托 527", item: "pumpkin", need: 3, reward: 80 },
  { id: "order-528", title: "居民委托 528", item: "mushroom", need: 4, reward: 88 },
  { id: "order-529", title: "居民委托 529", item: "shell", need: 5, reward: 96 },
  { id: "order-530", title: "居民委托 530", item: "wood", need: 1, reward: 104 },
  { id: "order-531", title: "居民委托 531", item: "stone", need: 2, reward: 40 },
  { id: "order-532", title: "居民委托 532", item: "flower", need: 3, reward: 48 },
  { id: "order-533", title: "居民委托 533", item: "fish", need: 4, reward: 56 },
  { id: "order-534", title: "居民委托 534", item: "turnip", need: 5, reward: 64 },
  { id: "order-535", title: "居民委托 535", item: "potato", need: 1, reward: 72 },
  { id: "order-536", title: "居民委托 536", item: "blueberry", need: 2, reward: 80 },
  { id: "order-537", title: "居民委托 537", item: "pumpkin", need: 3, reward: 88 },
  { id: "order-538", title: "居民委托 538", item: "mushroom", need: 4, reward: 96 },
  { id: "order-539", title: "居民委托 539", item: "shell", need: 5, reward: 104 },
  { id: "order-540", title: "居民委托 540", item: "wood", need: 1, reward: 40 },
  { id: "order-541", title: "居民委托 541", item: "stone", need: 2, reward: 48 },
  { id: "order-542", title: "居民委托 542", item: "flower", need: 3, reward: 56 },
  { id: "order-543", title: "居民委托 543", item: "fish", need: 4, reward: 64 },
  { id: "order-544", title: "居民委托 544", item: "turnip", need: 5, reward: 72 },
  { id: "order-545", title: "居民委托 545", item: "potato", need: 1, reward: 80 },
  { id: "order-546", title: "居民委托 546", item: "blueberry", need: 2, reward: 88 },
  { id: "order-547", title: "居民委托 547", item: "pumpkin", need: 3, reward: 96 },
  { id: "order-548", title: "居民委托 548", item: "mushroom", need: 4, reward: 104 },
  { id: "order-549", title: "居民委托 549", item: "shell", need: 5, reward: 40 },
  { id: "order-550", title: "居民委托 550", item: "wood", need: 1, reward: 48 },
  { id: "order-551", title: "居民委托 551", item: "stone", need: 2, reward: 56 },
  { id: "order-552", title: "居民委托 552", item: "flower", need: 3, reward: 64 },
  { id: "order-553", title: "居民委托 553", item: "fish", need: 4, reward: 72 },
  { id: "order-554", title: "居民委托 554", item: "turnip", need: 5, reward: 80 },
  { id: "order-555", title: "居民委托 555", item: "potato", need: 1, reward: 88 },
  { id: "order-556", title: "居民委托 556", item: "blueberry", need: 2, reward: 96 },
  { id: "order-557", title: "居民委托 557", item: "pumpkin", need: 3, reward: 104 },
  { id: "order-558", title: "居民委托 558", item: "mushroom", need: 4, reward: 40 },
  { id: "order-559", title: "居民委托 559", item: "shell", need: 5, reward: 48 },
  { id: "order-560", title: "居民委托 560", item: "wood", need: 1, reward: 56 },
  { id: "order-561", title: "居民委托 561", item: "stone", need: 2, reward: 64 },
  { id: "order-562", title: "居民委托 562", item: "flower", need: 3, reward: 72 },
  { id: "order-563", title: "居民委托 563", item: "fish", need: 4, reward: 80 },
  { id: "order-564", title: "居民委托 564", item: "turnip", need: 5, reward: 88 },
  { id: "order-565", title: "居民委托 565", item: "potato", need: 1, reward: 96 },
  { id: "order-566", title: "居民委托 566", item: "blueberry", need: 2, reward: 104 },
  { id: "order-567", title: "居民委托 567", item: "pumpkin", need: 3, reward: 40 },
  { id: "order-568", title: "居民委托 568", item: "mushroom", need: 4, reward: 48 },
  { id: "order-569", title: "居民委托 569", item: "shell", need: 5, reward: 56 },
  { id: "order-570", title: "居民委托 570", item: "wood", need: 1, reward: 64 },
  { id: "order-571", title: "居民委托 571", item: "stone", need: 2, reward: 72 },
  { id: "order-572", title: "居民委托 572", item: "flower", need: 3, reward: 80 },
  { id: "order-573", title: "居民委托 573", item: "fish", need: 4, reward: 88 },
  { id: "order-574", title: "居民委托 574", item: "turnip", need: 5, reward: 96 },
  { id: "order-575", title: "居民委托 575", item: "potato", need: 1, reward: 104 },
  { id: "order-576", title: "居民委托 576", item: "blueberry", need: 2, reward: 40 },
  { id: "order-577", title: "居民委托 577", item: "pumpkin", need: 3, reward: 48 },
  { id: "order-578", title: "居民委托 578", item: "mushroom", need: 4, reward: 56 },
  { id: "order-579", title: "居民委托 579", item: "shell", need: 5, reward: 64 },
  { id: "order-580", title: "居民委托 580", item: "wood", need: 1, reward: 72 },
  { id: "order-581", title: "居民委托 581", item: "stone", need: 2, reward: 80 },
  { id: "order-582", title: "居民委托 582", item: "flower", need: 3, reward: 88 },
  { id: "order-583", title: "居民委托 583", item: "fish", need: 4, reward: 96 },
  { id: "order-584", title: "居民委托 584", item: "turnip", need: 5, reward: 104 },
  { id: "order-585", title: "居民委托 585", item: "potato", need: 1, reward: 40 },
  { id: "order-586", title: "居民委托 586", item: "blueberry", need: 2, reward: 48 },
  { id: "order-587", title: "居民委托 587", item: "pumpkin", need: 3, reward: 56 },
  { id: "order-588", title: "居民委托 588", item: "mushroom", need: 4, reward: 64 },
  { id: "order-589", title: "居民委托 589", item: "shell", need: 5, reward: 72 },
  { id: "order-590", title: "居民委托 590", item: "wood", need: 1, reward: 80 },
  { id: "order-591", title: "居民委托 591", item: "stone", need: 2, reward: 88 },
  { id: "order-592", title: "居民委托 592", item: "flower", need: 3, reward: 96 },
  { id: "order-593", title: "居民委托 593", item: "fish", need: 4, reward: 104 },
  { id: "order-594", title: "居民委托 594", item: "turnip", need: 5, reward: 40 },
  { id: "order-595", title: "居民委托 595", item: "potato", need: 1, reward: 48 },
  { id: "order-596", title: "居民委托 596", item: "blueberry", need: 2, reward: 56 },
  { id: "order-597", title: "居民委托 597", item: "pumpkin", need: 3, reward: 64 },
  { id: "order-598", title: "居民委托 598", item: "mushroom", need: 4, reward: 72 },
  { id: "order-599", title: "居民委托 599", item: "shell", need: 5, reward: 80 },
  { id: "order-600", title: "居民委托 600", item: "wood", need: 1, reward: 88 },
  { id: "order-601", title: "居民委托 601", item: "stone", need: 2, reward: 96 },
  { id: "order-602", title: "居民委托 602", item: "flower", need: 3, reward: 104 },
  { id: "order-603", title: "居民委托 603", item: "fish", need: 4, reward: 40 },
  { id: "order-604", title: "居民委托 604", item: "turnip", need: 5, reward: 48 },
  { id: "order-605", title: "居民委托 605", item: "potato", need: 1, reward: 56 },
  { id: "order-606", title: "居民委托 606", item: "blueberry", need: 2, reward: 64 },
  { id: "order-607", title: "居民委托 607", item: "pumpkin", need: 3, reward: 72 },
  { id: "order-608", title: "居民委托 608", item: "mushroom", need: 4, reward: 80 },
  { id: "order-609", title: "居民委托 609", item: "shell", need: 5, reward: 88 },
  { id: "order-610", title: "居民委托 610", item: "wood", need: 1, reward: 96 },
  { id: "order-611", title: "居民委托 611", item: "stone", need: 2, reward: 104 },
  { id: "order-612", title: "居民委托 612", item: "flower", need: 3, reward: 40 },
  { id: "order-613", title: "居民委托 613", item: "fish", need: 4, reward: 48 },
  { id: "order-614", title: "居民委托 614", item: "turnip", need: 5, reward: 56 },
  { id: "order-615", title: "居民委托 615", item: "potato", need: 1, reward: 64 },
  { id: "order-616", title: "居民委托 616", item: "blueberry", need: 2, reward: 72 },
  { id: "order-617", title: "居民委托 617", item: "pumpkin", need: 3, reward: 80 },
  { id: "order-618", title: "居民委托 618", item: "mushroom", need: 4, reward: 88 },
  { id: "order-619", title: "居民委托 619", item: "shell", need: 5, reward: 96 },
  { id: "order-620", title: "居民委托 620", item: "wood", need: 1, reward: 104 },
  { id: "order-621", title: "居民委托 621", item: "stone", need: 2, reward: 40 },
  { id: "order-622", title: "居民委托 622", item: "flower", need: 3, reward: 48 },
  { id: "order-623", title: "居民委托 623", item: "fish", need: 4, reward: 56 },
  { id: "order-624", title: "居民委托 624", item: "turnip", need: 5, reward: 64 },
  { id: "order-625", title: "居民委托 625", item: "potato", need: 1, reward: 72 },
  { id: "order-626", title: "居民委托 626", item: "blueberry", need: 2, reward: 80 },
  { id: "order-627", title: "居民委托 627", item: "pumpkin", need: 3, reward: 88 },
  { id: "order-628", title: "居民委托 628", item: "mushroom", need: 4, reward: 96 },
  { id: "order-629", title: "居民委托 629", item: "shell", need: 5, reward: 104 },
  { id: "order-630", title: "居民委托 630", item: "wood", need: 1, reward: 40 },
  { id: "order-631", title: "居民委托 631", item: "stone", need: 2, reward: 48 },
  { id: "order-632", title: "居民委托 632", item: "flower", need: 3, reward: 56 },
  { id: "order-633", title: "居民委托 633", item: "fish", need: 4, reward: 64 },
  { id: "order-634", title: "居民委托 634", item: "turnip", need: 5, reward: 72 },
  { id: "order-635", title: "居民委托 635", item: "potato", need: 1, reward: 80 },
  { id: "order-636", title: "居民委托 636", item: "blueberry", need: 2, reward: 88 },
  { id: "order-637", title: "居民委托 637", item: "pumpkin", need: 3, reward: 96 },
  { id: "order-638", title: "居民委托 638", item: "mushroom", need: 4, reward: 104 },
  { id: "order-639", title: "居民委托 639", item: "shell", need: 5, reward: 40 },
  { id: "order-640", title: "居民委托 640", item: "wood", need: 1, reward: 48 },
  { id: "order-641", title: "居民委托 641", item: "stone", need: 2, reward: 56 },
  { id: "order-642", title: "居民委托 642", item: "flower", need: 3, reward: 64 },
  { id: "order-643", title: "居民委托 643", item: "fish", need: 4, reward: 72 },
  { id: "order-644", title: "居民委托 644", item: "turnip", need: 5, reward: 80 },
  { id: "order-645", title: "居民委托 645", item: "potato", need: 1, reward: 88 },
  { id: "order-646", title: "居民委托 646", item: "blueberry", need: 2, reward: 96 },
  { id: "order-647", title: "居民委托 647", item: "pumpkin", need: 3, reward: 104 },
  { id: "order-648", title: "居民委托 648", item: "mushroom", need: 4, reward: 40 },
  { id: "order-649", title: "居民委托 649", item: "shell", need: 5, reward: 48 },
  { id: "order-650", title: "居民委托 650", item: "wood", need: 1, reward: 56 },
  { id: "order-651", title: "居民委托 651", item: "stone", need: 2, reward: 64 },
  { id: "order-652", title: "居民委托 652", item: "flower", need: 3, reward: 72 },
  { id: "order-653", title: "居民委托 653", item: "fish", need: 4, reward: 80 },
  { id: "order-654", title: "居民委托 654", item: "turnip", need: 5, reward: 88 },
  { id: "order-655", title: "居民委托 655", item: "potato", need: 1, reward: 96 },
  { id: "order-656", title: "居民委托 656", item: "blueberry", need: 2, reward: 104 },
  { id: "order-657", title: "居民委托 657", item: "pumpkin", need: 3, reward: 40 },
  { id: "order-658", title: "居民委托 658", item: "mushroom", need: 4, reward: 48 },
  { id: "order-659", title: "居民委托 659", item: "shell", need: 5, reward: 56 },
  { id: "order-660", title: "居民委托 660", item: "wood", need: 1, reward: 64 },
  { id: "order-661", title: "居民委托 661", item: "stone", need: 2, reward: 72 },
  { id: "order-662", title: "居民委托 662", item: "flower", need: 3, reward: 80 },
  { id: "order-663", title: "居民委托 663", item: "fish", need: 4, reward: 88 },
  { id: "order-664", title: "居民委托 664", item: "turnip", need: 5, reward: 96 },
  { id: "order-665", title: "居民委托 665", item: "potato", need: 1, reward: 104 },
  { id: "order-666", title: "居民委托 666", item: "blueberry", need: 2, reward: 40 },
  { id: "order-667", title: "居民委托 667", item: "pumpkin", need: 3, reward: 48 },
  { id: "order-668", title: "居民委托 668", item: "mushroom", need: 4, reward: 56 },
  { id: "order-669", title: "居民委托 669", item: "shell", need: 5, reward: 64 },
  { id: "order-670", title: "居民委托 670", item: "wood", need: 1, reward: 72 },
  { id: "order-671", title: "居民委托 671", item: "stone", need: 2, reward: 80 },
  { id: "order-672", title: "居民委托 672", item: "flower", need: 3, reward: 88 },
  { id: "order-673", title: "居民委托 673", item: "fish", need: 4, reward: 96 },
  { id: "order-674", title: "居民委托 674", item: "turnip", need: 5, reward: 104 },
  { id: "order-675", title: "居民委托 675", item: "potato", need: 1, reward: 40 },
  { id: "order-676", title: "居民委托 676", item: "blueberry", need: 2, reward: 48 },
  { id: "order-677", title: "居民委托 677", item: "pumpkin", need: 3, reward: 56 },
  { id: "order-678", title: "居民委托 678", item: "mushroom", need: 4, reward: 64 },
  { id: "order-679", title: "居民委托 679", item: "shell", need: 5, reward: 72 },
  { id: "order-680", title: "居民委托 680", item: "wood", need: 1, reward: 80 },
  { id: "order-681", title: "居民委托 681", item: "stone", need: 2, reward: 88 },
  { id: "order-682", title: "居民委托 682", item: "flower", need: 3, reward: 96 },
  { id: "order-683", title: "居民委托 683", item: "fish", need: 4, reward: 104 },
  { id: "order-684", title: "居民委托 684", item: "turnip", need: 5, reward: 40 },
  { id: "order-685", title: "居民委托 685", item: "potato", need: 1, reward: 48 },
  { id: "order-686", title: "居民委托 686", item: "blueberry", need: 2, reward: 56 },
  { id: "order-687", title: "居民委托 687", item: "pumpkin", need: 3, reward: 64 },
  { id: "order-688", title: "居民委托 688", item: "mushroom", need: 4, reward: 72 },
  { id: "order-689", title: "居民委托 689", item: "shell", need: 5, reward: 80 },
  { id: "order-690", title: "居民委托 690", item: "wood", need: 1, reward: 88 },
  { id: "order-691", title: "居民委托 691", item: "stone", need: 2, reward: 96 },
  { id: "order-692", title: "居民委托 692", item: "flower", need: 3, reward: 104 },
  { id: "order-693", title: "居民委托 693", item: "fish", need: 4, reward: 40 },
  { id: "order-694", title: "居民委托 694", item: "turnip", need: 5, reward: 48 },
  { id: "order-695", title: "居民委托 695", item: "potato", need: 1, reward: 56 },
  { id: "order-696", title: "居民委托 696", item: "blueberry", need: 2, reward: 64 },
  { id: "order-697", title: "居民委托 697", item: "pumpkin", need: 3, reward: 72 },
  { id: "order-698", title: "居民委托 698", item: "mushroom", need: 4, reward: 80 },
  { id: "order-699", title: "居民委托 699", item: "shell", need: 5, reward: 88 },
  { id: "order-700", title: "居民委托 700", item: "wood", need: 1, reward: 96 },
  { id: "order-701", title: "居民委托 701", item: "stone", need: 2, reward: 104 },
  { id: "order-702", title: "居民委托 702", item: "flower", need: 3, reward: 40 },
  { id: "order-703", title: "居民委托 703", item: "fish", need: 4, reward: 48 },
  { id: "order-704", title: "居民委托 704", item: "turnip", need: 5, reward: 56 },
  { id: "order-705", title: "居民委托 705", item: "potato", need: 1, reward: 64 },
  { id: "order-706", title: "居民委托 706", item: "blueberry", need: 2, reward: 72 },
  { id: "order-707", title: "居民委托 707", item: "pumpkin", need: 3, reward: 80 },
  { id: "order-708", title: "居民委托 708", item: "mushroom", need: 4, reward: 88 },
  { id: "order-709", title: "居民委托 709", item: "shell", need: 5, reward: 96 },
  { id: "order-710", title: "居民委托 710", item: "wood", need: 1, reward: 104 },
  { id: "order-711", title: "居民委托 711", item: "stone", need: 2, reward: 40 },
  { id: "order-712", title: "居民委托 712", item: "flower", need: 3, reward: 48 },
  { id: "order-713", title: "居民委托 713", item: "fish", need: 4, reward: 56 },
  { id: "order-714", title: "居民委托 714", item: "turnip", need: 5, reward: 64 },
  { id: "order-715", title: "居民委托 715", item: "potato", need: 1, reward: 72 },
  { id: "order-716", title: "居民委托 716", item: "blueberry", need: 2, reward: 80 },
  { id: "order-717", title: "居民委托 717", item: "pumpkin", need: 3, reward: 88 },
  { id: "order-718", title: "居民委托 718", item: "mushroom", need: 4, reward: 96 },
  { id: "order-719", title: "居民委托 719", item: "shell", need: 5, reward: 104 },
  { id: "order-720", title: "居民委托 720", item: "wood", need: 1, reward: 40 },
  { id: "order-721", title: "居民委托 721", item: "stone", need: 2, reward: 48 },
  { id: "order-722", title: "居民委托 722", item: "flower", need: 3, reward: 56 },
  { id: "order-723", title: "居民委托 723", item: "fish", need: 4, reward: 64 },
  { id: "order-724", title: "居民委托 724", item: "turnip", need: 5, reward: 72 },
  { id: "order-725", title: "居民委托 725", item: "potato", need: 1, reward: 80 },
  { id: "order-726", title: "居民委托 726", item: "blueberry", need: 2, reward: 88 },
  { id: "order-727", title: "居民委托 727", item: "pumpkin", need: 3, reward: 96 },
  { id: "order-728", title: "居民委托 728", item: "mushroom", need: 4, reward: 104 },
  { id: "order-729", title: "居民委托 729", item: "shell", need: 5, reward: 40 },
  { id: "order-730", title: "居民委托 730", item: "wood", need: 1, reward: 48 },
  { id: "order-731", title: "居民委托 731", item: "stone", need: 2, reward: 56 },
  { id: "order-732", title: "居民委托 732", item: "flower", need: 3, reward: 64 },
  { id: "order-733", title: "居民委托 733", item: "fish", need: 4, reward: 72 },
  { id: "order-734", title: "居民委托 734", item: "turnip", need: 5, reward: 80 },
  { id: "order-735", title: "居民委托 735", item: "potato", need: 1, reward: 88 },
  { id: "order-736", title: "居民委托 736", item: "blueberry", need: 2, reward: 96 },
  { id: "order-737", title: "居民委托 737", item: "pumpkin", need: 3, reward: 104 },
  { id: "order-738", title: "居民委托 738", item: "mushroom", need: 4, reward: 40 },
  { id: "order-739", title: "居民委托 739", item: "shell", need: 5, reward: 48 },
  { id: "order-740", title: "居民委托 740", item: "wood", need: 1, reward: 56 },
  { id: "order-741", title: "居民委托 741", item: "stone", need: 2, reward: 64 },
  { id: "order-742", title: "居民委托 742", item: "flower", need: 3, reward: 72 },
  { id: "order-743", title: "居民委托 743", item: "fish", need: 4, reward: 80 },
  { id: "order-744", title: "居民委托 744", item: "turnip", need: 5, reward: 88 },
  { id: "order-745", title: "居民委托 745", item: "potato", need: 1, reward: 96 },
  { id: "order-746", title: "居民委托 746", item: "blueberry", need: 2, reward: 104 },
  { id: "order-747", title: "居民委托 747", item: "pumpkin", need: 3, reward: 40 },
  { id: "order-748", title: "居民委托 748", item: "mushroom", need: 4, reward: 48 },
  { id: "order-749", title: "居民委托 749", item: "shell", need: 5, reward: 56 },
  { id: "order-750", title: "居民委托 750", item: "wood", need: 1, reward: 64 },
  { id: "order-751", title: "居民委托 751", item: "stone", need: 2, reward: 72 },
  { id: "order-752", title: "居民委托 752", item: "flower", need: 3, reward: 80 },
  { id: "order-753", title: "居民委托 753", item: "fish", need: 4, reward: 88 },
  { id: "order-754", title: "居民委托 754", item: "turnip", need: 5, reward: 96 },
  { id: "order-755", title: "居民委托 755", item: "potato", need: 1, reward: 104 },
  { id: "order-756", title: "居民委托 756", item: "blueberry", need: 2, reward: 40 },
  { id: "order-757", title: "居民委托 757", item: "pumpkin", need: 3, reward: 48 },
  { id: "order-758", title: "居民委托 758", item: "mushroom", need: 4, reward: 56 },
  { id: "order-759", title: "居民委托 759", item: "shell", need: 5, reward: 64 },
  { id: "order-760", title: "居民委托 760", item: "wood", need: 1, reward: 72 },
  { id: "order-761", title: "居民委托 761", item: "stone", need: 2, reward: 80 },
  { id: "order-762", title: "居民委托 762", item: "flower", need: 3, reward: 88 },
  { id: "order-763", title: "居民委托 763", item: "fish", need: 4, reward: 96 },
  { id: "order-764", title: "居民委托 764", item: "turnip", need: 5, reward: 104 },
  { id: "order-765", title: "居民委托 765", item: "potato", need: 1, reward: 40 },
  { id: "order-766", title: "居民委托 766", item: "blueberry", need: 2, reward: 48 },
  { id: "order-767", title: "居民委托 767", item: "pumpkin", need: 3, reward: 56 },
  { id: "order-768", title: "居民委托 768", item: "mushroom", need: 4, reward: 64 },
  { id: "order-769", title: "居民委托 769", item: "shell", need: 5, reward: 72 },
  { id: "order-770", title: "居民委托 770", item: "wood", need: 1, reward: 80 },
  { id: "order-771", title: "居民委托 771", item: "stone", need: 2, reward: 88 },
  { id: "order-772", title: "居民委托 772", item: "flower", need: 3, reward: 96 },
  { id: "order-773", title: "居民委托 773", item: "fish", need: 4, reward: 104 },
  { id: "order-774", title: "居民委托 774", item: "turnip", need: 5, reward: 40 },
  { id: "order-775", title: "居民委托 775", item: "potato", need: 1, reward: 48 },
  { id: "order-776", title: "居民委托 776", item: "blueberry", need: 2, reward: 56 },
  { id: "order-777", title: "居民委托 777", item: "pumpkin", need: 3, reward: 64 },
  { id: "order-778", title: "居民委托 778", item: "mushroom", need: 4, reward: 72 },
  { id: "order-779", title: "居民委托 779", item: "shell", need: 5, reward: 80 },
  { id: "order-780", title: "居民委托 780", item: "wood", need: 1, reward: 88 },
  { id: "order-781", title: "居民委托 781", item: "stone", need: 2, reward: 96 },
  { id: "order-782", title: "居民委托 782", item: "flower", need: 3, reward: 104 },
  { id: "order-783", title: "居民委托 783", item: "fish", need: 4, reward: 40 },
  { id: "order-784", title: "居民委托 784", item: "turnip", need: 5, reward: 48 },
  { id: "order-785", title: "居民委托 785", item: "potato", need: 1, reward: 56 },
  { id: "order-786", title: "居民委托 786", item: "blueberry", need: 2, reward: 64 },
  { id: "order-787", title: "居民委托 787", item: "pumpkin", need: 3, reward: 72 },
  { id: "order-788", title: "居民委托 788", item: "mushroom", need: 4, reward: 80 },
  { id: "order-789", title: "居民委托 789", item: "shell", need: 5, reward: 88 },
  { id: "order-790", title: "居民委托 790", item: "wood", need: 1, reward: 96 },
  { id: "order-791", title: "居民委托 791", item: "stone", need: 2, reward: 104 },
  { id: "order-792", title: "居民委托 792", item: "flower", need: 3, reward: 40 },
  { id: "order-793", title: "居民委托 793", item: "fish", need: 4, reward: 48 },
  { id: "order-794", title: "居民委托 794", item: "turnip", need: 5, reward: 56 },
  { id: "order-795", title: "居民委托 795", item: "potato", need: 1, reward: 64 },
  { id: "order-796", title: "居民委托 796", item: "blueberry", need: 2, reward: 72 },
  { id: "order-797", title: "居民委托 797", item: "pumpkin", need: 3, reward: 80 },
  { id: "order-798", title: "居民委托 798", item: "mushroom", need: 4, reward: 88 },
  { id: "order-799", title: "居民委托 799", item: "shell", need: 5, reward: 96 },
  { id: "order-800", title: "居民委托 800", item: "wood", need: 1, reward: 104 },
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

    this.worldMaps = this.createWorldMaps();
    this.currentMapId = "town";
    this.mapTitle = "中心小镇";
    this.tileMap = [];
    this.interactables = [];
    this.npcs = [];
    this.farmPlots = [];
    this.decorations = [];
    this.loadMap("town", { x: 420, y: 420 });

    this.dialogueTarget = null;
    this.dialoguePages = [];
    this.dialoguePage = 0;
    this.loreIndex = 0;
    this.dailyOrders = [];

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
    if (!this.dailyOrders.length) {
      for (let i = 0; i < 3; i++) {
        const idx = (this.gameDay * 7 + i * 11) % BULLETIN_TASKS.length;
        this.dailyOrders.push({ ...BULLETIN_TASKS[idx], done: false });
      }
    }
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

  cloneMap(map) {
    return map.map((r) => [...r]);
  }

  paintRect(map, x1, y1, x2, y2, tile) {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        if (map[y] && typeof map[y][x] !== "undefined") map[y][x] = tile;
      }
    }
  }

  createLakeTileMap() {
    const m = this.cloneMap(this.createTileMap());
    this.paintRect(m, 0, 0, 29, 25, TILE.GRASS);
    this.paintRect(m, 2, 2, 27, 23, TILE.DARK_GRASS);
    this.paintRect(m, 8, 6, 22, 19, TILE.WATER);
    this.paintRect(m, 6, 10, 24, 14, TILE.SAND);
    this.paintRect(m, 0, 11, 29, 12, TILE.PATH);
    return m;
  }

  createForestTileMap() {
    const m = this.cloneMap(this.createTileMap());
    this.paintRect(m, 0, 0, 29, 25, TILE.DARK_GRASS);
    this.paintRect(m, 10, 3, 19, 22, TILE.GRASS);
    this.paintRect(m, 13, 8, 16, 17, TILE.PATH);
    this.paintRect(m, 0, 11, 29, 12, TILE.PATH);
    return m;
  }

  createMountainTileMap() {
    const m = this.cloneMap(this.createTileMap());
    this.paintRect(m, 0, 0, 29, 25, TILE.SAND);
    this.paintRect(m, 2, 2, 27, 23, TILE.PATH);
    this.paintRect(m, 10, 5, 20, 20, TILE.DARK_GRASS);
    this.paintRect(m, 12, 7, 18, 18, TILE.WATER);
    return m;
  }

  createWorldMaps() {
    const townMap = {
      id: "town",
      name: "中心小镇",
      tileMap: this.createTileMap(),
      interactables: this.createInteractables(),
      npcs: this.createNpcs(),
      farmPlots: this.createFarmPlots(),
      decorations: this.createDecorations(),
      links: {
        right: { to: "lake", spawn: { x: 24, y: 420 } },
        left: { to: "forest", spawn: { x: MAP_W * TILE_SIZE - 40, y: 420 } },
        down: { to: "mountain", spawn: { x: 420, y: 40 } },
      },
    };

    const lakeNpcs = [
      { id: "npc-yufu", name: "渔夫阿海", baseX: 720, baseY: 260, color: "#4f8cc9", hatColor: "#2b6ca5", likes: ["nightFish", "fish"], size: 26, x: 720, y: 260, moveTimer: 0, vx: 0, vy: 0 },
      { id: "npc-mia", name: "米娅", baseX: 360, baseY: 300, color: "#c986c9", hatColor: "#934ba4", likes: ["flower", "pumpkin"], size: 26, x: 360, y: 300, moveTimer: 0, vx: 0, vy: 0 },
    ];
    const lakeInteractables = [
      { id: "lake-fish", type: "fishspot", x: 720, y: 360, w: 42, h: 42, name: "深水钓点" },
      { id: "lake-herb-1", type: "herb", x: 280, y: 380, w: 30, h: 30, item: "herb", amount: 1, collected: false, regrowTimer: 0, regrowTime: 65000, name: "湖畔药草" },
      { id: "lake-herb-2", type: "herb", x: 530, y: 460, w: 30, h: 30, item: "herb", amount: 2, collected: false, regrowTimer: 0, regrowTime: 70000, name: "香草簇" },
      { id: "lake-sign", type: "sign", x: 170, y: 520, w: 30, h: 44, name: "湖畔告示", text: "湖区说明：夜晚鱼价更高，白天适合采药。向左返回小镇。" },
    ];
    const lakeDecor = this.createDecorations().filter((_, i) => i % 2 === 0);
    lakeDecor.push({ type: "lamp", x: 610, y: 500 }, { type: "lamp", x: 760, y: 500 });

    const forestNpcs = [
      { id: "npc-gardener", name: "园丁阿棠", baseX: 420, baseY: 760, color: "#5cad6f", hatColor: "#3f8a52", likes: ["flower", "fruit"], size: 26, x: 420, y: 760, moveTimer: 0, vx: 0, vy: 0 },
      { id: "npc-librarian", name: "图书管理员墨言", baseX: 520, baseY: 520, color: "#9d8cc1", hatColor: "#6b5a98", likes: ["flower", "shell"], size: 26, x: 520, y: 520, moveTimer: 0, vx: 0, vy: 0 },
    ];
    const forestInteractables = [
      { id: "forest-tree-1", type: "tree", x: 140, y: 120, w: 64, h: 78, item: "wood", amount: 2, collected: false, regrowTimer: 0, regrowTime: 50000, name: "古树" },
      { id: "forest-tree-2", type: "tree", x: 220, y: 280, w: 64, h: 78, item: "wood", amount: 2, collected: false, regrowTimer: 0, regrowTime: 50000, name: "杉木" },
      { id: "forest-flower-1", type: "flower", x: 510, y: 450, w: 32, h: 32, item: "flower", amount: 2, collected: false, regrowTimer: 0, regrowTime: 45000, name: "林地花簇" },
      { id: "forest-relic", type: "relic", x: 900, y: 300, w: 34, h: 34, item: "relic", amount: 1, collected: false, regrowTimer: 0, regrowTime: 180000, name: "遗迹碎片" },
      { id: "forest-sign", type: "sign", x: 420, y: 560, w: 30, h: 44, name: "林地路牌", text: "林地区：木材与花卉资源丰富。向右可返回中心小镇。" },
    ];

    const mountainNpcs = [
      { id: "npc-miner", name: "矿工石叔", baseX: 980, baseY: 420, color: "#808c98", hatColor: "#5f6973", likes: ["stone", "mushroom"], size: 26, x: 980, y: 420, moveTimer: 0, vx: 0, vy: 0 },
      { id: "npc-carpenter", name: "木匠高伯", baseX: 760, baseY: 580, color: "#7b6a4d", hatColor: "#5c4b32", likes: ["wood", "pumpkin"], size: 26, x: 760, y: 580, moveTimer: 0, vx: 0, vy: 0 },
    ];
    const mountainInteractables = [
      { id: "mount-ore-1", type: "ore", x: 760, y: 320, w: 44, h: 34, item: "ore", amount: 1, collected: false, regrowTimer: 0, regrowTime: 80000, name: "矿脉" },
      { id: "mount-ore-2", type: "ore", x: 840, y: 390, w: 44, h: 34, item: "ore", amount: 2, collected: false, regrowTimer: 0, regrowTime: 100000, name: "富矿脉" },
      { id: "mount-stone-1", type: "stone", x: 520, y: 470, w: 58, h: 44, item: "stone", amount: 2, collected: false, regrowTimer: 0, regrowTime: 110000, name: "山岩" },
      { id: "mount-fish", type: "fishspot", x: 690, y: 360, w: 40, h: 40, name: "山泉钓点" },
      { id: "mount-sign", type: "sign", x: 360, y: 540, w: 30, h: 44, name: "山道告示", text: "矿山区：采矿收益高，向上返回中心小镇。" },
    ];

    return {
      town: townMap,
      lake: { id: "lake", name: "镜湖", tileMap: this.createLakeTileMap(), interactables: lakeInteractables, npcs: lakeNpcs, farmPlots: [], decorations: lakeDecor, links: { left: { to: "town", spawn: { x: MAP_W * TILE_SIZE - 40, y: 420 } } } },
      forest: { id: "forest", name: "青杉林地", tileMap: this.createForestTileMap(), interactables: forestInteractables, npcs: forestNpcs, farmPlots: [], decorations: this.createDecorations(), links: { right: { to: "town", spawn: { x: 40, y: 420 } } } },
      mountain: { id: "mountain", name: "矿脉高地", tileMap: this.createMountainTileMap(), interactables: mountainInteractables, npcs: mountainNpcs, farmPlots: [], decorations: this.createDecorations().slice(0, 40), links: { up: { to: "town", spawn: { x: 420, y: MAP_H * TILE_SIZE - 40 } } } },
    };
  }

  loadMap(mapId, spawn = null) {
    this.saveCurrentMapState();
    const m = this.worldMaps[mapId];
    if (!m) return;
    this.currentMapId = mapId;
    this.mapTitle = m.name;
    this.tileMap = this.cloneMap(m.tileMap);
    this.interactables = m.interactables.map((o) => ({ ...o }));
    this.npcs = m.npcs.map((n) => ({ ...n }));
    this.farmPlots = (m.farmPlots || []).map((p) => ({ ...p }));
    this.decorations = (m.decorations || []).map((d) => ({ ...d }));
    if (spawn) {
      this.player.x = spawn.x;
      this.player.y = spawn.y;
    }
    this.showMessage(`已到达：${m.name}`, 1800);
  }

  saveCurrentMapState() {
    const m = this.worldMaps[this.currentMapId];
    if (!m) return;
    m.tileMap = this.cloneMap(this.tileMap || m.tileMap);
    m.interactables = (this.interactables || []).map((o) => ({ ...o }));
    m.npcs = (this.npcs || []).map((n) => ({ ...n }));
    m.farmPlots = (this.farmPlots || []).map((p) => ({ ...p }));
    m.decorations = (this.decorations || []).map((d) => ({ ...d }));
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
    this.saveCurrentMapState();
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
      dailyOrders: this.dailyOrders,
      loreIndex: this.loreIndex,
      currentMapId: this.currentMapId,
      worldMaps: this.worldMaps,
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
      if (data.dailyOrders) this.dailyOrders = data.dailyOrders;
      if (typeof data.loreIndex === "number") this.loreIndex = data.loreIndex;
      if (data.worldMaps) this.worldMaps = data.worldMaps;
      if (data.currentMapId && this.worldMaps[data.currentMapId]) this.loadMap(data.currentMapId);
    } catch (e) {}
  }

  bindEvents() {
    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      if (["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d","e","escape","enter"," ","i","tab","q","g","j"].includes(key)) e.preventDefault();
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
        if (key === "j") this.scene = SCENE.JOURNAL;
      } else if (this.scene === SCENE.DIALOGUE) {
        if (key === "e" || key === "enter" || key === " ") this.advanceDialogue();
        if (key === "escape") this.scene = SCENE.PLAYING;
      } else if (this.scene === SCENE.SHOP) {
        this.handleShopInput(key);
      } else if (this.scene === SCENE.INVENTORY) {
        if (key === "escape" || key === "i") this.scene = SCENE.PLAYING;
      } else if (this.scene === SCENE.JOURNAL) {
        if (key === "escape" || key === "j") this.scene = SCENE.PLAYING;
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
    this.checkDailyOrders();
    this.updateTownRank();
    this.checkAchievements();
  }

  onNewDay() {
    this.dailyActions = { talked: {}, gifted: {} };
    this.farmPlots.forEach((p) => { p.watered = false; });
    Object.values(this.worldMaps).forEach((wm) => {
      (wm.interactables || []).forEach((o) => {
        if (o.collected && o.regrowTime > 0) {
          o.collected = false;
          o.regrowTimer = 0;
        }
      });
      (wm.farmPlots || []).forEach((p) => { p.watered = false; });
    });
    this.loadMap(this.currentMapId, { x: this.player.x, y: this.player.y });
    this.loreIndex = (this.gameDay * 13) % TOWN_LORE.length;
    this.dailyOrders = [];
    for (let i = 0; i < 3; i++) {
      const idx = (this.gameDay * 7 + i * 11) % BULLETIN_TASKS.length;
      this.dailyOrders.push({ ...BULLETIN_TASKS[idx], done: false });
    }
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
      if (npc.id === "npc-baker") return { x: 520, y: 630 };
      if (npc.id === "npc-carpenter") return { x: 720, y: 660 };
      if (npc.id === "npc-doctor") return { x: 580, y: 260 };
      if (npc.id === "npc-librarian") return { x: 400, y: 540 };
      if (npc.id === "npc-gardener") return { x: 280, y: 740 };
      if (npc.id === "npc-miner") return { x: 1080, y: 420 };
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

    const links = this.worldMaps[this.currentMapId]?.links || {};
    if (this.player.x <= 8 && links.left) return this.loadMap(links.left.to, links.left.spawn);
    if (this.player.x >= MAP_W * TILE_SIZE - 8 && links.right) return this.loadMap(links.right.to, links.right.spawn);
    if (this.player.y <= 8 && links.up) return this.loadMap(links.up.to, links.up.spawn);
    if (this.player.y >= MAP_H * TILE_SIZE - 8 && links.down) return this.loadMap(links.down.to, links.down.spawn);

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
    const period = h < 12 ? "morning" : h < 18 ? "afternoon" : "night";
    const lib = DIALOGUE_LIBRARY[npc.id];
    if (lib?.[period]?.length) {
      const base = (this.gameDay + Math.floor(this.gameMinutes)) % lib[period].length;
      pages.push(lib[period][base]);
      pages.push(lib[period][(base + 3) % lib[period].length]);
    } else if (h < 12) pages.push("早上先看农田是个好习惯，浇水会决定今天收成。");
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

  checkDailyOrders() {
    this.dailyOrders.forEach((o) => {
      if (o.done) return;
      if ((this.inventory[o.item] || 0) >= o.need) {
        o.done = true;
        this.removeItem(o.item, o.need);
        this.gold += o.reward;
        this.progress.totalEarned += o.reward;
        this.showMessage(`委托完成：${o.title}，获得 ${o.reward} 金币`, 2500);
        this.pushFloatingText(this.player.x, this.player.y - 18, `委托+${o.reward}金`, "#ffe17f");
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
    if (this.scene === SCENE.JOURNAL) { this.renderGame(); this.renderJournal(); return; }
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
      else if (obj.type === "herb") this.drawHerb(obj);
      else if (obj.type === "ore") this.drawOre(obj);
      else if (obj.type === "relic") this.drawRelic(obj);

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
  drawHerb(obj){const {ctx}=this;ctx.fillStyle=obj.collected?"#8da987":"#4fb86f";ctx.fillRect(obj.x+12,obj.y+8,6,18);ctx.fillRect(obj.x+6,obj.y+12,6,14);ctx.fillRect(obj.x+18,obj.y+12,6,14);}
  drawOre(obj){const {ctx}=this;ctx.fillStyle=obj.collected?"#929aa3":"#606b79";ctx.beginPath();ctx.moveTo(obj.x+4,obj.y+26);ctx.lineTo(obj.x+18,obj.y+4);ctx.lineTo(obj.x+38,obj.y+10);ctx.lineTo(obj.x+40,obj.y+28);ctx.closePath();ctx.fill();ctx.fillStyle="#9fb1c0";ctx.fillRect(obj.x+16,obj.y+14,8,5);}
  drawRelic(obj){const {ctx}=this;ctx.fillStyle=obj.collected?"#888":"#8a5ab8";ctx.beginPath();ctx.arc(obj.x+16,obj.y+16,14,0,Math.PI*2);ctx.fill();ctx.fillStyle="#d7c9f5";ctx.beginPath();ctx.arc(obj.x+16,obj.y+16,5,0,Math.PI*2);ctx.fill();}

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

    this.drawPanel(10, 10, 360, 162, { fill: "rgba(20,36,20,0.82)", stroke: "rgba(178,225,170,0.55)" });
    ctx.fillStyle = "#f0d040";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`💰 ${this.gold} 金币`, 22, 34);
    ctx.fillStyle = "#c8f0ff";
    ctx.font = "14px sans-serif";
    ctx.fillText(`⏰ 第${this.gameDay}天  ${timeStr}`, 22, 54);
    ctx.fillText(`🧭 ${this.mapTitle}`, 22, 74);
    ctx.fillText(`🏠小屋Lv${this.progress.houseLevel}  🚜农场Lv${this.progress.farmLevel}  ⭐镇级${this.progress.townRank}`, 22, 92);
    ctx.fillText(`🌾收获:${this.progress.harvestCount}  🎣钓鱼:${this.progress.fishCaught}  📈累计赚:${this.progress.totalEarned}`, 22, 110);
    ctx.fillStyle = "#b8f0b8";
    ctx.fillText(activeSeed ? `Q切换种子：${ITEMS[activeSeed].icon}${ITEMS[activeSeed].name}(${this.inventory[activeSeed]})` : "当前无种子（去商店购买）", 22, 128);
    ctx.fillStyle = "#d7eac6";
    ctx.font = "12px sans-serif";
    ctx.fillText(`📘 ${TOWN_LORE[this.loreIndex]?.slice(0, 34) || "今天也要好好经营小镇。"}…`, 22, 146);

    this.drawPanel(canvas.width - 284, 10, 274, 146, { fill: "rgba(10,20,10,0.68)", stroke: "rgba(170,216,170,0.45)" });
    ctx.fillStyle = "#c8e8c8";
    ctx.font = "12px sans-serif";
    ["WASD 移动 / E 互动", "触碰地图边界可切换到相邻区域", "农地：翻地→播种→每日浇水→收获", "Q 切种子  G 赠礼提升好感", "I 背包  J 手帐  Tab商店分页", "F5 存档 / ESC 关闭面板"].forEach((line, i) => ctx.fillText(line, canvas.width - 272, 30 + i * 20));
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

  renderJournal() {
    const { ctx, canvas } = this;
    const panelW = 640, panelH = 390;
    const px = (canvas.width - panelW) / 2;
    const py = (canvas.height - panelH) / 2;
    this.drawPanel(px, py, panelW, panelH, { fill: "rgba(14,26,20,0.96)", stroke: "#a7cf8e", lineWidth: 2 });
    ctx.fillStyle = "#f4e6bf";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("📖 小镇手帐", canvas.width / 2, py + 34);

    ctx.textAlign = "left";
    ctx.fillStyle = "#d8efc9";
    ctx.font = "14px sans-serif";
    ctx.fillText(`今日札记：${TOWN_LORE[this.loreIndex] || "晴朗的一天，适合整理农务与镇务。"}`, px + 24, py + 72);

    ctx.fillStyle = "#f0d060";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("居民委托板", px + 24, py + 110);
    this.dailyOrders.forEach((o, i) => {
      ctx.fillStyle = o.done ? "#8edc9f" : "#f0ffe0";
      ctx.font = "13px sans-serif";
      ctx.fillText(`${o.done ? "✅" : "📌"} ${o.title}：提交 ${ITEMS[o.item]?.name || o.item} x${o.need}，奖励 ${o.reward} 金币`, px + 24, py + 136 + i * 26);
    });

    ctx.fillStyle = "#f0d060";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("关系速览", px + 24, py + 236);
    const rels = Object.entries(this.relationship).sort((a, b) => b[1] - a[1]).slice(0, 8);
    rels.forEach(([id, v], i) => {
      const name = this.npcs.find(n => n.id === id)?.name || id;
      ctx.fillStyle = "#d8efc9";
      ctx.font = "13px sans-serif";
      ctx.fillText(`${name}: ${v}/100`, px + 24 + (i % 2) * 280, py + 262 + Math.floor(i / 2) * 24);
    });

    ctx.fillStyle = "#88cc88";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("按 J 或 ESC 关闭手帐", canvas.width / 2, py + panelH - 16);
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
