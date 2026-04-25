// =============================================
// 晨露小镇 - 长线生活模拟版
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
  [TILE.GRASS]: "#86b96f",
  [TILE.PATH]: "#d9c8a7",
  [TILE.WATER]: "#6ea9c4",
  [TILE.SAND]: "#e3d6ad",
  [TILE.FLOWER]: "#8dbe78",
  [TILE.DARK_GRASS]: "#668f58",
  [TILE.WOOD_FLOOR]: "#b78e5c",
  [TILE.FARM_SOIL]: "#856249",
};

const TILE_SIZE = 48;
const INTERACT_DISTANCE = 90;
const MAP_W = 30;
const MAP_H = 26;
const TIME_SPEED = 0.03;

const UI = {
  ink: "#1d2e2a",
  inkSoft: "#61716a",
  paper: "rgba(249, 244, 231, 0.94)",
  paperDim: "rgba(232, 222, 202, 0.86)",
  glass: "rgba(25, 36, 33, 0.82)",
  glassSoft: "rgba(25, 36, 33, 0.62)",
  cream: "#f9efd1",
  gold: "#d9b96f",
  green: "#779d6b",
  blue: "#6a9bb4",
  red: "#bd756a",
  shadow: "rgba(20, 31, 28, 0.30)",
};

const SEASONS = [
  { id: "spring", name: "春芽季", accent: "#7cae75", cropBonus: ["turnip", "strawberry", "tea"], desc: "野花和浆果更活跃，适合开荒。" },
  { id: "summer", name: "夏潮季", accent: "#d6a65f", cropBonus: ["corn", "melon", "rice"], desc: "作物成长稳定，海边鱼货价值更高。" },
  { id: "autumn", name: "秋实季", accent: "#c9855f", cropBonus: ["pumpkin", "grape", "potato"], desc: "农作物售价更好，委托奖励更丰厚。" },
  { id: "winter", name: "冬灯季", accent: "#7aa5ba", cropBonus: ["mushroom", "crystal"], desc: "采矿和料理更划算，稀有鱼更常出现。" },
];

const FESTIVALS = [
  { day: 7, name: "花篱集", desc: "送花和水果好感额外提升。" },
  { day: 14, name: "潮声夜市", desc: "夜晚出售鱼货价格更高。" },
  { day: 21, name: "丰收评鉴", desc: "农产品和加工品售价提升。" },
  { day: 28, name: "灯火晚餐", desc: "料理恢复更多体力。" },
];

const WORLD_INFO = {
  town: { id: "town", name: "晨露镇", accent: "#7ccf72", short: "镇" },
  forest: { id: "forest", name: "雾林", accent: "#5eaf6a", short: "林" },
  harbor: { id: "harbor", name: "月湾", accent: "#68b6e7", short: "湾" },
  highlands: { id: "highlands", name: "风岬高地", accent: "#d9a560", short: "高" },
};

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
  crafting: { label: "加工", icon: "🍳", color: "#e5b66a" },
};

const ANIMALS = {
  chicken: { name: "小鸡", icon: "🐔", product: "egg", rareProduct: "largeEgg", matureDays: 2, cost: { gold: 260, hay: 3 } },
  cow: { name: "奶牛", icon: "🐄", product: "milk", rareProduct: "largeMilk", matureDays: 4, cost: { gold: 540, hay: 6 } },
  sheep: { name: "绵羊", icon: "🐑", product: "wool", rareProduct: "fineWool", matureDays: 5, cost: { gold: 720, hay: 8 } },
};

const PROJECTS = [
  {
    id: "pantry",
    name: "田园储藏室",
    desc: "把稳定作物交给镇务所，解锁更好的茶叶经营。",
    requirements: { turnip: 3, potato: 3, strawberry: 2 },
    reward: { gold: 180, item: "seed_tea", amount: 5 },
  },
  {
    id: "fishery",
    name: "月湾鱼档",
    desc: "帮月湾建立鱼档，夜钓与稀有鱼收益会更好。",
    requirements: { fish: 4, silverFish: 2, shell: 3, coral: 1 },
    reward: { gold: 260, rodLevel: 1 },
  },
  {
    id: "forestStation",
    name: "雾林林务站",
    desc: "修整林道和采集台，雾林会成为稳定的草药、蜂蜜和松脂来源。",
    requirements: { wood: 18, fern: 4, resin: 3, wildHoney: 1 },
    reward: { gold: 340, item: "seed_tea", amount: 5 },
  },
  {
    id: "irrigation",
    name: "灌溉水渠",
    desc: "修一段水渠，每天自动浇灌一批已播种地块。",
    requirements: { wood: 18, stone: 24, crystal: 2 },
    reward: { gold: 120, irrigationLevel: 1 },
  },
  {
    id: "ranchGuild",
    name: "牧场协会",
    desc: "提交动物产物，获得稳定饲料和牧场名望。",
    requirements: { egg: 2, milk: 1, mayonnaise: 1 },
    reward: { gold: 280, item: "hay", amount: 20 },
  },
  {
    id: "artisanStall",
    name: "手作摊位",
    desc: "让加工品成为小镇招牌，出售加工品获得更高评价。",
    requirements: { cheese: 1, jam: 1, honey: 1, cloth: 1 },
    reward: { gold: 420, toolLevel: 1 },
  },
  {
    id: "highlandLift",
    name: "高地升降台",
    desc: "高地矿料运输更方便，工具升级成本更低。",
    requirements: { wood: 30, stone: 30, ore: 8, ingot: 2 },
    reward: { gold: 520, toolLevel: 1 },
  },
];

const NON_SHIPPABLE_ITEMS = new Set(["wood", "stone", "hay", "crystal", "ore", "ingot"]);

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
    ingredients: { mushroom: 1, potato: 1, herb: 1 },
    energy: 32,
    effect: "harvest",
    amount: 0.22,
    desc: "恢复 32 体力，今日收获更容易额外 +1",
  },
  {
    id: "seaSnack",
    name: "海风小食",
    ingredients: { fish: 1, coral: 1 },
    energy: 28,
    effect: "fishing",
    amount: 0.18,
    desc: "恢复 28 体力，钓鱼进度更快、稀有鱼略多",
  },
  {
    id: "mountainPlate",
    name: "高地拼盘",
    ingredients: { crystal: 1, herb: 1, mushroom: 1 },
    energy: 40,
    effect: "social",
    amount: 3,
    desc: "恢复 40 体力，今日聊天额外 +3 好感",
  },
  {
    id: "farmOmelet",
    name: "晨光蛋卷",
    ingredients: { egg: 1, herb: 1 },
    energy: 34,
    effect: "harvest",
    amount: 0.16,
    desc: "恢复 34 体力，今日收获小幅提升",
  },
  {
    id: "creamSoup",
    name: "奶油蔬菜汤",
    ingredients: { milk: 1, potato: 1, corn: 1 },
    energy: 46,
    effect: "fishing",
    amount: 0.14,
    desc: "恢复 46 体力，今日钓鱼节奏更稳",
  },
  {
    id: "honeyToast",
    name: "蜂蜜烤吐司",
    ingredients: { honey: 1, fruit: 1 },
    energy: 38,
    effect: "social",
    amount: 4,
    desc: "恢复 38 体力，今日社交额外 +4 好感",
  },
  {
    id: "forestSalad",
    name: "雾林冷盘",
    ingredients: { fern: 1, herb: 1, wildHoney: 1 },
    energy: 36,
    effect: "foraging",
    amount: 0.18,
    desc: "恢复 36 体力，今日采集额外收获概率提升",
  },
];

const WORKSHOP_RECIPES = [
  { id: "mayonnaise", name: "蛋黄酱", icon: "🥣", ingredients: { egg: 1 }, result: "mayonnaise", amount: 1, xp: 4, desc: "把鸡蛋加工成更高价值的商品" },
  { id: "cheese", name: "奶酪", icon: "🧀", ingredients: { milk: 1 }, result: "cheese", amount: 1, xp: 5, desc: "稳定赚钱，也常被居民点名" },
  { id: "jam", name: "果酱", icon: "🍯", ingredients: { fruit: 2 }, result: "jam", amount: 1, xp: 4, desc: "适合处理多余水果" },
  { id: "ingot", name: "金属锭", icon: "🔩", ingredients: { ore: 3, stone: 1 }, result: "ingot", amount: 1, xp: 5, desc: "高地矿石熔成建设材料" },
  { id: "cloth", name: "布料", icon: "🧶", ingredients: { wool: 1 }, result: "cloth", amount: 1, xp: 6, desc: "小屋和镇子升级会用到" },
  { id: "flowerHoney", name: "花蜜", icon: "🍯", ingredients: { flower: 2 }, result: "honey", amount: 1, xp: 3, desc: "料理和赠礼都很受欢迎" },
  { id: "forestWax", name: "林脂蜡", icon: "🕯️", ingredients: { resin: 1, wildHoney: 1 }, result: "forestWax", amount: 1, xp: 6, desc: "雾林材料加工成高价手作" },
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
  { id: "forest-herbs", requester: "npc-ye", item: "herb", amount: [2, 4], gold: 104, favor: 7, minRank: 2 },
  { id: "harbor-coral", requester: "npc-lan", item: "coral", amount: [1, 2], gold: 132, favor: 8, minRank: 2 },
  { id: "corn-stock", requester: "npc-chen", item: "corn", amount: [2, 3], gold: 148, favor: 8, minRank: 3 },
  { id: "crystal-study", requester: "npc-chen", item: "crystal", amount: [1, 2], gold: 176, favor: 9, minRank: 3 },
  { id: "gold-koi", requester: "npc-maomao", item: "goldKoi", amount: [1, 1], gold: 220, favor: 12, minRank: 3 },
  { id: "melon-feast", requester: "npc-zhuang", item: "melon", amount: [1, 2], gold: 188, favor: 10, minRank: 4 },
  { id: "egg-breakfast", requester: "npc-su", item: "egg", amount: [2, 4], gold: 116, favor: 7, minRank: 2 },
  { id: "milk-run", requester: "npc-lingling", item: "milk", amount: [1, 3], gold: 138, favor: 7, minRank: 2 },
  { id: "tea-leaf", requester: "npc-mei", item: "teaLeaf", amount: [2, 4], gold: 150, favor: 8, minRank: 3 },
  { id: "jam-order", requester: "npc-mei", item: "jam", amount: [1, 2], gold: 196, favor: 10, minRank: 3 },
  { id: "cheese-board", requester: "npc-su", item: "cheese", amount: [1, 2], gold: 216, favor: 10, minRank: 3 },
  { id: "cloth-repair", requester: "npc-zhuang", item: "cloth", amount: [1, 2], gold: 248, favor: 11, minRank: 4 },
  { id: "honey-gift", requester: "npc-lan", item: "honey", amount: [1, 2], gold: 186, favor: 9, minRank: 4 },
  { id: "fine-wool", requester: "npc-ye", item: "fineWool", amount: [1, 1], gold: 320, favor: 12, minRank: 5 },
  { id: "ore-sample", requester: "npc-chen", item: "ore", amount: [3, 5], gold: 178, favor: 8, minRank: 3 },
  { id: "ingot-order", requester: "npc-su", item: "ingot", amount: [1, 2], gold: 260, favor: 11, minRank: 4 },
  { id: "forest-fern", requester: "npc-ye", item: "fern", amount: [2, 4], gold: 118, favor: 8, minRank: 2 },
  { id: "forest-resin", requester: "npc-chen", item: "resin", amount: [1, 2], gold: 132, favor: 7, minRank: 2 },
  { id: "wild-honey", requester: "npc-mei", item: "wildHoney", amount: [1, 2], gold: 168, favor: 9, minRank: 2 },
  { id: "firefly-study", requester: "npc-ye", item: "fireflyJar", amount: [1, 1], gold: 190, favor: 10, minRank: 3 },
  { id: "forest-wax", requester: "npc-mei", item: "forestWax", amount: [1, 2], gold: 238, favor: 11, minRank: 4 },
];

const AREA_TASK_TEMPLATES = {
  forest: [
    { id: "forest-herb-kit", title: "雾林草药包", desc: "阿叶要整理林务站的常备药草。", requirements: { herb: 2, mushroom: 1 }, gold: 126, favor: "npc-ye", favorGain: 7, xp: { foraging: 8 }, reward: { item: "seed_tea", amount: 2 }, minRank: 1 },
    { id: "forest-trail-repair", title: "林道维护", desc: "修补湿滑木阶，让雾林路线更安全。", requirements: { wood: 5, resin: 1 }, gold: 154, favor: "npc-ye", favorGain: 6, xp: { foraging: 7 }, reward: { item: "hay", amount: 5 }, minRank: 1 },
    { id: "forest-glow-study", title: "萤火观测", desc: "收集夜间萤光样本，记录雾林生态。", requirements: { fireflyJar: 1, fern: 2 }, gold: 196, favor: "npc-ye", favorGain: 9, xp: { foraging: 10 }, reward: { item: "wildHoney", amount: 1 }, minRank: 2 },
  ],
  harbor: [
    { id: "harbor-tide-basket", title: "潮汐篮", desc: "小岚需要贝壳和珊瑚补齐渔具装饰。", requirements: { shell: 3, coral: 1 }, gold: 172, favor: "npc-lan", favorGain: 7, xp: { fishing: 6 }, reward: { item: "fish", amount: 1 }, minRank: 1 },
    { id: "harbor-smoke-fish", title: "海风鱼货", desc: "把当天能卖的鱼货集中交给码头。", requirements: { fish: 2, silverFish: 1 }, gold: 218, favor: "npc-lan", favorGain: 8, xp: { fishing: 9 }, reward: { item: "coral", amount: 1 }, minRank: 2 },
  ],
  highlands: [
    { id: "highland-survey", title: "高地勘探", desc: "记录晶石和矿脉，让山道工程更稳。", requirements: { ore: 3, crystal: 1 }, gold: 236, favor: "npc-chen", favorGain: 8, xp: { foraging: 7, crafting: 4 }, reward: { item: "stone", amount: 5 }, minRank: 3 },
    { id: "highland-forge-stock", title: "炉料补给", desc: "为工坊储备高地矿料。", requirements: { ore: 4, stone: 4 }, gold: 260, favor: "npc-su", favorGain: 8, xp: { crafting: 9 }, reward: { item: "ingot", amount: 1 }, minRank: 4 },
  ],
};

const ITEMS = {
  wood: { name: "木材", icon: "🪵", sellPrice: 6, buyPrice: 18, desc: "建造材料" },
  fruit: { name: "果子", icon: "🍎", sellPrice: 10, buyPrice: 24, desc: "新鲜水果" },
  fish: { name: "普通鱼", icon: "🐟", sellPrice: 18, buyPrice: 0, desc: "常见河鱼" },
  nightFish: { name: "夜行鱼", icon: "🌙🐠", sellPrice: 36, buyPrice: 0, desc: "只在夜晚活跃" },
  silverFish: { name: "银鳞鱼", icon: "🐠", sellPrice: 26, buyPrice: 0, desc: "雨天更容易钓到" },
  goldKoi: { name: "锦鲤", icon: "🐡", sellPrice: 74, buyPrice: 0, desc: "很少见的漂亮鱼" },
  flower: { name: "花", icon: "🌸", sellPrice: 8, buyPrice: 0, desc: "野花" },
  herb: { name: "香草", icon: "🌿", sellPrice: 16, buyPrice: 0, desc: "林地里采来的香草" },
  fern: { name: "林蕨", icon: "🌿", sellPrice: 18, buyPrice: 0, desc: "雾林深处的清香嫩蕨" },
  resin: { name: "松脂", icon: "🟠", sellPrice: 24, buyPrice: 0, desc: "修补和加工都用得上的树脂" },
  wildHoney: { name: "野蜂蜜", icon: "🍯", sellPrice: 58, buyPrice: 0, desc: "雾林蜂箱里的浓香蜂蜜" },
  fireflyJar: { name: "萤火瓶", icon: "✨", sellPrice: 64, buyPrice: 0, desc: "夜晚在雾林收集的微光样本" },
  relicShard: { name: "遗迹碎片", icon: "🔹", sellPrice: 92, buyPrice: 0, desc: "林中旧遗迹留下的蓝色碎片" },
  stone: { name: "石头", icon: "🪨", sellPrice: 5, buyPrice: 14, desc: "坚硬石材" },
  crystal: { name: "晶石", icon: "💎", sellPrice: 46, buyPrice: 0, desc: "高地闪亮矿晶" },
  mushroom: { name: "蘑菇", icon: "🍄", sellPrice: 14, buyPrice: 0, desc: "林地采集物" },
  shell: { name: "贝壳", icon: "🐚", sellPrice: 12, buyPrice: 0, desc: "海滩采集物" },
  coral: { name: "珊瑚", icon: "🪸", sellPrice: 34, buyPrice: 0, desc: "月湾的稀有拾取物" },
  ore: { name: "矿石", icon: "⛏️", sellPrice: 22, buyPrice: 0, desc: "高地矿脉产物" },
  ingot: { name: "金属锭", icon: "🔩", sellPrice: 84, buyPrice: 0, desc: "加工矿石后的建设材料" },
  turnip: { name: "萝卜", icon: "🥕", sellPrice: 18, buyPrice: 0, desc: "短周期作物" },
  potato: { name: "土豆", icon: "🥔", sellPrice: 30, buyPrice: 0, desc: "中期作物" },
  blueberry: { name: "蓝莓", icon: "🫐", sellPrice: 48, buyPrice: 0, desc: "高价值作物" },
  corn: { name: "玉米", icon: "🌽", sellPrice: 68, buyPrice: 0, desc: "高产耐种作物" },
  pumpkin: { name: "南瓜", icon: "🎃", sellPrice: 82, buyPrice: 0, desc: "后期高收益" },
  melon: { name: "甜瓜", icon: "🍈", sellPrice: 110, buyPrice: 0, desc: "高阶高价作物" },
  rice: { name: "水稻", icon: "🌾", sellPrice: 38, buyPrice: 0, desc: "夏潮季长势更好" },
  strawberry: { name: "草莓", icon: "🍓", sellPrice: 56, buyPrice: 0, desc: "春芽季人气作物" },
  grape: { name: "葡萄", icon: "🍇", sellPrice: 72, buyPrice: 0, desc: "适合加工果酱" },
  teaLeaf: { name: "茶叶", icon: "🍵", sellPrice: 44, buyPrice: 0, desc: "香气很稳的作物" },
  hay: { name: "干草", icon: "🌾", sellPrice: 3, buyPrice: 8, desc: "喂养动物的基础饲料" },
  egg: { name: "鸡蛋", icon: "🥚", sellPrice: 28, buyPrice: 0, desc: "小鸡成熟后产出" },
  largeEgg: { name: "大鸡蛋", icon: "🥚", sellPrice: 48, buyPrice: 0, desc: "高亲密动物的优质产物" },
  milk: { name: "牛奶", icon: "🥛", sellPrice: 44, buyPrice: 0, desc: "奶牛成熟后产出" },
  largeMilk: { name: "大瓶牛奶", icon: "🥛", sellPrice: 76, buyPrice: 0, desc: "亲密奶牛的优质产物" },
  wool: { name: "羊毛", icon: "🧶", sellPrice: 64, buyPrice: 0, desc: "绵羊成熟后产出" },
  fineWool: { name: "细软羊毛", icon: "🧶", sellPrice: 108, buyPrice: 0, desc: "稀有优质羊毛" },
  mayonnaise: { name: "蛋黄酱", icon: "🥣", sellPrice: 74, buyPrice: 0, desc: "加工坊产物" },
  cheese: { name: "奶酪", icon: "🧀", sellPrice: 96, buyPrice: 0, desc: "加工坊产物" },
  jam: { name: "果酱", icon: "🍯", sellPrice: 88, buyPrice: 0, desc: "加工坊产物" },
  cloth: { name: "布料", icon: "🧵", sellPrice: 132, buyPrice: 0, desc: "高级建设材料" },
  honey: { name: "蜂蜜", icon: "🍯", sellPrice: 86, buyPrice: 0, desc: "可料理也可出售" },
  forestWax: { name: "林脂蜡", icon: "🕯️", sellPrice: 118, buyPrice: 0, desc: "松脂和蜂蜜加工成的高级手作品" },
  seed_turnip: { name: "萝卜种子", icon: "🌱", sellPrice: 2, buyPrice: 14, desc: "2天成熟" },
  seed_potato: { name: "土豆种子", icon: "🌾", sellPrice: 3, buyPrice: 24, desc: "3天成熟" },
  seed_blueberry: { name: "蓝莓种子", icon: "🫐", sellPrice: 4, buyPrice: 34, desc: "4天成熟" },
  seed_corn: { name: "玉米种子", icon: "🌽", sellPrice: 6, buyPrice: 44, desc: "4天成熟，产量稳定" },
  seed_pumpkin: { name: "南瓜种子", icon: "🎃", sellPrice: 5, buyPrice: 52, desc: "5天成熟" },
  seed_melon: { name: "甜瓜种子", icon: "🍈", sellPrice: 8, buyPrice: 72, desc: "6天成熟，高阶作物" },
  seed_rice: { name: "水稻种子", icon: "🌾", sellPrice: 4, buyPrice: 28, desc: "3天成熟，夏季更好" },
  seed_strawberry: { name: "草莓种子", icon: "🍓", sellPrice: 5, buyPrice: 38, desc: "4天成熟，春季热卖" },
  seed_grape: { name: "葡萄种子", icon: "🍇", sellPrice: 6, buyPrice: 48, desc: "5天成熟，适合加工" },
  seed_tea: { name: "茶叶种子", icon: "🍵", sellPrice: 6, buyPrice: 42, desc: "4天成熟，稳定作物" },
};

const CROPS = {
  turnip: { name: "萝卜", seed: "seed_turnip", harvest: "turnip", growDays: 2, stages: 3, yield: [1, 2], unlock: 1, waterNeed: 2 },
  potato: { name: "土豆", seed: "seed_potato", harvest: "potato", growDays: 3, stages: 4, yield: [1, 2], unlock: 1, waterNeed: 3 },
  blueberry: { name: "蓝莓", seed: "seed_blueberry", harvest: "blueberry", growDays: 4, stages: 4, yield: [2, 3], unlock: 2, waterNeed: 4 },
  corn: { name: "玉米", seed: "seed_corn", harvest: "corn", growDays: 4, stages: 4, yield: [2, 4], unlock: 3, waterNeed: 4 },
  pumpkin: { name: "南瓜", seed: "seed_pumpkin", harvest: "pumpkin", growDays: 5, stages: 5, yield: [1, 2], unlock: 3, waterNeed: 5 },
  melon: { name: "甜瓜", seed: "seed_melon", harvest: "melon", growDays: 6, stages: 5, yield: [1, 2], unlock: 4, waterNeed: 5 },
  rice: { name: "水稻", seed: "seed_rice", harvest: "rice", growDays: 3, stages: 4, yield: [2, 3], unlock: 2, waterNeed: 3 },
  strawberry: { name: "草莓", seed: "seed_strawberry", harvest: "strawberry", growDays: 4, stages: 4, yield: [2, 3], unlock: 3, waterNeed: 4 },
  grape: { name: "葡萄", seed: "seed_grape", harvest: "grape", growDays: 5, stages: 5, yield: [2, 4], unlock: 4, waterNeed: 5 },
  tea: { name: "茶叶", seed: "seed_tea", harvest: "teaLeaf", growDays: 4, stages: 4, yield: [2, 3], unlock: 3, waterNeed: 4 },
};

const NPCS = [
  { id: "npc-lingling", name: "小玲", mapId: "town", baseX: 450, baseY: 300, color: "#e888aa", hatColor: "#ff6688", likes: ["flower", "blueberry", "melon"] },
  { id: "npc-chen", name: "老陈", mapId: "town", baseX: 870, baseY: 280, color: "#8855aa", hatColor: "#aa44cc", likes: ["potato", "wood", "corn", "crystal"] },
  { id: "npc-maomao", name: "毛毛", mapId: "town", baseX: 300, baseY: 620, color: "#f0c040", hatColor: "#e0a020", likes: ["fish", "nightFish", "goldKoi", "coral"] },
  { id: "npc-zhuang", name: "阿壮", mapId: "town", baseX: 700, baseY: 650, color: "#55aa55", hatColor: "#339933", likes: ["pumpkin", "mushroom", "melon", "herb"] },
  { id: "npc-ye", name: "阿叶", mapId: "forest", baseX: 396, baseY: 316, color: "#78b665", hatColor: "#3d7d3a", likes: ["herb", "mushroom", "flower"] },
  { id: "npc-lan", name: "小岚", mapId: "harbor", baseX: 964, baseY: 360, color: "#73c6ec", hatColor: "#357ba1", likes: ["fish", "silverFish", "coral"] },
  { id: "npc-mei", name: "梅姨", mapId: "town", baseX: 540, baseY: 560, color: "#bc7a68", hatColor: "#8f5147", likes: ["teaLeaf", "jam", "honey", "flower"] },
  { id: "npc-su", name: "苏木", mapId: "town", baseX: 1020, baseY: 690, color: "#6f91a7", hatColor: "#475d6f", likes: ["egg", "milk", "cheese", "cloth"] },
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
    this.actionAnimation = null;
    this.footstepTimer = 0;

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
    this.collections = { items: {} };
    Object.keys(this.inventory).forEach((key) => { this.collections.items[key] = true; });
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
      ranchLevel: 0,
      workshopLevel: 0,
      toolLevel: 1,
      rodLevel: 1,
      irrigationLevel: 0,
      animalsRaised: 0,
      artisanMade: 0,
      shippingCount: 0,
      shippingValue: 0,
      projectsCompleted: 0,
      completedProjects: [],
      festivalVisits: 0,
      areaTasksCompleted: 0,
      forestRenown: 0,
      harborRenown: 0,
      highlandRenown: 0,
      forestRelics: 0,
      forestShrineBlessings: 0,
      forestShrineDay: 0,
      forestSpringDay: 0,
    };

    this.relationship = {};
    this.dailyActions = { talked: {}, gifted: {} };
    this.skills = this.createSkills();
    this.dayStats = this.createDayStats();
    this.ranch = this.createRanch();

    this.worlds = this.createWorlds();
    this.currentMapId = "town";
    this.tileMap = this.worlds[this.currentMapId].tileMap;
    this.interactables = this.worlds[this.currentMapId].interactables;
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
    this.areaTasks = this.createAreaTasks();
    this.particles = [];
    this.houseSelection = 0;
    this.journalTab = 0;

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

  createWorlds() {
    return {
      town: {
        ...WORLD_INFO.town,
        tileMap: this.createTileMap(),
        interactables: this.createInteractables(),
      },
      forest: {
        ...WORLD_INFO.forest,
        tileMap: this.createForestTileMap(),
        interactables: this.createForestInteractables(),
      },
      harbor: {
        ...WORLD_INFO.harbor,
        tileMap: this.createHarborTileMap(),
        interactables: this.createHarborInteractables(),
      },
      highlands: {
        ...WORLD_INFO.highlands,
        tileMap: this.createHighlandsTileMap(),
        interactables: this.createHighlandsInteractables(),
      },
    };
  }

  createBlankMap(fill = TILE.GRASS) {
    return Array.from({ length: MAP_H }, () => Array(MAP_W).fill(fill));
  }

  paintRect(map, x1, y1, x2, y2, tile) {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        if (map[y]?.[x] !== undefined) map[y][x] = tile;
      }
    }
  }

  createForestTileMap() {
    const map = this.createBlankMap(TILE.DARK_GRASS);
    this.paintRect(map, 0, 10, 29, 14, TILE.PATH);
    this.paintRect(map, 0, 0, 4, 25, TILE.GRASS);
    this.paintRect(map, 0, 4, 2, 17, TILE.PATH);
    this.paintRect(map, 9, 7, 14, 11, TILE.WATER);
    this.paintRect(map, 18, 1, 24, 5, TILE.GRASS);
    this.paintRect(map, 18, 0, 20, 2, TILE.PATH);
    this.paintRect(map, 20, 13, 29, 20, TILE.GRASS);
    this.paintRect(map, 24, 10, 29, 14, TILE.PATH);
    this.paintRect(map, 23, 14, 27, 18, TILE.PATH);
    this.paintRect(map, 5, 18, 12, 24, TILE.GRASS);
    this.paintRect(map, 5, 4, 8, 7, TILE.FLOWER);
    this.paintRect(map, 15, 15, 18, 18, TILE.FLOWER);
    this.paintRect(map, 6, 20, 9, 22, TILE.FLOWER);
    this.paintRect(map, 13, 19, 16, 22, TILE.PATH);
    this.paintRect(map, 3, 15, 7, 17, TILE.PATH);
    this.paintRect(map, 21, 6, 24, 9, TILE.DARK_GRASS);
    return map;
  }

  createHarborTileMap() {
    const map = this.createBlankMap(TILE.SAND);
    this.paintRect(map, 0, 0, 29, 8, TILE.GRASS);
    this.paintRect(map, 0, 9, 29, 11, TILE.PATH);
    this.paintRect(map, 18, 0, 29, 25, TILE.WATER);
    this.paintRect(map, 14, 8, 18, 25, TILE.WOOD_FLOOR);
    this.paintRect(map, 8, 11, 13, 18, TILE.GRASS);
    this.paintRect(map, 1, 8, 4, 14, TILE.PATH);
    this.paintRect(map, 0, 12, 6, 25, TILE.SAND);
    return map;
  }

  createHighlandsTileMap() {
    const map = this.createBlankMap(TILE.DARK_GRASS);
    this.paintRect(map, 0, 11, 29, 14, TILE.PATH);
    this.paintRect(map, 0, 0, 5, 25, TILE.GRASS);
    this.paintRect(map, 7, 2, 13, 7, TILE.SAND);
    this.paintRect(map, 17, 3, 22, 8, TILE.WATER);
    this.paintRect(map, 17, 15, 28, 23, TILE.SAND);
    this.paintRect(map, 23, 10, 29, 14, TILE.PATH);
    this.paintRect(map, 1, 10, 3, 14, TILE.PATH);
    this.paintRect(map, 9, 17, 15, 23, TILE.GRASS);
    return map;
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
      { id:"project-1",type:"project",x:590,y:472,w:84,h:72,name:"镇务工程板" },
      { id:"shipping-1",type:"shipping",x:428,y:668,w:62,h:54,name:"出货箱" },
      { id:"ranch-1",type:"ranch",x:468,y:760,w:142,h:96,name:"牧场棚" },
      { id:"bridge-1",type:"bridge",x:1018,y:520,w:110,h:54,name:"旧桥" },
      { id:"warp-town-forest",type:"warp",x:18,y:550,w:56,h:84,name:"林间小径",label:"去雾林",targetMap:"forest",targetX:1290,targetY:610 },
      { id:"warp-town-harbor",type:"warp",x:136,y:438,w:84,h:48,name:"通往月湾",label:"去月湾",targetMap:"harbor",targetX:178,targetY:590 },
      { id:"warp-town-highlands",type:"warp",x:1296,y:232,w:52,h:88,name:"高地坡道",label:"去高地",targetMap:"highlands",targetX:170,targetY:610,requiresBridge:true,requiresTownRank:3,lockReason:"修桥后并把镇级提升到 3 才能前往高地。" },
    ];
  }

  createForestInteractables() {
    return [
      { id:"warp-forest-town",type:"warp",x:1304,y:560,w:56,h:88,name:"返回镇子",label:"回晨露镇",targetMap:"town",targetX:126,targetY:590 },
      { id:"warp-forest-highlands",type:"warp",x:930,y:44,w:72,h:50,name:"山间栈道",label:"上高地",targetMap:"highlands",targetX:1030,targetY:790,requiresTownRank:3,lockReason:"再多积累些名望，山道才会开放。" },
      { id:"forest-board",type:"trailboard",x:1222,y:612,w:46,h:58,name:"雾林林务站",areaId:"forest" },
      { id:"forest-shrine",type:"shrine",x:690,y:342,w:54,h:64,name:"苔石祭台" },
      { id:"forest-spring",type:"spring",x:606,y:442,w:58,h:42,name:"林间泉眼" },
      { id:"forest-ruin-1",type:"ruin",x:760,y:520,w:74,h:54,item:"relicShard",amount:1,collected:false,regrowTimer:0,regrowTime:160000,name:"苔痕遗迹" },
      { id:"forest-logjam",type:"logjam",x:248,y:646,w:86,h:38,item:"wood",amount:4,collected:false,regrowTimer:0,regrowTime:0,name:"倒伏木障" },
      { id:"forest-bee-1",type:"beehive",x:706,y:188,w:36,h:42,item:"wildHoney",amount:1,collected:false,regrowTimer:0,regrowTime:96000,name:"野蜂箱",extraItem:"honey" },
      { id:"forest-resin-1",type:"resinTap",x:302,y:240,w:36,h:46,item:"resin",amount:1,collected:false,regrowTimer:0,regrowTime:84000,name:"松脂采集罐" },
      { id:"forest-fern-1",type:"wildPatch",x:292,y:744,w:42,h:38,item:"fern",amount:2,collected:false,regrowTimer:0,regrowTime:62000,name:"林蕨丛",extraItem:"herb" },
      { id:"forest-fern-2",type:"wildPatch",x:946,y:704,w:42,h:38,item:"fern",amount:2,collected:false,regrowTimer:0,regrowTime:62000,name:"湿地林蕨" },
      { id:"forest-firefly-1",type:"firefly",x:528,y:520,w:44,h:44,item:"fireflyJar",amount:1,collected:false,regrowTimer:0,regrowTime:120000,name:"萤火群" },
      { id:"forest-tree-1",type:"tree",x:214,y:150,w:64,h:78,item:"wood",amount:2,collected:false,regrowTimer:0,regrowTime:58000,name:"老杉树" },
      { id:"forest-tree-2",type:"tree",x:586,y:182,w:64,h:78,item:"wood",amount:2,collected:false,regrowTimer:0,regrowTime:64000,name:"浓荫树" },
      { id:"forest-tree-3",type:"tree",x:1018,y:290,w:64,h:78,item:"wood",amount:2,collected:false,regrowTimer:0,regrowTime:62000,name:"苔木" },
      { id:"forest-mush-1",type:"mushroom",x:474,y:690,w:36,h:36,item:"mushroom",amount:2,collected:false,regrowTimer:0,regrowTime:88000,name:"林地蘑菇" },
      { id:"forest-mush-2",type:"mushroom",x:822,y:864,w:36,h:36,item:"mushroom",amount:2,collected:false,regrowTimer:0,regrowTime:92000,name:"厚伞菇" },
      { id:"forest-herb-1",type:"herb",x:356,y:806,w:34,h:34,item:"herb",amount:1,collected:false,regrowTimer:0,regrowTime:76000,name:"清香草" },
      { id:"forest-herb-2",type:"herb",x:1080,y:730,w:34,h:34,item:"herb",amount:1,collected:false,regrowTimer:0,regrowTime:76000,name:"山风草" },
      { id:"forest-flower-1",type:"flower",x:640,y:568,w:32,h:32,item:"flower",amount:2,collected:false,regrowTimer:0,regrowTime:52000,name:"林间花簇" },
      { id:"forest-fish-1",type:"fishspot",x:564,y:400,w:40,h:40,item:null,amount:0,collected:false,regrowTimer:0,regrowTime:0,name:"林间池塘" },
      { id:"forest-stone-1",type:"stone",x:1040,y:930,w:58,h:44,item:"stone",amount:2,collected:false,regrowTimer:0,regrowTime:110000,name:"山脚岩石" },
    ];
  }

  createHarborInteractables() {
    return [
      { id:"warp-harbor-town",type:"warp",x:74,y:530,w:64,h:96,name:"返镇栈桥",label:"回晨露镇",targetMap:"town",targetX:236,targetY:520 },
      { id:"harbor-board",type:"trailboard",x:230,y:516,w:46,h:58,name:"月湾告示牌",areaId:"harbor" },
      { id:"harbor-fish-1",type:"fishspot",x:1102,y:226,w:44,h:44,item:null,amount:0,collected:false,regrowTimer:0,regrowTime:0,name:"港湾深水" },
      { id:"harbor-fish-2",type:"fishspot",x:1020,y:596,w:44,h:44,item:null,amount:0,collected:false,regrowTimer:0,regrowTime:0,name:"潮汐鱼群" },
      { id:"harbor-shell-1",type:"shell",x:324,y:836,w:28,h:20,item:"shell",amount:2,collected:false,regrowTimer:0,regrowTime:50000,name:"浅滩贝壳" },
      { id:"harbor-shell-2",type:"shell",x:512,y:1028,w:28,h:20,item:"shell",amount:2,collected:false,regrowTimer:0,regrowTime:50000,name:"海沫贝壳" },
      { id:"harbor-coral-1",type:"coral",x:658,y:972,w:38,h:32,item:"coral",amount:1,collected:false,regrowTimer:0,regrowTime:93000,name:"赤珊瑚" },
      { id:"harbor-coral-2",type:"coral",x:874,y:884,w:38,h:32,item:"coral",amount:1,collected:false,regrowTimer:0,regrowTime:93000,name:"蓝珊瑚" },
      { id:"harbor-bush-1",type:"bush",x:402,y:314,w:58,h:42,item:"fruit",amount:2,collected:false,regrowTimer:0,regrowTime:70000,name:"湾边果丛" },
      { id:"harbor-stone-1",type:"stone",x:612,y:280,w:58,h:44,item:"stone",amount:2,collected:false,regrowTimer:0,regrowTime:110000,name:"潮石" },
    ];
  }

  createHighlandsInteractables() {
    return [
      { id:"warp-highlands-town",type:"warp",x:36,y:514,w:64,h:98,name:"下山坡道",label:"回晨露镇",targetMap:"town",targetX:1220,targetY:284 },
      { id:"warp-highlands-forest",type:"warp",x:1144,y:590,w:78,h:54,name:"穿林山道",label:"去雾林",targetMap:"forest",targetX:934,targetY:112 },
      { id:"highlands-board",type:"trailboard",x:156,y:524,w:46,h:58,name:"高地勘探牌",areaId:"highlands" },
      { id:"high-tree-1",type:"tree",x:218,y:194,w:64,h:78,item:"wood",amount:2,collected:false,regrowTimer:0,regrowTime:62000,name:"山松" },
      { id:"high-tree-2",type:"tree",x:462,y:808,w:64,h:78,item:"wood",amount:2,collected:false,regrowTimer:0,regrowTime:62000,name:"岬角树" },
      { id:"high-crystal-1",type:"crystal",x:580,y:200,w:42,h:42,item:"crystal",amount:1,collected:false,regrowTimer:0,regrowTime:120000,name:"风晶簇" },
      { id:"high-crystal-2",type:"crystal",x:1170,y:892,w:42,h:42,item:"crystal",amount:1,collected:false,regrowTimer:0,regrowTime:120000,name:"崖晶石" },
      { id:"high-ore-1",type:"ore",x:698,y:276,w:52,h:42,item:"ore",amount:2,collected:false,regrowTimer:0,regrowTime:125000,name:"铁色矿脉" },
      { id:"high-ore-2",type:"ore",x:1016,y:834,w:52,h:42,item:"ore",amount:2,collected:false,regrowTimer:0,regrowTime:125000,name:"裂岩矿脉" },
      { id:"high-herb-1",type:"herb",x:378,y:986,w:34,h:34,item:"herb",amount:2,collected:false,regrowTimer:0,regrowTime:76000,name:"高地香草" },
      { id:"high-herb-2",type:"herb",x:1076,y:334,w:34,h:34,item:"herb",amount:2,collected:false,regrowTimer:0,regrowTime:76000,name:"清冽香草" },
      { id:"high-stone-1",type:"stone",x:914,y:962,w:58,h:44,item:"stone",amount:2,collected:false,regrowTimer:0,regrowTime:120000,name:"高地岩石" },
      { id:"high-fish-1",type:"fishspot",x:916,y:220,w:40,h:40,item:null,amount:0,collected:false,regrowTimer:0,regrowTime:0,name:"山顶清潭" },
    ];
  }

  createNpcs() {
    return NPCS.map((n) => {
      this.relationship[n.id] = 0;
      return { ...n, size: 26, x: n.baseX, y: n.baseY, moveTimer: 0, vx: 0, vy: 0 };
    });
  }

  createRanch() {
    return { animals: [] };
  }

  getCurrentWorld() {
    return this.worlds[this.currentMapId];
  }

  getCurrentMapName() {
    return this.getCurrentWorld()?.name || "未知区域";
  }

  getAllInteractables() {
    return Object.values(this.worlds).flatMap((world) => world.interactables);
  }

  switchMap(mapId, x, y, message) {
    const world = this.worlds[mapId];
    if (!world) return;
    this.currentMapId = mapId;
    this.tileMap = world.tileMap;
    this.interactables = world.interactables;
    if (typeof x === "number") this.player.x = x;
    if (typeof y === "number") this.player.y = y;
    this.camera.x = Math.max(0, Math.min(MAP_W * TILE_SIZE - this.canvas.width, this.player.x - this.canvas.width / 2));
    this.camera.y = Math.max(0, Math.min(MAP_H * TILE_SIZE - this.canvas.height, this.player.y - this.canvas.height / 2));
    if (message !== null) this.showMessage(message || `来到 ${world.name}`, 2200);
  }

  getInteractableBlockReason(obj) {
    if (obj.eastOnly && !this.progress.eastUnlocked) return "东区还没有开放。";
    if (obj.requiresBridge && !this.progress.bridgeRepaired) return obj.lockReason || "需要先修好旧桥。";
    if (obj.requiresTownRank && this.progress.townRank < obj.requiresTownRank) return obj.lockReason || `镇级达到 ${obj.requiresTownRank} 才能前往。`;
    return "";
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
      { id: "ranch-start", title: "清晨牧歌", desc: "建成牧场并养下第一只动物", done: false, check: () => this.progress.animalsRaised >= 1, reward: { item: "hay", amount: 12 } },
      { id: "artisan", title: "手作工坊", desc: "制作 5 件加工品", done: false, check: () => this.progress.artisanMade >= 5, reward: { gold: 260 } },
      { id: "high-rank", title: "山海之间", desc: "镇级达到 5", done: false, check: () => this.progress.townRank >= 5, reward: { item: "seed_grape", amount: 5 } },
      { id: "shipping", title: "出货达人", desc: "通过出货箱累计收入 1200 金", done: false, check: () => this.progress.shippingValue >= 1200, reward: { gold: 220 } },
      { id: "projects", title: "小镇工程师", desc: "完成 3 个镇务工程", done: false, check: () => this.progress.projectsCompleted >= 3, reward: { item: "ingot", amount: 2 } },
      { id: "tools", title: "好工具省力气", desc: "将工具组升级到 3 级", done: false, check: () => this.progress.toolLevel >= 3, reward: { gold: 260 } },
      { id: "forest-ranger", title: "雾林巡护员", desc: "完成 3 个区域委托", done: false, check: () => this.progress.areaTasksCompleted >= 3, reward: { item: "wildHoney", amount: 2 } },
      { id: "forest-ruins", title: "苔痕秘藏", desc: "在雾林遗迹找到 3 块遗迹碎片", done: false, check: () => this.progress.forestRelics >= 3, reward: { gold: 340 } },
    ];
  }

  createSkills() {
    return Object.fromEntries(Object.keys(SKILL_INFO).map((key) => [key, { level: 1, xp: 0 }]));
  }

  createDayStats() {
    return { harvested: 0, foraged: 0, fishCaught: 0, requests: 0, cooked: 0, animalProducts: 0, artisan: 0, shipped: 0, shippedValue: 0 };
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

  createAreaTasks() {
    return Object.fromEntries(Object.entries(AREA_TASK_TEMPLATES).map(([areaId, templates]) => {
      const available = templates.filter((task) => task.minRank <= this.progress.townRank + 1);
      const pool = available.length ? available : templates;
      const index = Math.floor(Math.random() * pool.length);
      return [areaId, { ...pool[index], done: false }];
    }));
  }

  getAreaTask(areaId = this.currentMapId) {
    return this.areaTasks?.[areaId] || null;
  }

  getAreaRenownKey(areaId) {
    if (areaId === "forest") return "forestRenown";
    if (areaId === "harbor") return "harborRenown";
    if (areaId === "highlands") return "highlandRenown";
    return "";
  }

  canCompleteAreaTask(task) {
    return !!task && !task.done && Object.entries(task.requirements || {}).every(([key, amount]) => (this.inventory[key] || 0) >= amount);
  }

  formatAreaTaskProgress(task) {
    if (!task) return "";
    return Object.entries(task.requirements || {})
      .map(([key, amount]) => `${ITEMS[key]?.name || key}${this.inventory[key] || 0}/${amount}`)
      .join(" / ");
  }

  tryCompleteAreaTask(areaId = this.currentMapId) {
    const task = this.getAreaTask(areaId);
    if (!task) {
      this.showMessage("这里今天没有区域委托。", 1600);
      return false;
    }
    if (task.done) {
      this.showMessage(`${task.title} 今天已经完成了，明天会刷新新的委托。`, 2200);
      return true;
    }
    if (!this.canCompleteAreaTask(task)) {
      this.showMessage(`${task.title}：${task.desc} 需要 ${this.formatAreaTaskProgress(task)}`, 4200);
      return false;
    }

    Object.entries(task.requirements || {}).forEach(([key, amount]) => this.removeItem(key, amount));
    if (task.gold) {
      this.gold += task.gold;
      this.progress.totalEarned += task.gold;
    }
    if (task.reward?.item) this.addItem(task.reward.item, task.reward.amount || 1);
    if (task.favor) this.relationship[task.favor] = Math.min(100, (this.relationship[task.favor] || 0) + (task.favorGain || 4));
    Object.entries(task.xp || {}).forEach(([skill, amount]) => this.gainSkillXp(skill, amount));
    const renownKey = this.getAreaRenownKey(areaId);
    if (renownKey) this.progress[renownKey] = (this.progress[renownKey] || 0) + 1;
    this.progress.areaTasksCompleted = (this.progress.areaTasksCompleted || 0) + 1;
    task.done = true;
    this.startAction("deliver", { duration: 640 });
    const rewardText = task.reward?.item ? `，获得 ${ITEMS[task.reward.item].name}x${task.reward.amount || 1}` : "";
    this.showMessage(`完成区域委托：${task.title}，获得 ${task.gold || 0} 金${rewardText}`, 3200);
    return true;
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
      collections: this.collections,
      gameDay: this.gameDay,
      gameMinutes: this.gameMinutes,
      currentMapId: this.currentMapId,
      weather: this.weather,
      tomorrowWeather: this.tomorrowWeather,
      currentBuff: this.currentBuff,
      player: { x: this.player.x, y: this.player.y },
      interactables: this.getAllInteractables().map(o => ({ id: o.id, collected: o.collected, regrowTimer: o.regrowTimer || 0 })),
      farmPlots: this.farmPlots,
      progress: this.progress,
      relationship: this.relationship,
      skills: this.skills,
      dailyRequests: this.dailyRequests,
      areaTasks: this.areaTasks,
      ranch: this.ranch,
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
      this.collections = { items: {}, ...(data.collections || {}) };
      if (!this.collections.items) this.collections.items = {};
      this.gameDay = data.gameDay ?? this.gameDay;
      this.gameMinutes = data.gameMinutes ?? this.gameMinutes;
      this.currentMapId = data.currentMapId || this.currentMapId;
      this.weather = data.weather || this.weather;
      this.tomorrowWeather = data.tomorrowWeather || this.tomorrowWeather;
      this.currentBuff = data.currentBuff && data.currentBuff.day === this.gameDay ? data.currentBuff : null;
      if (data.player) Object.assign(this.player, data.player);
      if (data.interactables) {
        data.interactables.forEach((saved) => {
          const obj = this.getAllInteractables().find(o => o.id === saved.id);
          if (obj) {
            obj.collected = saved.collected;
            obj.regrowTimer = saved.regrowTimer || 0;
          }
        });
      }
      if (data.farmPlots?.length) this.farmPlots = data.farmPlots;
      if (data.progress) this.progress = { ...this.progress, ...data.progress };
      if (!Array.isArray(this.progress.completedProjects)) this.progress.completedProjects = [];
      if (data.relationship) this.relationship = { ...this.relationship, ...data.relationship };
      if (data.skills) {
        this.skills = Object.fromEntries(Object.keys(SKILL_INFO).map((key) => [
          key,
          { ...this.skills[key], ...data.skills[key] },
        ]));
      }
      if (Array.isArray(data.dailyRequests) && data.dailyRequests.length) this.dailyRequests = data.dailyRequests;
      if (data.areaTasks) this.areaTasks = { ...this.areaTasks, ...data.areaTasks };
      if (data.ranch?.animals) this.ranch = { ...this.createRanch(), ...data.ranch };
      Object.keys(this.inventory).forEach((key) => { if ((this.inventory[key] || 0) > 0) this.collections.items[key] = true; });
      this.applyProgressDerivedStats();
      if (!this.dailyRequests?.length) this.dailyRequests = this.createDailyRequests();
      if (!this.areaTasks) this.areaTasks = this.createAreaTasks();
      this.switchMap(this.currentMapId, this.player.x, this.player.y, null);
    } catch (e) {}
  }

  bindEvents() {
    window.addEventListener("keydown", (e) => {
      if (typeof document !== "undefined" && document.body?.classList.contains("help-open")) return;
      const key = e.key.toLowerCase();
      if (["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d","e","escape","enter"," ","i","j","tab","q","g","r","f5"].includes(key)) e.preventDefault();
      this.keys.add(key);

      if (key === "enter" && this.scene === SCENE.TITLE) {
        this.scene = SCENE.PLAYING;
        this.showMessage("每日目标：照看农田，积累木石与金币，尽快建牧场和加工坊。", 3600);
        return;
      }

      if (this.scene === SCENE.PLAYING) {
        if (key === "e") this.tryInteract();
        if (key === "i") this.scene = SCENE.INVENTORY;
        if (key === "j") this.scene = SCENE.JOURNAL;
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
      } else if (this.scene === SCENE.JOURNAL) {
        this.handleJournalInput(key);
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
    this.updateActionAnimation(dt);
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
    const summary = `昨日 收${this.dayStats.harvested} / 采${this.dayStats.foraged} / 钓${this.dayStats.fishCaught} / 出货${this.dayStats.shippedValue}金 / 委${this.dayStats.requests}`;
    this.dailyActions = { talked: {}, gifted: {} };
    this.currentBuff = null;
    this.dayStats = this.createDayStats();
    this.weather = this.tomorrowWeather || this.rollWeather(this.gameDay);
    this.tomorrowWeather = this.rollWeather(this.gameDay + 1);
    this.dailyRequests = this.createDailyRequests();
    this.areaTasks = this.createAreaTasks();
    let irrigated = 0;
    this.farmPlots.forEach((p) => {
      p.watered = false;
      if (this.getWeatherConfig().autoWater && p.cropKey) {
        p.watered = true;
        p.wateredDays += 1;
      }
    });
    if (!this.getWeatherConfig().autoWater && this.progress.irrigationLevel > 0) {
      const quota = this.progress.irrigationLevel * 8;
      this.farmPlots.forEach((p) => {
        if (irrigated >= quota || !p.cropKey || p.ready || p.watered) return;
        p.watered = true;
        p.wateredDays += 1;
        irrigated += 1;
      });
    }
    this.getAllInteractables().forEach((o) => {
      if (o.collected && o.regrowTime > 0) {
        o.collected = false;
        o.regrowTimer = 0;
      }
    });
    this.ranch.animals.forEach((animal) => {
      animal.age += 1;
      if (animal.fedDay !== this.gameDay - 1) animal.happy = Math.max(0, animal.happy - 3);
    });
    this.energy = rested ? this.maxEnergy : Math.max(44, Math.floor(this.maxEnergy * 0.72));
    const festival = this.getFestivalInfo();
    const dayTip = festival ? `今天是${festival.name}：${festival.desc}` : this.isMarketDay() ? "今天是集市日，出售收益更高。" : "公告牌委托已经刷新。";
    const restTip = rested ? "睡了个好觉，体力已回满。" : "忙到了天亮，体力没有完全恢复。";
    const irrigationTip = irrigated ? ` 水渠自动浇灌 ${irrigated} 块地。` : "";
    this.showMessage(`第 ${this.gameDay} 天｜${this.getSeasonInfo().name}${this.getSeasonDay()}日：${this.getWeatherConfig().icon}${this.getWeatherConfig().name}。${dayTip}${restTip}${irrigationTip} ${summary}`, 4600);
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
    const areaScore = (this.progress.areaTasksCompleted || 0) * 2 + (this.progress.forestRenown || 0) + (this.progress.harborRenown || 0) + (this.progress.highlandRenown || 0) + (this.progress.forestRelics || 0);
    const score = this.progress.harvestCount + this.progress.forageCount + Math.floor(this.progress.totalEarned / 250) + Math.floor(this.progress.shippingValue / 300) + relationScore + this.progress.houseLevel * 2 + this.progress.farmLevel * 3 + this.progress.ranchLevel * 3 + this.progress.workshopLevel * 4 + this.progress.irrigationLevel * 3 + this.progress.projectsCompleted * 4 + this.progress.animalsRaised * 1.8 + this.progress.artisanMade * 1.2 + this.progress.requestsCompleted * 2 + this.progress.mealsCooked + skillScore + areaScore + (this.progress.bridgeRepaired ? 4 : 0);
    this.progress.townRank = Math.max(1, Math.min(6, Math.floor(score / 8) + 1));
  }

  getWeatherConfig() {
    return WEATHER[this.weather] || WEATHER.sunny;
  }

  isMarketDay() {
    return this.gameDay % 5 === 0;
  }

  getSeasonIndex() {
    return Math.floor(((this.gameDay - 1) % 112) / 28);
  }

  getSeasonInfo() {
    return SEASONS[this.getSeasonIndex()] || SEASONS[0];
  }

  getSeasonDay() {
    return ((this.gameDay - 1) % 28) + 1;
  }

  getFestivalInfo() {
    const day = this.getSeasonDay();
    return FESTIVALS.find((event) => event.day === day) || null;
  }

  getMarketMultiplier(itemKey) {
    let multiplier = 1;
    const hour = this.gameMinutes / 60;
    const festival = this.getFestivalInfo();
    const season = this.getSeasonInfo();
    const cropKey = Object.keys(CROPS).find((key) => CROPS[key].harvest === itemKey);
    if (this.isMarketDay()) multiplier += 0.15;
    if ((itemKey === "fish" || itemKey === "nightFish" || itemKey === "silverFish" || itemKey === "goldKoi") && hour >= 18) multiplier += 0.18;
    if (cropKey && season.cropBonus.includes(cropKey)) multiplier += 0.12;
    if (festival?.name === "潮声夜市" && hour >= 18 && ITEMS[itemKey]?.sellPrice) multiplier += 0.12;
    if (festival?.name === "丰收评鉴" && (cropKey || ["mayonnaise", "cheese", "jam", "honey", "wildHoney", "forestWax"].includes(itemKey))) multiplier += 0.15;
    return multiplier;
  }

  getSellPrice(itemKey) {
    return Math.max(1, Math.floor((ITEMS[itemKey]?.sellPrice || 0) * this.getMarketMultiplier(itemKey)));
  }

  getRanchCapacity() {
    return this.progress.ranchLevel <= 0 ? 0 : 2 + this.progress.ranchLevel * 2;
  }

  getAnimalInfo(type) {
    return ANIMALS[type];
  }

  addAnimal(type) {
    const info = this.getAnimalInfo(type);
    if (!info || this.ranch.animals.length >= this.getRanchCapacity()) return false;
    const names = ["栗栗", "豆豆", "云朵", "阿米", "暖暖", "晴子", "小麦", "铃兰"];
    this.ranch.animals.push({
      id: `${type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      name: names[this.ranch.animals.length % names.length],
      age: 0,
      happy: 42,
      fedDay: 0,
      productDay: 0,
    });
    this.progress.animalsRaised += 1;
    return true;
  }

  getRanchSummary() {
    if (this.progress.ranchLevel <= 0) return "尚未建造牧场";
    const counts = Object.keys(ANIMALS).map((type) => {
      const count = this.ranch.animals.filter((animal) => animal.type === type).length;
      return count ? `${ANIMALS[type].name}x${count}` : "";
    }).filter(Boolean);
    return counts.length ? counts.join(" / ") : "牧场空着";
  }

  getCompletedProjectIds() {
    if (!Array.isArray(this.progress.completedProjects)) this.progress.completedProjects = [];
    return this.progress.completedProjects;
  }

  getOpenProjects() {
    const completed = new Set(this.getCompletedProjectIds());
    return PROJECTS.filter((project) => !completed.has(project.id));
  }

  canCompleteProject(project) {
    return Object.entries(project.requirements).every(([key, amount]) => (this.inventory[key] || 0) >= amount);
  }

  formatRequirements(requirements) {
    return Object.entries(requirements)
      .map(([key, amount]) => `${ITEMS[key]?.name || key}${this.inventory[key] || 0}/${amount}`)
      .join(" · ");
  }

  applyProjectReward(project) {
    const reward = project.reward || {};
    if (reward.gold) {
      this.gold += reward.gold;
      this.progress.totalEarned += reward.gold;
    }
    if (reward.item) this.addItem(reward.item, reward.amount || 1);
    if (reward.irrigationLevel) this.progress.irrigationLevel += reward.irrigationLevel;
    if (reward.toolLevel) this.progress.toolLevel = Math.min(5, this.progress.toolLevel + reward.toolLevel);
    if (reward.rodLevel) this.progress.rodLevel = Math.min(5, this.progress.rodLevel + reward.rodLevel);
    if (reward.workshopLevel) this.progress.workshopLevel = Math.max(this.progress.workshopLevel, reward.workshopLevel);
  }

  tryCompleteProject() {
    const ready = this.getOpenProjects().find((project) => this.canCompleteProject(project));
    if (!ready) return false;
    Object.entries(ready.requirements).forEach(([key, amount]) => this.removeItem(key, amount));
    this.getCompletedProjectIds().push(ready.id);
    this.progress.projectsCompleted += 1;
    this.applyProjectReward(ready);
    const levelUps = this.gainSkillXp("social", 8);
    this.showMessage(`小镇工程完成：${ready.name}。${ready.desc}${this.formatLevelUps(levelUps)}`, 3600);
    return true;
  }

  showProjectPreview() {
    const open = this.getOpenProjects();
    if (!open.length) {
      this.showMessage("镇务工程都完成了，晨露镇已经很像样了。", 2600);
      return;
    }
    const ready = open.find((project) => this.canCompleteProject(project));
    const project = ready || open[0];
    this.showMessage(`${ready ? "可提交" : "工程"}：${project.name}｜${this.formatRequirements(project.requirements)}`, 4200);
  }

  isShippableItem(key) {
    return !!ITEMS[key]?.sellPrice && !key.startsWith("seed_") && !NON_SHIPPABLE_ITEMS.has(key);
  }

  shipAllSellables() {
    const entries = Object.entries(this.inventory).filter(([key, count]) => count > 0 && this.isShippableItem(key));
    if (!entries.length) {
      this.showMessage("出货箱里没有适合出售的商品。木材、石头、干草和矿材会保留。", 2200);
      return;
    }
    let total = 0;
    let count = 0;
    entries.forEach(([key, amount]) => {
      const value = this.getSellPrice(key) * amount;
      total += value;
      count += amount;
      this.removeItem(key, amount);
    });
    this.gold += total;
    this.progress.totalEarned += total;
    this.progress.shippingCount += count;
    this.progress.shippingValue += total;
    this.dayStats.shipped += count;
    this.dayStats.shippedValue += total;
    const levelUps = this.gainSkillXp("crafting", Math.max(3, Math.floor(count / 2)));
    this.showMessage(`出货 ${count} 件商品，收入 ${total} 金。材料类已自动保留。${this.formatLevelUps(levelUps)}`, 3200);
  }

  careForRanch() {
    if (this.progress.ranchLevel <= 0) {
      this.showMessage("这里适合建牧场。去商店的投资页建造鸡舍吧。", 2200);
      return;
    }
    if (!this.ranch.animals.length) {
      this.showMessage("牧场已经建好，可以在商店投资页购买小鸡、奶牛或绵羊。", 2200);
      return;
    }
    if (!this.consumeEnergy(3, "体力不足，照料动物也需要休息。")) return;

    let fed = 0;
    let products = 0;
    const productTexts = [];
    this.ranch.animals.forEach((animal) => {
      const info = this.getAnimalInfo(animal.type);
      if (!info) return;
      if (animal.fedDay !== this.gameDay) {
        if ((this.inventory.hay || 0) > 0) {
          this.removeItem("hay", 1);
          animal.fedDay = this.gameDay;
          animal.happy = Math.min(100, animal.happy + 5);
          fed += 1;
        } else {
          animal.happy = Math.max(0, animal.happy - 4);
        }
      }
      const mature = animal.age >= info.matureDays;
      if (mature && animal.fedDay === this.gameDay && animal.productDay !== this.gameDay) {
        const rare = animal.happy >= 70 && Math.random() < 0.28 + (animal.happy - 70) / 180;
        const product = rare ? info.rareProduct : info.product;
        this.addItem(product, 1);
        animal.productDay = this.gameDay;
        animal.happy = Math.min(100, animal.happy + 2);
        products += 1;
        productTexts.push(ITEMS[product].name);
      }
    });

    this.progress.forageCount += products;
    this.dayStats.animalProducts += products;
    const levelUps = this.gainSkillXp("crafting", 2 + products * 3);
    const hayText = fed ? `喂食 ${fed} 只动物。` : "干草不足，没能全部喂食。";
    const productText = products ? `获得 ${productTexts.join("、")}。` : "成熟动物明天会继续产出。";
    this.spawnParticles(this.player.x, this.player.y - 12, "#d7b86d", 10);
    this.showMessage(`${hayText}${productText}${this.formatLevelUps(levelUps)}`, 2600);
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
    const winterBonus = this.getSeasonInfo().id === "winter" ? 0.04 : 0;
    return Math.min(0.85, 0.12 * (this.getSkillLevel("foraging") - 1) + this.getWeatherConfig().forageBonus + winterBonus + this.getBuffValue("foraging"));
  }

  getTalkBonus() {
    return 2 + Math.floor((this.getSkillLevel("social") - 1) / 2) + this.getBuffValue("social");
  }

  getGiftBonus(isFavorite) {
    const festival = this.getFestivalInfo();
    const festivalBonus = festival?.name === "花篱集" ? 2 : 0;
    return (isFavorite ? 8 : 3) + Math.floor((this.getSkillLevel("social") - 1) / 2) + festivalBonus;
  }

  getFishingProgressMultiplier() {
    return this.getWeatherConfig().fishingProgress + (this.getSkillLevel("fishing") - 1) * 0.06 + (this.progress.rodLevel - 1) * 0.08 + this.getBuffValue("fishing");
  }

  getRareFishChance() {
    const seasonBonus = this.getSeasonInfo().id === "winter" ? 0.03 : 0;
    return 0.06 + this.getWeatherConfig().rareFishBonus + seasonBonus + (this.progress.rodLevel - 1) * 0.018 + (this.getSkillLevel("fishing") - 1) * 0.03 + this.getBuffValue("fishing") * 0.35;
  }

  getCurrentMoveSpeed() {
    if (this.energy <= 15) return this.player.speed * 0.74;
    if (this.energy <= 35) return this.player.speed * 0.88;
    return this.player.speed;
  }

  consumeEnergy(cost, failText = "体力不足，先回小屋休息或做料理。") {
    const toolDiscount = 1 - Math.min(0.28, (this.progress.toolLevel - 1) * 0.07);
    const scaledCost = Math.max(1, Math.round(cost * this.getWeatherConfig().energyScale * toolDiscount));
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

  useForestShrine(obj) {
    if (this.progress.forestShrineDay === this.gameDay) {
      this.showMessage("苔石祭台今天已经回应过你了。明天再带供品来。", 2200);
      return;
    }
    const offering = ["wildHoney", "flower", "herb", "mushroom", "relicShard"].find((key) => (this.inventory[key] || 0) > 0);
    if (!offering) {
      this.showMessage("苔石祭台需要供品：野蜂蜜、花、香草、蘑菇或遗迹碎片。", 3200);
      return;
    }
    this.removeItem(offering, 1);
    this.progress.forestShrineDay = this.gameDay;
    this.progress.forestShrineBlessings = (this.progress.forestShrineBlessings || 0) + 1;
    this.currentBuff = { id: "forestBlessing", effect: "foraging", amount: 0.18 + Math.min(0.12, (this.progress.forestRenown || 0) * 0.01), label: "雾林祝福", day: this.gameDay };
    this.restoreEnergy(12);
    this.relationship["npc-ye"] = Math.min(100, (this.relationship["npc-ye"] || 0) + 2);
    const levelUps = this.gainSkillXp("foraging", 5);
    this.startAction("gift", { target: { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 }, item: offering, faceTarget: true, duration: 760 });
    this.spawnParticles(obj.x + obj.w / 2, obj.y + 8, "#b7e3a2", 14);
    this.showMessage(`献上 ${ITEMS[offering].name}，获得雾林祝福：今日采集更容易额外收获。${this.formatLevelUps(levelUps)}`, 3600);
  }

  drinkForestSpring(obj) {
    if (this.progress.forestSpringDay === this.gameDay) {
      this.showMessage("泉眼今天已经被取用过，水面正慢慢恢复清澈。", 2000);
      return;
    }
    this.progress.forestSpringDay = this.gameDay;
    const amount = 18 + Math.min(12, (this.progress.forestRenown || 0) * 2);
    this.restoreEnergy(amount);
    this.startAction("water", { target: { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 }, faceTarget: true, duration: 620 });
    this.spawnParticles(obj.x + obj.w / 2, obj.y + obj.h / 2, "#7cc7df", 14);
    this.showMessage(`喝下清泉，恢复 ${amount} 体力。`, 2200);
  }

  searchForestRuin(obj) {
    if (obj.collected) {
      const timeLeft = Math.ceil((obj.regrowTime - obj.regrowTimer) / 1000);
      this.showMessage(`遗迹已经翻找过了，${Math.max(0, timeLeft)} 秒后雾气会带来新的线索。`, 1800);
      return;
    }
    if (!this.consumeEnergy(4, "体力不足，翻找遗迹需要更专注一点。")) return;
    obj.collected = true;
    obj.regrowTimer = 0;
    const bonus = Math.random() < this.getForageBonusChance();
    const extra = bonus ? "crystal" : Math.random() < 0.45 ? "fern" : "stone";
    this.addItem("relicShard", 1);
    this.addItem(extra, 1);
    this.progress.forestRelics = (this.progress.forestRelics || 0) + 1;
    this.progress.forageCount += 2;
    this.dayStats.foraged += 2;
    const levelUps = this.gainSkillXp("foraging", bonus ? 11 : 8);
    this.startAction("forage", { target: { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 }, faceTarget: true, duration: 820 });
    this.spawnParticles(obj.x + obj.w / 2, obj.y + 12, "#9cc8ff", 12);
    this.showMessage(`在遗迹里找到 ${ITEMS.relicShard.name} 和 ${ITEMS[extra].name}。${this.formatLevelUps(levelUps)}`, 2600);
  }

  clearLogjam(obj) {
    if (obj.collected) {
      this.showMessage("倒伏木障已经清理，林道宽敞多了。", 1600);
      return;
    }
    if (!this.consumeEnergy(5, "体力不足，清理倒伏木需要斧头劲儿。")) return;
    obj.collected = true;
    const amount = obj.amount || 3;
    this.addItem("wood", amount);
    this.progress.forestRenown = (this.progress.forestRenown || 0) + 1;
    this.progress.forageCount += amount;
    this.dayStats.foraged += amount;
    const levelUps = this.gainSkillXp("foraging", 7);
    this.startAction("axe", { target: { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 }, faceTarget: true, duration: 760 });
    this.spawnParticles(obj.x + obj.w / 2, obj.y + obj.h / 2, "#c08a52", 12);
    this.showMessage(`清理木障，获得 木材x${amount}。雾林声望 +1${this.formatLevelUps(levelUps)}`, 2600);
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

  getWorkshopRecipes() {
    if (this.progress.workshopLevel <= 0) return [];
    return WORKSHOP_RECIPES.filter((recipe, index) => this.progress.workshopLevel >= 2 || index < 3);
  }

  getHouseActions() {
    return [
      { type: "rest", label: "休息到次日", desc: "恢复全部体力，并刷新天气与委托" },
      { type: "save", label: "整理日记", desc: "立即手动保存当前进度" },
      ...this.getRecipeList().map((recipe) => ({ type: "recipe", recipe, label: `做料理：${recipe.name}`, desc: recipe.desc })),
      ...this.getWorkshopRecipes().map((recipe) => ({ type: "artisan", recipe, label: `加工：${recipe.name}`, desc: recipe.desc })),
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

  handleJournalInput(key) {
    const tabCount = 5;
    if (key === "escape" || key === "j" || key === "i") {
      this.scene = SCENE.PLAYING;
      return;
    }
    if (key === "tab" || key === "arrowright" || key === "d") {
      this.journalTab = (this.journalTab + 1) % tabCount;
      return;
    }
    if (key === "arrowleft" || key === "a") {
      this.journalTab = (this.journalTab - 1 + tabCount) % tabCount;
    }
  }

  performHouseAction(action) {
    if (!action) return;
    if (action.type === "rest") {
      this.startAction("sleep", { duration: 700 });
      this.advanceToNextDay(true);
      this.scene = SCENE.PLAYING;
      return;
    }
    if (action.type === "save") {
      this.startAction("write", { duration: 560 });
      this.saveGame();
      return;
    }
    if (action.type === "recipe") this.cookRecipe(action.recipe);
    if (action.type === "artisan") this.makeArtisan(action.recipe);
  }

  cookRecipe(recipe) {
    if (!recipe) return;
    const missing = Object.entries(recipe.ingredients).find(([key, count]) => (this.inventory[key] || 0) < count);
    if (missing) {
      this.showMessage(`材料不足：${ITEMS[missing[0]].name} x${missing[1]}`, 1700);
      return;
    }
    this.startAction("cook", { duration: 820, item: recipe.id });
    Object.entries(recipe.ingredients).forEach(([key, count]) => this.removeItem(key, count));
    this.restoreEnergy(recipe.energy);
    this.currentBuff = { id: recipe.id, effect: recipe.effect, amount: recipe.amount, label: recipe.name, day: this.gameDay };
    this.progress.mealsCooked += 1;
    this.dayStats.cooked += 1;
    const festival = this.getFestivalInfo();
    if (festival?.name === "灯火晚餐") this.restoreEnergy(8);
    const skillKey = recipe.effect === "fishing" ? "fishing" : recipe.effect === "social" ? "social" : "crafting";
    const levelUps = this.gainSkillXp(skillKey, 3);
    this.showMessage(`做出了 ${recipe.name}，体力 +${recipe.energy}${this.formatLevelUps(levelUps)}`, 2200);
  }

  makeArtisan(recipe) {
    if (!recipe) return;
    if (this.progress.workshopLevel <= 0) {
      this.showMessage("还没有加工坊，先去商店投资建造。", 1700);
      return;
    }
    const missing = Object.entries(recipe.ingredients).find(([key, count]) => (this.inventory[key] || 0) < count);
    if (missing) {
      this.showMessage(`材料不足：${ITEMS[missing[0]].name} x${missing[1]}`, 1700);
      return;
    }
    if (!this.consumeEnergy(2, "体力不足，明天再来加工吧。")) return;
    this.startAction("craft", { duration: 820, item: recipe.result });
    Object.entries(recipe.ingredients).forEach(([key, count]) => this.removeItem(key, count));
    this.addItem(recipe.result, recipe.amount || 1);
    this.progress.artisanMade += recipe.amount || 1;
    this.dayStats.artisan += recipe.amount || 1;
    const levelUps = this.gainSkillXp("crafting", recipe.xp || 3);
    this.showMessage(`完成 ${ITEMS[recipe.result].name} x${recipe.amount || 1}${this.formatLevelUps(levelUps)}`, 2200);
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
    this.startAction("deliver", { duration: 620 });
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

  startAction(type, options = {}) {
    const duration = options.duration || 520;
    this.actionAnimation = {
      type,
      elapsed: 0,
      duration,
      target: options.target || null,
      item: options.item || null,
      color: options.color || null,
      label: options.label || "",
    };
    if (options.faceTarget && options.target) this.faceToward(options.target.x, options.target.y);
  }

  updateActionAnimation(dt) {
    if (!this.actionAnimation) return;
    this.actionAnimation.elapsed += dt;
    if (this.actionAnimation.elapsed >= this.actionAnimation.duration) this.actionAnimation = null;
  }

  getActionProgress() {
    if (!this.actionAnimation) return 0;
    return Math.max(0, Math.min(1, this.actionAnimation.elapsed / this.actionAnimation.duration));
  }

  faceToward(x, y) {
    const dx = x - this.player.x;
    const dy = y - this.player.y;
    if (Math.abs(dx) > Math.abs(dy)) this.player.facing = dx >= 0 ? "right" : "left";
    else this.player.facing = dy >= 0 ? "down" : "up";
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

  spawnDirectedParticles(x, y, color, count = 8, direction = { x: 0, y: 1 }, spread = 0.8) {
    const base = Math.atan2(direction.y, direction.x);
    for (let i = 0; i < count; i++) {
      const angle = base + (Math.random() - 0.5) * spread;
      const speed = 70 + Math.random() * 120;
      this.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color, life: 480, maxLife: 480, alpha: 1, size: 2.5 + Math.random() * 3.5 });
    }
  }

  updateInteractables(dt) {
    this.getAllInteractables().forEach((o) => {
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
    this.npcs.filter((npc) => npc.mapId === this.currentMapId).forEach((npc) => {
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
    if (npc.mapId === "forest") {
      if (hour < 12) return { x: 392, y: 312 };
      if (hour < 18) return { x: 670, y: 566 };
      return { x: 300, y: 840 };
    }
    if (npc.mapId === "harbor") {
      if (hour < 12) return { x: 954, y: 358 };
      if (hour < 18) return { x: 742, y: 924 };
      return { x: 1080, y: 520 };
    }
    if (this.isMarketDay() && hour >= 12 && hour < 20) {
      if (npc.id === "npc-chen") return { x: 500, y: 548 };
      if (npc.id === "npc-lingling") return { x: 430, y: 560 };
      if (npc.id === "npc-maomao") return { x: 370, y: 594 };
      if (npc.id === "npc-mei") return { x: 492, y: 572 };
      if (npc.id === "npc-su") return { x: 610, y: 594 };
      return { x: 560, y: 592 };
    }
    if (this.weather === "rain" && hour >= 9 && hour < 18) {
      if (npc.id === "npc-chen") return { x: 890, y: 260 };
      if (npc.id === "npc-lingling") return { x: 720, y: 300 };
      if (npc.id === "npc-maomao") return { x: 690, y: 336 };
      if (npc.id === "npc-mei") return { x: 584, y: 248 };
      if (npc.id === "npc-su") return { x: 840, y: 318 };
      return { x: 650, y: 372 };
    }
    if (hour < 12) return { x: npc.baseX - 50, y: npc.baseY };
    if (hour < 18) {
      if (npc.id === "npc-chen") return { x: 890, y: 260 };
      if (npc.id === "npc-lingling") return { x: 200, y: 760 };
      if (npc.id === "npc-maomao") return { x: 660, y: 280 };
      if (npc.id === "npc-mei") return { x: 540, y: 560 };
      if (npc.id === "npc-su") return { x: 540, y: 810 };
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
    this.footstepTimer += ds * speed;
    if (this.footstepTimer > 54) this.footstepTimer = 0;
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
    if (this.currentMapId === "town" && !this.progress.bridgeRepaired && x > 1060 && y > 460 && y < 620) return false;
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
    if (this.currentMapId !== "town") return null;
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
      this.startAction("hoe", { target: { x: plot.x + plot.w / 2, y: plot.y + plot.h / 2 }, faceTarget: true, duration: 620 });
      plot.tilled = true;
      const levelUps = this.gainSkillXp("farming", 2);
      this.showMessage(`你翻松了土地。${this.formatLevelUps(levelUps)}`, 1500);
      return;
    }
    if (plot.cropKey && !plot.ready) {
      if (!plot.watered) {
        if (!this.consumeEnergy(2)) return;
        this.startAction("water", { target: { x: plot.x + plot.w / 2, y: plot.y + plot.h / 2 }, faceTarget: true, duration: 760 });
        plot.watered = true;
        plot.wateredDays += 1;
        this.spawnDirectedParticles(this.player.x, this.player.y, "#67b6ff", 12, { x: plot.x + plot.w / 2 - this.player.x, y: plot.y + plot.h / 2 - this.player.y }, 0.55);
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
      this.startAction("harvest", { target: { x: plot.x + plot.w / 2, y: plot.y + plot.h / 2 }, faceTarget: true, duration: 620 });
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
      this.startAction("plant", { target: { x: plot.x + plot.w / 2, y: plot.y + plot.h / 2 }, item: seedKey, faceTarget: true, duration: 560 });
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
    this.npcs.filter((npc) => npc.mapId === this.currentMapId).forEach((npc) => {
      const d = Math.hypot(npc.x - this.player.x, npc.y - this.player.y);
      if (d < minD) { minD = d; best = npc; }
    });
    return best;
  }

  getNearestInteractable() {
    let best = null, minD = INTERACT_DISTANCE;
    this.interactables.forEach((obj) => {
      const cx = obj.x + obj.w / 2, cy = obj.y + obj.h / 2;
      const d = Math.hypot(cx - this.player.x, cy - this.player.y);
      if (d < minD) { minD = d; best = obj; }
    });
    return best;
  }

  interactWith(obj) {
    const blockReason = this.getInteractableBlockReason(obj);
    if (blockReason) {
      this.showMessage(blockReason, 2200);
      return;
    }
    if (obj.type === "house") {
      this.startAction("enter", { target: { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 }, faceTarget: true, duration: 420 });
      this.houseSelection = 0;
      this.scene = SCENE.INDOOR;
      return;
    }
    if (obj.type === "warp") {
      this.startAction("walk", { target: { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 }, faceTarget: true, duration: 360 });
      this.switchMap(obj.targetMap, obj.targetX, obj.targetY, `来到 ${this.worlds[obj.targetMap].name}`);
      return;
    }
    if (obj.type === "shop") {
      const h = this.gameMinutes / 60;
      const closeHour = this.isMarketDay() ? 22 : 20;
      if (h < 8 || h >= closeHour) {
        this.showMessage(`商店营业时间 08:00 - ${String(closeHour).padStart(2, "0")}:00。`, 1800);
        return;
      }
      this.startAction("shop", { target: { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 }, faceTarget: true, duration: 420 });
      this.scene = SCENE.SHOP;
      this.shopMode = "buy";
      this.shopSelection = 0;
      return;
    }
    if (obj.type === "sign") {
      this.startAction("read", { target: { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 }, faceTarget: true, duration: 520 });
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
    if (obj.type === "trailboard") {
      this.startAction("read", { target: { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 }, faceTarget: true, duration: 520 });
      this.tryCompleteAreaTask(obj.areaId || this.currentMapId);
      return;
    }
    if (obj.type === "shrine") {
      this.useForestShrine(obj);
      return;
    }
    if (obj.type === "spring") {
      this.drinkForestSpring(obj);
      return;
    }
    if (obj.type === "ruin") {
      this.searchForestRuin(obj);
      return;
    }
    if (obj.type === "logjam") {
      this.clearLogjam(obj);
      return;
    }
    if (obj.type === "ranch") {
      this.startAction("feed", { target: { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 }, faceTarget: true, duration: 680 });
      this.careForRanch();
      return;
    }
    if (obj.type === "shipping") {
      this.startAction("ship", { target: { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 }, faceTarget: true, duration: 660 });
      this.shipAllSellables();
      return;
    }
    if (obj.type === "project") {
      this.startAction("build", { target: { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 }, faceTarget: true, duration: 700 });
      if (!this.tryCompleteProject()) this.showProjectPreview();
      return;
    }
    if (obj.type === "fishspot") {
      if (!this.consumeEnergy(4, "体力不足，钓鱼前先回家歇会儿。")) return;
      this.startAction("cast", { target: { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 }, faceTarget: true, duration: 820 });
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
      this.startAction("build", { target: { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 }, faceTarget: true, duration: 780 });
      this.removeItem("wood", 20);
      this.removeItem("stone", 14);
      this.progress.bridgeRepaired = true;
      this.progress.eastUnlocked = true;
      this.showMessage("旧桥修复完成！东区解锁。", 2600);
      return;
    }
    if (obj.type === "firefly") {
      const hour = this.gameMinutes / 60;
      if (hour < 18 && hour > 5) {
        this.showMessage("萤火群要到傍晚以后才会亮起来。", 1800);
        return;
      }
    }

    if (obj.collected) {
      const timeLeft = Math.ceil((obj.regrowTime - obj.regrowTimer) / 1000);
      this.showMessage(`${obj.name} 已采集，${Math.max(0, timeLeft)}秒后恢复。`, 1300);
      return;
    }

    if (!this.consumeEnergy(2)) return;
    const actionType = obj.type === "tree" || obj.type === "resinTap" ? "axe" : obj.type === "stone" || obj.type === "crystal" || obj.type === "ore" ? "pickaxe" : "forage";
    this.startAction(actionType, { target: { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 }, faceTarget: true, duration: actionType === "forage" ? 560 : 720 });
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
    if (amount > 0) this.collections.items[key] = true;
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
    this.startAction("gift", { target: { x: npc.x, y: npc.y }, item: candidate, faceTarget: true, duration: 650 });
    this.removeItem(candidate, 1);
    const likeBonus = this.getGiftBonus(npc.likes.includes(candidate));
    this.relationship[npc.id] = Math.min(100, (this.relationship[npc.id] || 0) + likeBonus);
    this.dailyActions.gifted[npc.id] = this.gameDay;
    const levelUps = this.gainSkillXp("social", npc.likes.includes(candidate) ? 5 : 3);
    this.showMessage(`送出 ${ITEMS[candidate]?.name || candidate}，${npc.name} 好感 +${likeBonus}${this.formatLevelUps(levelUps)}`, 2200);
  }

  startDialogue(npc) {
    this.startAction("talk", { target: { x: npc.x, y: npc.y }, faceTarget: true, duration: 540 });
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
    if (npc.mapId === "forest") {
      pages.push(h < 16 ? "雾林里的香草和蘑菇更丰富，雨后更容易跑出好东西。" : "傍晚的雾林会安静下来，记得带着体力再继续深入。");
    } else if (npc.mapId === "harbor") {
      pages.push(h < 18 ? "月湾白天更适合钓鱼和捡珊瑚，深水点常有惊喜。" : "晚上海风会更冷，但夜钓收益往往也更漂亮。");
    } else if (h < 12) pages.push("早上先看农田是个好习惯，浇水会决定今天收成。");
    else if (h < 18) pages.push("下午适合跑商和采集，别忘了商店晚上八点关门。");
    else pages.push("晚上钓鱼收益更高，还能和大家聊聊今天过得怎么样。");

    if (npc.id === "npc-chen") {
      pages.push(this.progress.townRank >= 4 ? "镇子越来越像样了，玉米和甜瓜种子已经进货。" : "先靠萝卜和土豆滚资金，稳定后再上高价种子。");
    }
    if (npc.id === "npc-lingling" && this.progress.harvestCount >= 10) pages.push("你已经是靠谱农夫了！继续提升农场等级吧。");
    if (npc.id === "npc-maomao") pages.push("按 G 可以送礼物，送鱼给我加好感会更快喵！");
    if (npc.id === "npc-zhuang" && this.progress.bridgeRepaired) pages.push("东区开了，资源更多，建设速度会明显提升。");
    if (npc.id === "npc-ye") {
      const forestTask = this.getAreaTask("forest");
      pages.push("高地的入口在雾林北边，等镇子更繁荣一些就会彻底开放。");
      if (forestTask && !forestTask.done) pages.push(`林务站今天贴着「${forestTask.title}」：${this.formatAreaTaskProgress(forestTask)}。`);
    }
    if (npc.id === "npc-lan") pages.push("月湾和镇子之间来回很快，缺钱时来这里跑一圈通常不会空手。");
    if (npc.id === "npc-mei") pages.push(this.progress.workshopLevel ? "加工坊会把普通食材变成真正赚钱的货，别让水果和牛奶压仓。" : "等手头宽裕了，建个加工坊吧，日子会从卖原料变成做品牌。");
    if (npc.id === "npc-su") pages.push(this.progress.ranchLevel ? `你的牧场现在是：${this.getRanchSummary()}。动物每天喂干草，心情好会给更好的产物。` : "农场不只有作物。先建牧场，再买小鸡，现金流会更稳。");
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
    return [...this.getUnlockedSeeds(), "hay", "wood", "stone"];
  }

  getUpgradeList() {
    return [
      { id: "house", name: "小屋升级", desc: `Lv${this.progress.houseLevel}→Lv${this.progress.houseLevel + 1} / 体力上限提升`, cost: { gold: 280 + this.progress.houseLevel * 180, wood: 14 + this.progress.houseLevel * 4, stone: 8 + this.progress.houseLevel * 3 }, can: () => this.progress.houseLevel < 4, apply: () => { this.progress.houseLevel += 1; this.applyProgressDerivedStats(); } },
      { id: "farm", name: "农场扩建", desc: `Lv${this.progress.farmLevel}→Lv${this.progress.farmLevel + 1} / 解锁更多地块`, cost: { gold: 260 + this.progress.farmLevel * 150, wood: 10 + this.progress.farmLevel * 5 }, can: () => this.progress.farmLevel < 3, apply: () => { this.progress.farmLevel += 1; } },
      { id: "bridge", name: "修复旧桥", desc: this.progress.bridgeRepaired ? "已完成" : "解锁东区资源区", cost: { gold: 450, wood: 20, stone: 14 }, can: () => !this.progress.bridgeRepaired, apply: () => { this.progress.bridgeRepaired = true; this.progress.eastUnlocked = true; } },
      { id: "ranch", name: this.progress.ranchLevel ? "牧场扩建" : "建造牧场", desc: `Lv${this.progress.ranchLevel}→Lv${this.progress.ranchLevel + 1} / 容量 ${this.getRanchCapacity()}→${2 + (this.progress.ranchLevel + 1) * 2}`, cost: { gold: 360 + this.progress.ranchLevel * 260, wood: 18 + this.progress.ranchLevel * 8, stone: 6 + this.progress.ranchLevel * 5 }, can: () => this.progress.ranchLevel < 3, apply: () => { this.progress.ranchLevel += 1; } },
      { id: "workshop", name: this.progress.workshopLevel ? "加工坊扩建" : "建造加工坊", desc: `Lv${this.progress.workshopLevel}→Lv${this.progress.workshopLevel + 1} / 解锁更多手作`, cost: { gold: 420 + this.progress.workshopLevel * 320, wood: 16 + this.progress.workshopLevel * 8, stone: 10 + this.progress.workshopLevel * 5 }, can: () => this.progress.workshopLevel < 2, apply: () => { this.progress.workshopLevel += 1; } },
      { id: "tool", name: "工具组升级", desc: `Lv${this.progress.toolLevel}→Lv${this.progress.toolLevel + 1} / 所有劳作更省体力`, cost: { gold: 220 + this.progress.toolLevel * 180, wood: 8 + this.progress.toolLevel * 4, stone: 10 + this.progress.toolLevel * 5, crystal: this.progress.toolLevel >= 3 ? 1 : 0 }, can: () => this.progress.toolLevel < 5, apply: () => { this.progress.toolLevel += 1; } },
      { id: "rod", name: "鱼竿升级", desc: `Lv${this.progress.rodLevel}→Lv${this.progress.rodLevel + 1} / 钓鱼条更稳定`, cost: { gold: 200 + this.progress.rodLevel * 160, wood: 8 + this.progress.rodLevel * 3, shell: this.progress.rodLevel >= 2 ? 2 : 0, coral: this.progress.rodLevel >= 3 ? 1 : 0 }, can: () => this.progress.rodLevel < 5, apply: () => { this.progress.rodLevel += 1; } },
      { id: "chicken", name: "购买小鸡", desc: `牧场容量 ${this.ranch.animals.length}/${this.getRanchCapacity()}`, cost: ANIMALS.chicken.cost, can: () => this.progress.ranchLevel > 0 && this.ranch.animals.length < this.getRanchCapacity(), apply: () => { this.addAnimal("chicken"); } },
      { id: "cow", name: "购买奶牛", desc: `牧场容量 ${this.ranch.animals.length}/${this.getRanchCapacity()}`, cost: ANIMALS.cow.cost, can: () => this.progress.ranchLevel >= 2 && this.ranch.animals.length < this.getRanchCapacity(), apply: () => { this.addAnimal("cow"); } },
      { id: "sheep", name: "购买绵羊", desc: `牧场容量 ${this.ranch.animals.length}/${this.getRanchCapacity()}`, cost: ANIMALS.sheep.cost, can: () => this.progress.ranchLevel >= 3 && this.ranch.animals.length < this.getRanchCapacity(), apply: () => { this.addAnimal("sheep"); } },
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
        this.startAction("buy", { duration: 520, item: itemKey });
        this.gold -= price;
        this.addItem(itemKey, 1);
        this.showMessage(`购买 ${ITEMS[itemKey].name} -${price}金`, 1400);
      } else if (this.shopMode === "sell") {
        const itemKey = list[this.shopSelection];
        const price = this.getSellPrice(itemKey);
        this.startAction("sell", { duration: 520, item: itemKey });
        this.removeItem(itemKey, 1);
        this.gold += price;
        this.progress.totalEarned += price;
        this.showMessage(`卖出 ${ITEMS[itemKey].name} +${price}金`, 1400);
      } else {
        const up = list[this.shopSelection];
        const c = up.cost;
        const missing = Object.entries(c).filter(([, amount]) => amount > 0).find(([key, amount]) => {
          if (key === "gold") return this.gold < amount;
          return (this.inventory[key] || 0) < amount;
        });
        if (missing) {
          return this.showMessage("材料或金币不足。", 1500);
        }
        this.startAction("build", { duration: 680, item: up.id });
        Object.entries(c).filter(([, amount]) => amount > 0).forEach(([key, amount]) => {
          if (key === "gold") this.gold -= amount;
          else this.removeItem(key, amount);
        });
        up.apply();
        this.showMessage(`完成：${up.name}！`, 1800);
      }
    }
  }

  handleFishingInput() {
    if (this.fishingState === "biting") {
      this.startAction("reel", { duration: 650 });
      this.fishingState = "reeling";
      this.fishingBarY = 180;
      this.fishingFishY = 80 + Math.random() * 180;
      this.fishingProgress = 18 + (this.getSkillLevel("fishing") - 1) * 4 + Math.round(this.getBuffValue("fishing") * 30);
    } else if (this.fishingState === "reeling") {
      this.startAction("reel", { duration: 280 });
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
    if (this.currentMapId === "harbor") {
      if (Math.random() < rareChance + 0.08) key = "goldKoi";
      else if (night && Math.random() < 0.45) key = "nightFish";
      else if (Math.random() < 0.48 || this.weather === "rain") key = "silverFish";
    } else if (this.currentMapId === "highlands") {
      if (Math.random() < rareChance + 0.12) key = "goldKoi";
      else if (Math.random() < 0.28) key = "silverFish";
      else if (night && Math.random() < 0.34) key = "nightFish";
    } else if (this.currentMapId === "forest") {
      if (night && Math.random() < 0.5) key = "nightFish";
      else if ((this.weather === "rain" || this.weather === "mist") && Math.random() < 0.36) key = "silverFish";
    } else if (Math.random() < rareChance) key = "goldKoi";
    else if (night && Math.random() < 0.55) key = "nightFish";
    else if ((this.weather === "rain" || this.weather === "mist") && Math.random() < 0.32) key = "silverFish";
    this.addItem(key, 1);
    this.progress.fishCaught += 1;
    this.dayStats.fishCaught += 1;
    const xp = key === "goldKoi" ? 10 : key === "nightFish" ? 7 : 5;
    const levelUps = this.gainSkillXp("fishing", xp);
    this.fishingResult = { name: ITEMS[key].name, icon: ITEMS[key].icon, value: this.getSellPrice(key) };
    this.fishingState = "result";
    this.startAction("catch", { duration: 760, item: key });
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

  roundedRect(x, y, w, h, r = 10) {
    const { ctx } = this;
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  fillRoundRect(x, y, w, h, r, fill, stroke = "") {
    const { ctx } = this;
    this.roundedRect(x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  }

  drawSoftPanel(x, y, w, h, options = {}) {
    const { ctx } = this;
    const fill = options.fill || UI.paper;
    const stroke = options.stroke || "rgba(255,255,255,0.45)";
    ctx.save();
    ctx.shadowColor = options.shadow || UI.shadow;
    ctx.shadowBlur = options.blur ?? 18;
    ctx.shadowOffsetY = options.offsetY ?? 8;
    this.fillRoundRect(x, y, w, h, options.radius ?? 12, fill, stroke);
    ctx.restore();
    if (options.accent) {
      this.fillRoundRect(x + 10, y + 8, 4, h - 16, 3, options.accent);
    }
    if (options.gloss !== false) {
      ctx.save();
      ctx.strokeStyle = options.light || "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + (options.radius ?? 12), y + 1.5);
      ctx.lineTo(x + w - (options.radius ?? 12), y + 1.5);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawBar(x, y, w, h, ratio, color, back = "rgba(32,52,47,0.12)") {
    const { ctx } = this;
    this.fillRoundRect(x, y, w, h, h / 2, back, "rgba(255,255,255,0.10)");
    const fillW = Math.max(h, w * Math.max(0, Math.min(1, ratio)));
    this.fillRoundRect(x, y, fillW, h, h / 2, color);
    ctx.fillStyle = "rgba(255,255,255,0.20)";
    this.roundedRect(x + 2, y + 2, Math.max(0, fillW - 4), Math.max(1, h * 0.32), h / 2);
    ctx.fill();
  }

  wrapText(text, maxWidth, font) {
    const { ctx } = this;
    ctx.font = font;
    const lines = [];
    let current = "";
    for (const char of String(text)) {
      const next = current + char;
      if (ctx.measureText(next).width > maxWidth && current) {
        lines.push(current);
        current = char;
      } else {
        current = next;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  noise(tx, ty, salt = 0) {
    const n = Math.sin(tx * 127.1 + ty * 311.7 + salt * 74.7) * 43758.5453;
    return n - Math.floor(n);
  }

  drawGroundShadow(x, y, w, h, alpha = 0.22) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = `rgba(31, 38, 33, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  getTilePalette(tile) {
    const seasonId = this.getSeasonInfo().id;
    const grass = seasonId === "autumn" ? ["#9fb76f", "#789b59", "#d2aa69"] : seasonId === "winter" ? ["#9eb9ad", "#7f9d92", "#dce7dd"] : ["#91bd78", "#6fa061", "#c9d79a"];
    const darkGrass = seasonId === "autumn" ? ["#738c54", "#566f47", "#b68256"] : seasonId === "winter" ? ["#77998e", "#5e7d75", "#d9e6de"] : ["#6f9b63", "#4f7a4a", "#b7cf85"];
    const palettes = {
      [TILE.GRASS]: grass,
      [TILE.FLOWER]: grass,
      [TILE.DARK_GRASS]: darkGrass,
      [TILE.PATH]: ["#dcc9a5", "#c8ae82", "#f0dfbd"],
      [TILE.SAND]: ["#e5d7af", "#cfbd8d", "#f4e7bf"],
      [TILE.WATER]: ["#79b4cc", "#4d8eaa", "#c4e5ea"],
      [TILE.WOOD_FLOOR]: ["#bc9260", "#9f744a", "#ddba83"],
      [TILE.FARM_SOIL]: ["#8a6650", "#654635", "#b18866"],
    };
    return palettes[tile] || palettes[TILE.GRASS];
  }

  drawTileSurface(tile, px, py, tx, ty) {
    const { ctx } = this;
    const [light, base, highlight] = this.getTilePalette(tile);
    const grad = ctx.createLinearGradient(px, py, px + TILE_SIZE, py + TILE_SIZE);
    grad.addColorStop(0, light);
    grad.addColorStop(0.58, base);
    grad.addColorStop(1, light);
    ctx.fillStyle = grad;
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

    ctx.fillStyle = "rgba(28,35,31,0.055)";
    ctx.fillRect(px, py + TILE_SIZE - 1, TILE_SIZE, 1);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(px, py, TILE_SIZE, 1);

    const seed = this.noise(tx, ty, 1);
    if (tile === TILE.GRASS || tile === TILE.DARK_GRASS || tile === TILE.FLOWER) {
      ctx.strokeStyle = tile === TILE.DARK_GRASS ? "rgba(232,241,203,0.16)" : "rgba(37,83,45,0.16)";
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 4; i++) {
        const bx = px + 7 + ((seed * 91 + i * 11) % 34);
        const by = py + 10 + ((seed * 67 + i * 7) % 30);
        ctx.beginPath();
        ctx.moveTo(bx, by + 5);
        ctx.quadraticCurveTo(bx + 2, by, bx + 5, by + 3);
        ctx.stroke();
      }
      if (tile === TILE.FLOWER || seed > 0.72) {
        ctx.fillStyle = tile === TILE.FLOWER ? "rgba(232,166,157,0.72)" : "rgba(246,226,156,0.38)";
        ctx.beginPath();
        ctx.arc(px + 14 + (seed * 19) % 22, py + 14 + (seed * 29) % 18, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (tile === TILE.PATH || tile === TILE.SAND || tile === TILE.FARM_SOIL) {
      ctx.fillStyle = tile === TILE.FARM_SOIL ? "rgba(63,39,28,0.16)" : "rgba(98,76,52,0.10)";
      for (let i = 0; i < 5; i++) {
        const sx = px + 6 + ((seed * 101 + i * 13) % 36);
        const sy = py + 8 + ((seed * 83 + i * 9) % 31);
        ctx.fillRect(sx, sy, 5 + (i % 2) * 3, 1.5);
      }
      if (tile === TILE.FARM_SOIL) {
        ctx.strokeStyle = "rgba(43,27,20,0.18)";
        for (let i = 1; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(px + 5, py + i * 12);
          ctx.lineTo(px + TILE_SIZE - 5, py + i * 12 + 2);
          ctx.stroke();
        }
      }
    }

    if (tile === TILE.WATER) {
      const water = ctx.createLinearGradient(px, py, px, py + TILE_SIZE);
      water.addColorStop(0, "rgba(255,255,255,0.20)");
      water.addColorStop(0.55, "rgba(89,163,190,0.22)");
      water.addColorStop(1, "rgba(28,72,96,0.18)");
      ctx.fillStyle = water;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.strokeStyle = "rgba(232,248,246,0.42)";
      ctx.lineWidth = 1.4;
      for (let i = 0; i < 2; i++) {
        const wave = Math.sin((tx + ty + this.gameMinutes * 0.05 + i * 2) * 0.8) * 2;
        ctx.beginPath();
        ctx.moveTo(px + 7, py + 17 + i * 14 + wave);
        ctx.bezierCurveTo(px + 18, py + 12 + i * 14 + wave, px + 29, py + 24 + i * 14 + wave, px + 42, py + 18 + i * 14 + wave);
        ctx.stroke();
      }
    }

    if (tile === TILE.WOOD_FLOOR) {
      ctx.strokeStyle = "rgba(68,45,29,0.22)";
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(px, py + i * 12);
        ctx.lineTo(px + TILE_SIZE, py + i * 12);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(255,238,190,0.10)";
      ctx.fillRect(px + 6, py + 7, 24, 2);
    }

    ctx.fillStyle = "rgba(255,255,255,0.045)";
    ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, 1);
    if (highlight && this.noise(tx, ty, 3) > 0.88 && tile !== TILE.WATER) {
      ctx.fillStyle = `${highlight}55`;
      ctx.fillRect(px + 8, py + 8, 8, 2);
    }
  }

  render() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (this.scene === SCENE.TITLE) return this.renderTitle();
    if (this.scene === SCENE.INDOOR) { this.renderIndoor(); this.renderMessage(); return; }
    if (this.scene === SCENE.SHOP) { this.renderGame(); this.renderShop(); return; }
    if (this.scene === SCENE.DIALOGUE) { this.renderGame(); this.renderDialogue(); return; }
    if (this.scene === SCENE.INVENTORY) { this.renderGame(); this.renderInventory(); return; }
    if (this.scene === SCENE.JOURNAL) { this.renderGame(); this.renderJournal(); return; }
    if (this.scene === SCENE.FISHING) { this.renderGame(); this.renderFishing(); return; }
    this.renderGame();
  }

  renderGame() {
    const { ctx } = this;
    this.renderSkyBackdrop();

    ctx.save();
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));
    this.renderTileMap();
    if (this.currentMapId === "town") this.renderFarmPlots();
    this.renderInteractables();
    this.renderNpcs();
    this.renderPlayer();
    this.renderActionEffects();
    this.renderParticles();
    ctx.restore();

    this.renderNightOverlay();
    this.renderWeatherEffects();
    this.renderCinematicVignette();
    this.renderHud();
    this.renderQuestTracker();
    this.renderSkillPanel();
    this.renderMessage();
  }

  renderSkyBackdrop() {
    const { ctx, canvas } = this;
    const hour = this.gameMinutes / 60;
    const base = getSkyColor(hour);
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, base);
    grad.addColorStop(0.58, hour >= 18 || hour < 6 ? "#2d4050" : "#bdd3cf");
    grad.addColorStop(1, hour >= 18 || hour < 6 ? "#26352f" : "#cfd7bd");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    const celestialX = ((hour - 5) / 18) * canvas.width;
    const celestialY = hour >= 18 || hour < 6 ? 72 : 58;
    const glow = ctx.createRadialGradient(celestialX, celestialY, 4, celestialX, celestialY, 120);
    glow.addColorStop(0, hour >= 18 || hour < 6 ? "rgba(225,232,214,0.34)" : "rgba(255,231,158,0.38)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(celestialX, celestialY, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hour >= 18 || hour < 6 ? "rgba(235,240,219,0.78)" : "rgba(255,224,142,0.90)";
    ctx.beginPath();
    ctx.arc(celestialX, celestialY, hour >= 18 || hour < 6 ? 11 : 16, 0, Math.PI * 2);
    ctx.fill();

    const hillY = canvas.height - 76;
    ctx.fillStyle = "rgba(48,78,64,0.18)";
    ctx.beginPath();
    ctx.moveTo(0, hillY + 28);
    for (let x = 0; x <= canvas.width + 80; x += 80) {
      ctx.quadraticCurveTo(x + 36, hillY - 28 + Math.sin(x * 0.03) * 12, x + 80, hillY + 20);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  renderCinematicVignette() {
    const { ctx, canvas } = this;
    const vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width * 0.24, canvas.width / 2, canvas.height / 2, canvas.width * 0.72);
    vignette.addColorStop(0, "rgba(255,255,255,0)");
    vignette.addColorStop(0.72, "rgba(31,38,33,0.04)");
    vignette.addColorStop(1, "rgba(16,24,22,0.22)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
        this.drawTileSurface(tile, px, py, tx, ty);
      }
    }
  }

  renderFarmPlots() {
    const { ctx } = this;
    this.farmPlots.forEach((p) => {
      const unlocked = p.lockedLevel <= this.progress.farmLevel;
      const plotGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      if (unlocked && p.tilled) {
        plotGrad.addColorStop(0, "#9a7358");
        plotGrad.addColorStop(1, "#634534");
      } else if (unlocked) {
        plotGrad.addColorStop(0, "rgba(103,142,76,0.86)");
        plotGrad.addColorStop(1, "rgba(67,102,58,0.86)");
      } else {
        plotGrad.addColorStop(0, "rgba(62,68,62,0.62)");
        plotGrad.addColorStop(1, "rgba(32,38,35,0.62)");
      }
      this.drawGroundShadow(p.x + p.w / 2, p.y + p.h - 1, p.w * 0.42, 4, 0.10);
      this.fillRoundRect(p.x, p.y, p.w, p.h, 8, plotGrad, "rgba(255,255,255,0.18)");
      if (!unlocked) {
        ctx.fillStyle = "rgba(248,241,216,0.86)";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Lv" + p.lockedLevel, p.x + p.w / 2, p.y + 27);
        ctx.textAlign = "left";
        return;
      }
      if (p.tilled) {
        ctx.strokeStyle = "rgba(76,48,33,0.18)";
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(p.x + 7, p.y + i * 10);
          ctx.lineTo(p.x + p.w - 7, p.y + i * 10 + 2);
          ctx.stroke();
        }
      }
      if (p.cropKey) {
        const crop = CROPS[p.cropKey];
        const s = p.ready ? crop.stages : p.stage;
        const height = 6 + (s / crop.stages) * 24;
        ctx.strokeStyle = p.ready ? "#c69a37" : "#4f8551";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(p.x + 22, p.y + p.h - 8);
        ctx.lineTo(p.x + 22, p.y + p.h - height - 6);
        ctx.stroke();
        ctx.fillStyle = p.ready ? "#f1cf66" : "#7cbf72";
        ctx.beginPath();
        ctx.ellipse(p.x + 22, p.y + p.h - height - 8, 11, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      if (p.watered) {
        const water = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y + p.h);
        water.addColorStop(0, "rgba(155,205,231,0.34)");
        water.addColorStop(1, "rgba(83,141,181,0.20)");
        this.fillRoundRect(p.x + 3, p.y + 3, p.w - 6, p.h - 6, 7, water);
      }
    });
  }

  renderInteractables() {
    const { ctx } = this;
    [...this.interactables].sort((a, b) => (a.y + a.h) - (b.y + b.h)).forEach((obj) => {
      if (obj.type === "tree") this.drawTree(obj);
      else if (obj.type === "bush") this.drawBush(obj);
      else if (obj.type === "flower") this.drawFlower(obj);
      else if (obj.type === "herb") this.drawHerb(obj);
      else if (obj.type === "mushroom") this.drawMushroom(obj);
      else if (obj.type === "stone") this.drawStone(obj);
      else if (obj.type === "crystal") this.drawCrystal(obj);
      else if (obj.type === "ore") this.drawOre(obj);
      else if (obj.type === "coral") this.drawCoral(obj);
      else if (obj.type === "fishspot") this.drawFishspot(obj);
      else if (obj.type === "trailboard") this.drawTrailBoard(obj);
      else if (obj.type === "shrine") this.drawShrine(obj);
      else if (obj.type === "spring") this.drawSpring(obj);
      else if (obj.type === "ruin") this.drawRuin(obj);
      else if (obj.type === "logjam") this.drawLogjam(obj);
      else if (obj.type === "beehive") this.drawBeehive(obj);
      else if (obj.type === "resinTap") this.drawResinTap(obj);
      else if (obj.type === "wildPatch") this.drawWildPatch(obj);
      else if (obj.type === "firefly") this.drawFireflyCluster(obj);
      else if (obj.type === "house") this.drawHouse(obj);
      else if (obj.type === "shop") this.drawShop(obj);
      else if (obj.type === "sign") this.drawSign(obj);
      else if (obj.type === "ranch") this.drawRanch(obj);
      else if (obj.type === "shipping") this.drawShipping(obj);
      else if (obj.type === "project") this.drawProjectBoard(obj);
      else if (obj.type === "shell") this.drawShell(obj);
      else if (obj.type === "bridge") this.drawBridge(obj);
      else if (obj.type === "warp") this.drawWarp(obj);

      if (obj.type === "sign" && this.getPendingRequests().some((request) => (this.inventory[request.item] || 0) >= request.amount)) {
        ctx.fillStyle = "#ffd86b";
        ctx.beginPath();
        ctx.arc(obj.x + obj.w - 2, obj.y - 6, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      if (obj.type === "project" && this.getOpenProjects().some((project) => this.canCompleteProject(project))) {
        ctx.fillStyle = "#d7b86d";
        ctx.beginPath();
        ctx.arc(obj.x + obj.w - 4, obj.y - 6, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      if (obj.type === "trailboard" && this.canCompleteAreaTask(this.getAreaTask(obj.areaId || this.currentMapId))) {
        ctx.fillStyle = "#b7e38f";
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
        ctx.fillText(this.getInteractableBlockReason(obj) ? "锁定" : "[E]", obj.x + obj.w / 2, obj.y - 10);
        ctx.textAlign = "left";
      }
    });
  }

  drawTree(obj) {
    const { ctx } = this;
    this.drawGroundShadow(obj.x + 34, obj.y + 78, 34, 9, 0.20);
    this.fillRoundRect(obj.x + 24, obj.y + 32, 17, 48, 5, "#70533b");
    ctx.fillStyle = "rgba(255,229,177,0.16)";
    ctx.fillRect(obj.x + 28, obj.y + 38, 4, 34);
    const crown = obj.collected ? ["#9ab18b", "#829b78"] : ["#6aa965", "#487d4c"];
    const grad = ctx.createRadialGradient(obj.x + 20, obj.y + 18, 6, obj.x + 34, obj.y + 34, 42);
    grad.addColorStop(0, crown[0]);
    grad.addColorStop(1, crown[1]);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(obj.x + 32, obj.y + 32, 35, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.beginPath();
    ctx.ellipse(obj.x + 20, obj.y + 19, 13, 8, -0.4, 0, Math.PI * 2);
    ctx.ellipse(obj.x + 45, obj.y + 27, 9, 6, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawBush(obj) {
    const { ctx } = this;
    this.drawGroundShadow(obj.x + 30, obj.y + 42, 26, 7, 0.16);
    const grad = ctx.createLinearGradient(obj.x, obj.y, obj.x, obj.y + 44);
    grad.addColorStop(0, obj.collected ? "#9eb78e" : "#6ca464");
    grad.addColorStop(1, obj.collected ? "#758f6d" : "#4c7f4b");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(obj.x + 30, obj.y + 24, 29, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = obj.collected ? "rgba(246,223,177,0.32)" : "#c96575";
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(obj.x + 12 + i * 9, obj.y + 17 + (i % 2) * 8, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawFlower(obj) {
    const { ctx } = this;
    if (obj.collected) {
      ctx.fillStyle = "rgba(95,154,98,0.45)";
      ctx.fillRect(obj.x + 12, obj.y + 18, 8, 10);
      return;
    }
    ctx.strokeStyle = "#5f8d56";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(obj.x + 16, obj.y + 28);
    ctx.lineTo(obj.x + 16, obj.y + 14);
    ctx.stroke();
    ["#d97992", "#e9b7bf", "#f0d3a0"].forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(obj.x + 16 + Math.cos(i * 2.1) * 7, obj.y + 12 + Math.sin(i * 2.1) * 5, 6, 4, i, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawHerb(obj) {
    const { ctx } = this;
    ctx.strokeStyle = obj.collected ? "#8fa081" : "#5f9f67";
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(obj.x + 9 + i * 5, obj.y + 28);
      ctx.quadraticCurveTo(obj.x + 6 + i * 6, obj.y + 15, obj.x + 12 + i * 4, obj.y + 8 + (i % 2) * 4);
      ctx.stroke();
    }
  }

  drawMushroom(obj) {
    const { ctx } = this;
    this.fillRoundRect(obj.x + 13, obj.y + 15, 12, 18, 4, obj.collected ? "#c3ad95" : "#f2e7cf");
    ctx.fillStyle = obj.collected ? "#b79b88" : "#b76758";
    ctx.beginPath();
    ctx.ellipse(obj.x + 19, obj.y + 15, 18, 12, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(obj.x + 13, obj.y + 13, 2, 0, Math.PI * 2);
    ctx.arc(obj.x + 23, obj.y + 10, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawStone(obj) {
    const { ctx } = this;
    this.drawGroundShadow(obj.x + 30, obj.y + 42, 25, 6, 0.15);
    const grad = ctx.createLinearGradient(obj.x + 6, obj.y + 5, obj.x + 52, obj.y + 42);
    grad.addColorStop(0, obj.collected ? "#c1c8c1" : "#9aa7a7");
    grad.addColorStop(0.55, obj.collected ? "#a7b0aa" : "#7d8b8c");
    grad.addColorStop(1, obj.collected ? "#8c9991" : "#58686c");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(obj.x + 29, obj.y + 26, 28, 19, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.beginPath();
    ctx.ellipse(obj.x + 19, obj.y + 18, 10, 5, -0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCrystal(obj) {
    const { ctx } = this;
    this.drawGroundShadow(obj.x + 22, obj.y + 42, 18, 5, 0.14);
    const grad = ctx.createLinearGradient(obj.x, obj.y, obj.x + 40, obj.y + 40);
    grad.addColorStop(0, obj.collected ? "#b4bec3" : "#d3f2ef");
    grad.addColorStop(1, obj.collected ? "#899da5" : "#6fb8c6");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(obj.x + 20, obj.y);
    ctx.lineTo(obj.x + 39, obj.y + 17);
    ctx.lineTo(obj.x + 29, obj.y + 42);
    ctx.lineTo(obj.x + 8, obj.y + 35);
    ctx.lineTo(obj.x + 6, obj.y + 14);
    ctx.closePath();
    ctx.fill();
  }

  drawOre(obj) {
    const { ctx } = this;
    this.drawStone({ ...obj, w: 58, h: 44 });
    if (obj.collected) return;
    ctx.fillStyle = "#b59b78";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(obj.x + 18 + i * 10, obj.y + 18 + (i % 2) * 7, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawCoral(obj) {
    const { ctx } = this;
    ctx.strokeStyle = obj.collected ? "#bba097" : "#d98277";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(obj.x + 18, obj.y + 30);
    ctx.lineTo(obj.x + 18, obj.y + 8);
    ctx.moveTo(obj.x + 18, obj.y + 17);
    ctx.lineTo(obj.x + 8, obj.y + 8);
    ctx.moveTo(obj.x + 18, obj.y + 17);
    ctx.lineTo(obj.x + 29, obj.y + 7);
    ctx.moveTo(obj.x + 18, obj.y + 25);
    ctx.lineTo(obj.x + 8, obj.y + 16);
    ctx.moveTo(obj.x + 18, obj.y + 25);
    ctx.lineTo(obj.x + 31, obj.y + 16);
    ctx.stroke();
    ctx.lineCap = "butt";
  }

  drawFishspot(obj) {
    const { ctx } = this;
    const pulse = 1 + Math.sin(this.lastTime * 0.004) * 0.08;
    ctx.strokeStyle = "rgba(248,241,216,0.58)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(obj.x + 20, obj.y + 20, 15 * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(248,241,216,0.9)";
    ctx.font = "18px sans-serif";
    ctx.fillText("🎣", obj.x + 9, obj.y + 28);
  }

  drawTrailBoard(obj) {
    const { ctx } = this;
    this.drawGroundShadow(obj.x + obj.w / 2, obj.y + obj.h, 22, 5, 0.18);
    this.fillRoundRect(obj.x + 19, obj.y + 26, 8, 34, 3, "#76533a");
    this.fillRoundRect(obj.x + 5, obj.y + 5, obj.w - 10, 30, 6, "#8d6748", "rgba(255,255,255,0.20)");
    this.fillRoundRect(obj.x + 10, obj.y + 10, obj.w - 20, 20, 4, "rgba(248,241,216,0.72)");
    const task = this.getAreaTask(obj.areaId || this.currentMapId);
    ctx.fillStyle = task?.done ? "#6f8e71" : this.canCompleteAreaTask(task) ? "#d9b96f" : "#456c56";
    ctx.beginPath();
    ctx.arc(obj.x + obj.w / 2, obj.y + 20, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawShrine(obj) {
    const { ctx } = this;
    this.drawGroundShadow(obj.x + obj.w / 2, obj.y + obj.h - 2, 25, 6, 0.18);
    const used = this.progress.forestShrineDay === this.gameDay;
    const stone = ctx.createLinearGradient(obj.x, obj.y, obj.x + obj.w, obj.y + obj.h);
    stone.addColorStop(0, used ? "#9ca99c" : "#b6c0ac");
    stone.addColorStop(1, used ? "#6f8274" : "#718a72");
    this.fillRoundRect(obj.x + 7, obj.y + 16, obj.w - 14, 34, 8, stone, "rgba(255,255,255,0.18)");
    this.fillRoundRect(obj.x + 14, obj.y + 6, obj.w - 28, 15, 6, "#6e8a68");
    ctx.strokeStyle = used ? "rgba(248,241,216,0.22)" : "rgba(214,242,170,0.65)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(obj.x + obj.w / 2, obj.y + 32, 13 + Math.sin(this.lastTime * 0.003) * 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawSpring(obj) {
    const { ctx } = this;
    this.drawGroundShadow(obj.x + obj.w / 2, obj.y + obj.h - 1, 25, 5, 0.14);
    const used = this.progress.forestSpringDay === this.gameDay;
    const water = ctx.createRadialGradient(obj.x + 28, obj.y + 20, 3, obj.x + 28, obj.y + 20, 32);
    water.addColorStop(0, used ? "rgba(170,196,196,0.74)" : "rgba(178,237,230,0.92)");
    water.addColorStop(1, used ? "rgba(92,122,124,0.62)" : "rgba(71,149,159,0.74)");
    ctx.fillStyle = water;
    ctx.beginPath();
    ctx.ellipse(obj.x + 29, obj.y + 23, 28, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(248,241,216,0.38)";
    ctx.beginPath();
    ctx.ellipse(obj.x + 29, obj.y + 23, 20 + Math.sin(this.lastTime * 0.004) * 3, 10, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawRuin(obj) {
    const { ctx } = this;
    this.drawGroundShadow(obj.x + obj.w / 2, obj.y + obj.h - 3, 33, 7, 0.16);
    this.fillRoundRect(obj.x + 6, obj.y + 22, 62, 24, 6, obj.collected ? "#8a938a" : "#7b8b7d", "rgba(255,255,255,0.14)");
    this.fillRoundRect(obj.x + 16, obj.y + 8, 12, 36, 4, obj.collected ? "#99a19a" : "#aab4a7");
    this.fillRoundRect(obj.x + 44, obj.y + 13, 11, 31, 4, obj.collected ? "#8f998f" : "#9faa9d");
    ctx.strokeStyle = obj.collected ? "rgba(159,196,220,0.25)" : "rgba(154,207,255,0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(obj.x + 28, obj.y + 28);
    ctx.lineTo(obj.x + 38, obj.y + 22);
    ctx.lineTo(obj.x + 48, obj.y + 30);
    ctx.stroke();
  }

  drawLogjam(obj) {
    const { ctx } = this;
    if (obj.collected) {
      ctx.fillStyle = "rgba(112,83,59,0.28)";
      ctx.fillRect(obj.x + 10, obj.y + 26, obj.w - 20, 4);
      return;
    }
    this.drawGroundShadow(obj.x + obj.w / 2, obj.y + obj.h - 1, 37, 5, 0.16);
    for (let i = 0; i < 3; i++) {
      this.fillRoundRect(obj.x + 6 + i * 10, obj.y + 8 + i * 7, obj.w - 18, 11, 6, i % 2 ? "#8b6240" : "#9c7048", "rgba(255,255,255,0.12)");
      ctx.fillStyle = "rgba(70,47,30,0.35)";
      ctx.beginPath();
      ctx.arc(obj.x + 13 + i * 10, obj.y + 13 + i * 7, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawBeehive(obj) {
    const { ctx } = this;
    this.drawGroundShadow(obj.x + obj.w / 2, obj.y + obj.h - 1, 15, 4, 0.12);
    ctx.strokeStyle = "#6b5134";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(obj.x + 18, obj.y);
    ctx.lineTo(obj.x + 18, obj.y + 11);
    ctx.stroke();
    const grad = ctx.createLinearGradient(obj.x, obj.y + 8, obj.x, obj.y + obj.h);
    grad.addColorStop(0, obj.collected ? "#b99562" : "#d9a84d");
    grad.addColorStop(1, obj.collected ? "#8d714b" : "#ad7131");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(obj.x + 18, obj.y + 25, 18, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(89,58,28,0.36)";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(obj.x + 5, obj.y + 18 + i * 7);
      ctx.lineTo(obj.x + 31, obj.y + 18 + i * 7);
      ctx.stroke();
    }
  }

  drawResinTap(obj) {
    const { ctx } = this;
    this.fillRoundRect(obj.x + 12, obj.y, 13, 42, 4, "#6e513a");
    this.fillRoundRect(obj.x + 4, obj.y + 24, 28, 15, 5, obj.collected ? "#8f8a75" : "#b48645", "rgba(255,255,255,0.16)");
    if (!obj.collected) {
      ctx.fillStyle = "#d6a15c";
      ctx.beginPath();
      ctx.arc(obj.x + 18, obj.y + 21, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawWildPatch(obj) {
    const { ctx } = this;
    ctx.strokeStyle = obj.collected ? "#849477" : "#5f9f67";
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      const sx = obj.x + 6 + i * 6;
      ctx.beginPath();
      ctx.moveTo(sx, obj.y + 32);
      ctx.quadraticCurveTo(sx - 7, obj.y + 17, sx + 2, obj.y + 8 + (i % 2) * 5);
      ctx.stroke();
    }
    ctx.fillStyle = obj.collected ? "rgba(188,210,164,0.24)" : "rgba(196,225,153,0.55)";
    ctx.beginPath();
    ctx.ellipse(obj.x + 22, obj.y + 25, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawFireflyCluster(obj) {
    const { ctx } = this;
    const hour = this.gameMinutes / 60;
    const active = hour >= 18 || hour <= 5;
    this.drawGroundShadow(obj.x + obj.w / 2, obj.y + obj.h - 2, 18, 4, 0.10);
    ctx.strokeStyle = obj.collected ? "#7c8f77" : "#5f8d56";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(obj.x + 12, obj.y + 36);
    ctx.lineTo(obj.x + 16, obj.y + 16);
    ctx.moveTo(obj.x + 28, obj.y + 36);
    ctx.lineTo(obj.x + 31, obj.y + 18);
    ctx.stroke();
    const glow = active && !obj.collected ? 0.65 + Math.sin(this.lastTime * 0.006) * 0.18 : 0.18;
    ctx.fillStyle = `rgba(238,255,172,${glow})`;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(obj.x + 10 + i * 7, obj.y + 12 + Math.sin(this.lastTime * 0.004 + i) * 7, active ? 3 : 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawHouse(obj) {
    const { ctx } = this;
    this.drawGroundShadow(obj.x + obj.w / 2, obj.y + obj.h + 4, obj.w * 0.46, 15, 0.22);
    const wall = ctx.createLinearGradient(obj.x, obj.y + 44, obj.x, obj.y + obj.h);
    wall.addColorStop(0, "#f2e8d3");
    wall.addColorStop(1, "#d7c5a8");
    this.fillRoundRect(obj.x + 8, obj.y + 50, obj.w - 16, obj.h - 50, 8, wall, "rgba(81,63,46,0.20)");
    const roof = ctx.createLinearGradient(obj.x, obj.y + 4, obj.x, obj.y + 58);
    roof.addColorStop(0, "#c87860");
    roof.addColorStop(1, "#8d4c43");
    ctx.fillStyle = roof;
    ctx.beginPath();
    ctx.moveTo(obj.x - 4, obj.y + 52);
    ctx.lineTo(obj.x + obj.w / 2, obj.y + 10);
    ctx.lineTo(obj.x + obj.w + 4, obj.y + 52);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,230,180,0.22)";
    ctx.beginPath();
    ctx.moveTo(obj.x + obj.w / 2, obj.y + 10);
    ctx.lineTo(obj.x + obj.w + 4, obj.y + 52);
    ctx.lineTo(obj.x + obj.w - 24, obj.y + 52);
    ctx.closePath();
    ctx.fill();
    this.fillRoundRect(obj.x + 66, obj.y + 94, 38, 56, 5, "#74533d");
    this.fillRoundRect(obj.x + 26, obj.y + 78, 32, 25, 5, "#c8d8d1", "rgba(47,64,58,0.16)");
    this.fillRoundRect(obj.x + 116, obj.y + 78, 32, 25, 5, "#c8d8d1", "rgba(47,64,58,0.16)");
  }

  drawShop(obj) {
    const { ctx } = this;
    this.drawGroundShadow(obj.x + obj.w / 2, obj.y + obj.h + 3, obj.w * 0.45, 14, 0.20);
    const wall = ctx.createLinearGradient(obj.x, obj.y + 42, obj.x, obj.y + obj.h);
    wall.addColorStop(0, "#e8eee8");
    wall.addColorStop(1, "#c8d3cc");
    this.fillRoundRect(obj.x, obj.y + 42, obj.w, obj.h - 42, 8, wall, "rgba(47,64,58,0.18)");
    const awning = ctx.createLinearGradient(obj.x, obj.y + 8, obj.x, obj.y + 54);
    awning.addColorStop(0, "#7697a5");
    awning.addColorStop(1, "#46697d");
    this.fillRoundRect(obj.x + 6, obj.y + 8, obj.w - 12, 45, 8, awning);
    this.fillRoundRect(obj.x + 32, obj.y + 15, 96, 24, 6, "#f0dfac");
    ctx.fillStyle = UI.ink;
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("商店", obj.x + obj.w / 2, obj.y + 32);
    ctx.textAlign = "left";
  }

  drawSign(obj) {
    const { ctx } = this;
    this.fillRoundRect(obj.x + 12, obj.y + 18, 6, 30, 3, "#8a6b47");
    this.fillRoundRect(obj.x - 2, obj.y, 34, 24, 5, "#c3a56e", "rgba(64,44,28,0.18)");
    ctx.fillStyle = "rgba(64,44,28,0.5)";
    ctx.fillRect(obj.x + 6, obj.y + 8, 18, 2);
    ctx.fillRect(obj.x + 6, obj.y + 14, 14, 2);
  }

  drawRanch(obj) {
    const { ctx } = this;
    const active = this.progress.ranchLevel > 0;
    this.drawGroundShadow(obj.x + obj.w / 2, obj.y + obj.h + 2, obj.w * 0.42, 13, 0.18);
    const barnWall = ctx.createLinearGradient(obj.x, obj.y + 24, obj.x, obj.y + obj.h);
    barnWall.addColorStop(0, active ? "#e0cba8" : "rgba(120,110,96,0.70)");
    barnWall.addColorStop(1, active ? "#b99b76" : "rgba(82,75,67,0.70)");
    this.fillRoundRect(obj.x, obj.y + 24, obj.w, obj.h - 24, 10, barnWall, "rgba(66,49,34,0.20)");
    const barnRoof = ctx.createLinearGradient(obj.x, obj.y, obj.x, obj.y + 36);
    barnRoof.addColorStop(0, active ? "#9d7460" : "#70675c");
    barnRoof.addColorStop(1, active ? "#735142" : "#585047");
    ctx.fillStyle = barnRoof;
    ctx.beginPath();
    ctx.moveTo(obj.x - 4, obj.y + 30);
    ctx.lineTo(obj.x + obj.w / 2, obj.y + 2);
    ctx.lineTo(obj.x + obj.w + 4, obj.y + 30);
    ctx.closePath();
    ctx.fill();
    this.fillRoundRect(obj.x + 14, obj.y + 54, 34, 46, 5, "#76543e");
    ctx.fillStyle = "#f6ecd1";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(active ? `${this.ranch.animals.length}/${this.getRanchCapacity()}` : "待建", obj.x + obj.w / 2 + 26, obj.y + 78);
    ctx.textAlign = "left";
  }

  drawShipping(obj) {
    const { ctx } = this;
    this.fillRoundRect(obj.x, obj.y + 8, obj.w, obj.h - 8, 8, "#8b6b4b", "rgba(56,36,24,0.24)");
    this.fillRoundRect(obj.x + 7, obj.y, obj.w - 14, 18, 6, "#a47b55");
    ctx.strokeStyle = "rgba(248,241,216,0.35)";
    ctx.beginPath();
    ctx.moveTo(obj.x + 12, obj.y + 28);
    ctx.lineTo(obj.x + obj.w - 12, obj.y + 28);
    ctx.moveTo(obj.x + 12, obj.y + 40);
    ctx.lineTo(obj.x + obj.w - 12, obj.y + 40);
    ctx.stroke();
    ctx.fillStyle = UI.cream;
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("出货", obj.x + obj.w / 2, obj.y + 32);
    ctx.textAlign = "left";
  }

  drawProjectBoard(obj) {
    const { ctx } = this;
    this.fillRoundRect(obj.x + 36, obj.y + 28, 8, obj.h - 22, 3, "#806246");
    this.fillRoundRect(obj.x, obj.y, obj.w, 48, 8, "#cbb38a", "rgba(56,36,24,0.18)");
    const open = this.getOpenProjects();
    const ready = open.some((project) => this.canCompleteProject(project));
    ctx.fillStyle = ready ? "#6f9b66" : "#7a6552";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(ready ? "可提交" : "工程", obj.x + obj.w / 2, obj.y + 22);
    ctx.fillStyle = "rgba(56,36,24,0.45)";
    ctx.font = "10px sans-serif";
    ctx.fillText(`${this.progress.projectsCompleted}/${PROJECTS.length}`, obj.x + obj.w / 2, obj.y + 38);
    ctx.textAlign = "left";
  }

  drawShell(obj) {
    const { ctx } = this;
    ctx.fillStyle = obj.collected ? "#d8ccb9" : "#e3a26f";
    ctx.beginPath();
    ctx.ellipse(obj.x + 14, obj.y + 11, 14, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.32)";
    ctx.beginPath();
    ctx.moveTo(obj.x + 7, obj.y + 11);
    ctx.lineTo(obj.x + 21, obj.y + 11);
    ctx.stroke();
  }

  drawBridge(obj) {
    const { ctx } = this;
    const repaired = this.progress.bridgeRepaired;
    this.fillRoundRect(obj.x, obj.y, obj.w, obj.h, 8, repaired ? "#a57c55" : "rgba(82,66,53,0.68)", "rgba(45,33,24,0.24)");
    ctx.fillStyle = repaired ? "#d2b083" : "rgba(214,178,133,0.42)";
    for (let i = 0; i < 5; i++) this.fillRoundRect(obj.x + 9 + i * 20, obj.y + 8, 12, obj.h - 16, 3, ctx.fillStyle);
  }

  drawWarp(obj) {
    const { ctx } = this;
    const blocked = !!this.getInteractableBlockReason(obj);
    this.fillRoundRect(obj.x, obj.y, obj.w, obj.h, 12, blocked ? "rgba(82,66,61,0.22)" : "rgba(248,241,216,0.20)", blocked ? "rgba(207,157,139,0.55)" : "rgba(248,241,216,0.78)");
    ctx.fillStyle = blocked ? "#ead1c6" : "#fff6d5";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(blocked ? "锁定" : (obj.label || "前往"), obj.x + obj.w / 2, obj.y + obj.h / 2 + 4);
    ctx.textAlign = "left";
  }

  renderNpcs() {
    const { ctx } = this;
    this.npcs.filter((npc) => npc.mapId === this.currentMapId).forEach((npc) => {
      const size = npc.size;
      const favor = this.relationship[npc.id] || 0;
      this.fillRoundRect(npc.x - size / 2, npc.y - size / 2, size, size, 8, npc.color, "rgba(255,255,255,0.26)");
      this.fillRoundRect(npc.x - size / 2 + 3, npc.y - size / 2 - 8, size - 6, 10, 4, npc.hatColor);
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      this.fillRoundRect(npc.x - 34, npc.y - size / 2 - 28, 68, 15, 7, "rgba(248,244,230,0.82)");
      ctx.fillStyle = "rgba(33,45,40,0.78)";
      ctx.fillText(`${npc.name} ${favor}`, npc.x, npc.y - size / 2 - 16);
      ctx.textAlign = "left";
    });
  }

  getFacingVector() {
    if (this.player.facing === "left") return { x: -1, y: 0 };
    if (this.player.facing === "right") return { x: 1, y: 0 };
    if (this.player.facing === "up") return { x: 0, y: -1 };
    return { x: 0, y: 1 };
  }

  getActionIcon(type, item) {
    const map = {
      plant: item ? ITEMS[item]?.icon : "🌱",
      harvest: "🧺",
      forage: "🧺",
      gift: item ? ITEMS[item]?.icon : "🎁",
      talk: "💬",
      read: "📋",
      shop: "🪙",
      buy: item ? ITEMS[item]?.icon : "🛒",
      sell: "🪙",
      ship: "📦",
      deliver: "📦",
      feed: "🌾",
      cook: "🍳",
      craft: item ? ITEMS[item]?.icon : "🔨",
      write: "✎",
      sleep: "Z",
      catch: item ? ITEMS[item]?.icon : "🐟",
    };
    return map[type] || "";
  }

  renderPlayerTool(hand, dir, side, progress) {
    const { ctx } = this;
    const action = this.actionAnimation;
    if (!action) return;
    const type = action.type;
    const swing = Math.sin(progress * Math.PI);
    const itemIcon = this.getActionIcon(type, action.item);

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (type === "hoe" || type === "axe" || type === "pickaxe" || type === "build") {
      const toolColor = type === "axe" ? "#8f5a3f" : type === "pickaxe" ? "#6f7f86" : "#8a6b4c";
      const tipX = hand.x + dir.x * (18 + swing * 10) + side.x * 5;
      const tipY = hand.y + dir.y * (18 + swing * 10) + side.y * 5;
      ctx.strokeStyle = "#7b563d";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(hand.x - dir.x * 6, hand.y - dir.y * 6);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
      ctx.strokeStyle = toolColor;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(tipX - side.x * 9, tipY - side.y * 9);
      ctx.lineTo(tipX + side.x * 9, tipY + side.y * 9);
      ctx.stroke();
    } else if (type === "water") {
      this.fillRoundRect(hand.x - 5 + dir.x * 6, hand.y - 7 + dir.y * 6, 16, 12, 4, "#6d97af", "rgba(255,255,255,0.30)");
      ctx.strokeStyle = "#446f86";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(hand.x + dir.x * 17, hand.y + dir.y * 17);
      ctx.lineTo(hand.x + dir.x * 24, hand.y + dir.y * 24);
      ctx.stroke();
    } else if (type === "cast" || type === "reel") {
      const rodEndX = hand.x + dir.x * 34 + side.x * 10;
      const rodEndY = hand.y + dir.y * 34 + side.y * 10;
      ctx.strokeStyle = "#6f4c32";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(hand.x, hand.y);
      ctx.lineTo(rodEndX, rodEndY);
      ctx.stroke();
      ctx.strokeStyle = "rgba(240,248,236,0.66)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rodEndX, rodEndY);
      ctx.quadraticCurveTo(rodEndX + dir.x * 16, rodEndY + 18, rodEndX + dir.x * 28, rodEndY + 34);
      ctx.stroke();
    } else if (itemIcon) {
      ctx.font = type === "talk" ? "20px sans-serif" : "18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(itemIcon, hand.x + dir.x * (12 + swing * 4), hand.y + dir.y * (12 + swing * 4));
      ctx.textAlign = "left";
    }
    ctx.restore();
  }

  renderPlayer() {
    const { ctx } = this;
    const { x, y, size } = this.player;
    const dir = this.getFacingVector();
    const side = { x: -dir.y, y: dir.x };
    const action = this.actionAnimation;
    const progress = this.getActionProgress();
    const actionSwing = action ? Math.sin(progress * Math.PI) : 0;
    const moving = !action && (this.keys.has("arrowup") || this.keys.has("w") || this.keys.has("arrowdown") || this.keys.has("s") || this.keys.has("arrowleft") || this.keys.has("a") || this.keys.has("arrowright") || this.keys.has("d"));
    const walk = moving ? Math.sin(this.footstepTimer * 0.18) : 0;
    const bob = moving ? Math.abs(walk) * 2 : actionSwing * 1.2;

    this.drawGroundShadow(x, y + 16, 16, 5, 0.28);

    ctx.save();
    ctx.translate(x, y - bob);

    const legSwing = moving ? walk * 4 : 0;
    this.fillRoundRect(-8 + side.x * legSwing * 0.15, 6 + side.y * 1, 7, 15, 4, "#273b46");
    this.fillRoundRect(1 - side.x * legSwing * 0.15, 6 - side.y * 1, 7, 15, 4, "#253842");

    const torsoGrad = ctx.createLinearGradient(0, -10, 0, 12);
    torsoGrad.addColorStop(0, "#5b83a0");
    torsoGrad.addColorStop(1, "#355a76");
    this.fillRoundRect(-12, -10, 24, 25, 8, torsoGrad, "rgba(255,255,255,0.28)");

    const shoulderY = -4;
    const reach = action ? 11 + actionSwing * 9 : 7;
    const armSwing = moving ? walk * 5 : actionSwing * 7;
    const leftShoulder = { x: -11, y: shoulderY };
    const rightShoulder = { x: 11, y: shoulderY };
    const activeHand = {
      x: rightShoulder.x + dir.x * reach + side.x * (2 + armSwing * 0.2),
      y: rightShoulder.y + dir.y * reach + side.y * (2 + armSwing * 0.2),
    };
    const passiveHand = {
      x: leftShoulder.x + dir.x * 6 - side.x * (2 + armSwing * 0.2),
      y: leftShoulder.y + dir.y * 6 - side.y * (2 + armSwing * 0.2),
    };
    ctx.strokeStyle = "#efc9a1";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(leftShoulder.x, leftShoulder.y);
    ctx.lineTo(passiveHand.x, passiveHand.y + (moving ? -walk : 0));
    ctx.moveTo(rightShoulder.x, rightShoulder.y);
    ctx.lineTo(activeHand.x, activeHand.y);
    ctx.stroke();

    this.renderPlayerTool({ x: activeHand.x, y: activeHand.y }, dir, side, progress);

    const faceYOffset = this.player.facing === "up" ? -2 : 0;
    this.fillRoundRect(-9, -25 + faceYOffset, 18, 15, 7, "#efc9a1", "rgba(116,80,55,0.14)");
    this.fillRoundRect(-13, -32 + faceYOffset, 26, 10, 5, "#9d5c4d");
    if (this.player.facing !== "up") {
      ctx.fillStyle = "#27312e";
      ctx.beginPath();
      ctx.arc(-4, -18 + faceYOffset, 1.4, 0, Math.PI * 2);
      ctx.arc(4, -18 + faceYOffset, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  renderActionEffects() {
    const { ctx } = this;
    const action = this.actionAnimation;
    if (!action) return;
    const progress = this.getActionProgress();
    const dir = this.getFacingVector();
    const target = action.target;

    ctx.save();
    if (action.type === "water" && target) {
      ctx.strokeStyle = "rgba(126,190,232,0.62)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 7; i++) {
        const t = (progress + i * 0.09) % 1;
        const sx = this.player.x + dir.x * 18 + (i - 3) * 2;
        const sy = this.player.y + dir.y * 18 - 8;
        const ex = sx + (target.x - sx) * t;
        const ey = sy + (target.y - sy) * t + Math.sin(t * Math.PI) * 8;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo((sx + ex) / 2, sy - 10, ex, ey);
        ctx.stroke();
      }
    }

    if ((action.type === "plant" || action.type === "feed") && target) {
      ctx.fillStyle = action.type === "feed" ? "rgba(215,185,111,0.85)" : "rgba(119,157,107,0.85)";
      for (let i = 0; i < 6; i++) {
        const t = Math.min(1, progress * 1.4 - i * 0.08);
        if (t <= 0) continue;
        ctx.beginPath();
        ctx.arc(this.player.x + (target.x - this.player.x) * t + Math.sin(i) * 4, this.player.y + (target.y - this.player.y) * t - Math.sin(t * Math.PI) * 12, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (["hoe", "axe", "pickaxe", "harvest", "forage", "build"].includes(action.type) && target) {
      ctx.strokeStyle = action.type === "harvest" || action.type === "forage" ? "rgba(249,239,209,0.56)" : "rgba(255,222,154,0.55)";
      ctx.lineWidth = 2;
      const radius = 14 + Math.sin(progress * Math.PI) * 14;
      ctx.beginPath();
      ctx.arc(target.x, target.y, radius, -Math.PI * 0.15, Math.PI * 1.15);
      ctx.stroke();
    }

    if (["gift", "deliver", "ship", "buy", "sell", "catch", "cook", "craft", "write", "sleep", "talk"].includes(action.type)) {
      const icon = this.getActionIcon(action.type, action.item);
      const y = this.player.y - 42 - Math.sin(progress * Math.PI) * 12;
      ctx.globalAlpha = Math.max(0, 1 - progress * 0.35);
      ctx.font = "20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(icon, this.player.x, y);
      ctx.textAlign = "left";
    }
    ctx.restore();
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

  drawHudPanel(x, y, w, h, accent) {
    const { ctx } = this;
    ctx.fillStyle = "rgba(16,24,20,0.8)";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = accent;
    ctx.fillRect(x, y, w, 4);
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.strokeRect(x, y, w, h);
  }

  renderMiniMap(x, y, w, h) {
    const { ctx } = this;
    const mapW = this.tileMap[0]?.length || MAP_W;
    const mapH = this.tileMap.length || MAP_H;
    const cell = Math.min((w - 18) / mapW, (h - 18) / mapH);
    const drawW = mapW * cell;
    const drawH = mapH * cell;
    const ox = x + (w - drawW) / 2;
    const oy = y + (h - drawH) / 2;

    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(ox - 4, oy - 4, drawW + 8, drawH + 8);

    for (let ty = 0; ty < mapH; ty++) {
      for (let tx = 0; tx < mapW; tx++) {
        const tile = this.tileMap[ty][tx];
        ctx.fillStyle = TILE_COLORS[tile] || "#7ec850";
        ctx.fillRect(ox + tx * cell, oy + ty * cell, Math.ceil(cell), Math.ceil(cell));
      }
    }

    this.interactables.filter((obj) => obj.type === "warp").forEach((obj) => {
      const blocked = !!this.getInteractableBlockReason(obj);
      ctx.fillStyle = blocked ? "#d58e70" : "#fff3a8";
      ctx.fillRect(ox + (obj.x / TILE_SIZE) * cell, oy + (obj.y / TILE_SIZE) * cell, Math.max(3, cell * 1.1), Math.max(3, cell * 1.1));
    });

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + (this.player.x / TILE_SIZE) * cell, oy + (this.player.y / TILE_SIZE) * cell, Math.max(3, cell * 0.9), 0, Math.PI * 2);
    ctx.fill();
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
    const world = this.getCurrentWorld();
    const season = this.getSeasonInfo();
    const festival = this.getFestivalInfo();
    const accent = season?.accent || world?.accent || UI.green;
    const exits = this.interactables.filter((obj) => obj.type === "warp").slice(0, 3);

    const topGrad = ctx.createLinearGradient(14, 12, 14, 82);
    topGrad.addColorStop(0, "rgba(33,49,45,0.94)");
    topGrad.addColorStop(1, "rgba(20,31,29,0.90)");
    this.drawSoftPanel(14, 12, canvas.width - 28, 72, { fill: topGrad, stroke: "rgba(249,239,209,0.18)", accent, blur: 20, offsetY: 8, radius: 14 });

    this.fillRoundRect(34, 25, 40, 40, 12, "rgba(249,239,209,0.12)", "rgba(249,239,209,0.16)");
    ctx.fillStyle = accent;
    ctx.font = "bold 18px 'Noto Sans SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(world?.short || "地", 54, 52);
    ctx.textAlign = "left";

    ctx.fillStyle = UI.cream;
    ctx.font = "bold 16px 'Noto Sans SC', sans-serif";
    ctx.fillText(this.getCurrentMapName(), 86, 37);
    ctx.fillStyle = "rgba(249,239,209,0.68)";
    ctx.font = "12px sans-serif";
    ctx.fillText(`${season.name}${this.getSeasonDay()}日 · 第${this.gameDay}天 · ${timeStr}`, 86, 59);

    this.fillRoundRect(258, 25, 176, 40, 10, "rgba(249,239,209,0.08)", "rgba(249,239,209,0.10)");
    ctx.fillStyle = UI.cream;
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(`${weather.icon} ${weather.name}`, 274, 42);
    ctx.fillStyle = "rgba(249,239,209,0.62)";
    ctx.font = "11px sans-serif";
    ctx.fillText(`明日 ${forecast.icon}${forecast.name}${festival ? ` · ${festival.name}` : ""}`, 274, 59);

    this.fillRoundRect(452, 25, 166, 40, 10, "rgba(249,239,209,0.08)", "rgba(249,239,209,0.10)");
    this.drawBar(468, 36, 104, 9, energyRatio, energyRatio > 0.35 ? "#8fbf73" : "#c98754", "rgba(249,239,209,0.14)");
    ctx.fillStyle = "rgba(249,239,209,0.72)";
    ctx.font = "11px sans-serif";
    ctx.fillText(`体力 ${Math.round(this.energy)}/${this.maxEnergy}`, 468, 59);

    this.fillRoundRect(638, 25, 184, 40, 10, "rgba(249,239,209,0.08)", "rgba(249,239,209,0.10)");
    ctx.fillStyle = UI.gold;
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(`${this.gold} 金`, 654, 42);
    ctx.fillStyle = "rgba(249,239,209,0.62)";
    ctx.font = "11px sans-serif";
    ctx.fillText(`镇${this.progress.townRank} 屋${this.progress.houseLevel} 农${this.progress.farmLevel} 牧${this.progress.ranchLevel} 工${this.progress.workshopLevel}`, 654, 59);

    ctx.fillStyle = activeSeed ? UI.cream : "rgba(249,239,209,0.58)";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(activeSeed ? `${ITEMS[activeSeed].icon} ${ITEMS[activeSeed].name} x${this.inventory[activeSeed]}` : "无种子", canvas.width - 30, 39);
    ctx.fillStyle = "rgba(249,239,209,0.58)";
    ctx.fillText(`工具${this.progress.toolLevel} 鱼竿${this.progress.rodLevel} · I/J`, canvas.width - 30, 60);
    ctx.textAlign = "left";

    this.drawSoftPanel(canvas.width - 184, 96, 170, 120, { fill: "rgba(23,34,32,0.74)", stroke: "rgba(249,239,209,0.14)", accent, blur: 16, offsetY: 6, radius: 12 });
    ctx.fillStyle = UI.cream;
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("小地图", canvas.width - 160, 117);
    this.renderMiniMap(canvas.width - 176, 124, 154, 66);
    ctx.fillStyle = "rgba(248,241,216,0.78)";
    ctx.font = "11px sans-serif";
    exits.forEach((warp, index) => {
      const blocked = this.getInteractableBlockReason(warp);
      const label = `${blocked ? "🔒" : "→"} ${this.worlds[warp.targetMap]?.name || warp.targetMap}`;
      ctx.fillText(label, canvas.width - 160, 198 + index * 12);
    });
  }

  renderQuestTracker() {
    const { ctx, canvas } = this;
    const active = this.quests.find(q => !q.done);
    const request = this.getPendingRequests()[0];
    const areaTask = this.currentMapId !== "town" ? this.getAreaTask(this.currentMapId) : null;
    const panelH = areaTask ? 124 : 98;
    const x = 14, y = canvas.height - panelH - 14;
    this.drawSoftPanel(x, y, 378, panelH, { fill: "rgba(24,35,32,0.76)", stroke: "rgba(249,239,209,0.14)", accent: this.getSeasonInfo().accent, blur: 18, offsetY: 6, radius: 14 });
    ctx.fillStyle = UI.cream;
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("今日节奏", x + 24, y + 25);
    ctx.fillStyle = "rgba(249,239,209,0.66)";
    ctx.font = "12px sans-serif";
    if (active) {
      ctx.fillText(`目标 · ${active.title}`, x + 24, y + 49);
      ctx.fillText(active.desc, x + 24, y + 68);
    }
    ctx.fillStyle = "rgba(249,239,209,0.88)";
    if (request) {
      const item = ITEMS[request.item];
      ctx.fillText(`委托 · ${this.getNpcName(request.requester)}要 ${item.icon} ${item.name}x${request.amount}，${request.gold}金`, x + 24, y + 87);
    } else {
      ctx.fillText("委托 · 今天都完成了", x + 24, y + 87);
    }
    if (areaTask) {
      ctx.fillStyle = this.canCompleteAreaTask(areaTask) ? "#d9e99d" : "rgba(249,239,209,0.78)";
      const status = areaTask.done ? "已完成" : this.formatAreaTaskProgress(areaTask);
      ctx.fillText(`区域 · ${areaTask.title}：${status}`, x + 24, y + 108);
    }
  }

  renderSkillPanel() {
    const { ctx, canvas } = this;
    const x = canvas.width - 338;
    const y = canvas.height - 96;
    this.drawSoftPanel(x, y, 324, 82, { fill: "rgba(22,32,30,0.78)", stroke: "rgba(249,239,209,0.14)", accent: this.getSeasonInfo().accent, blur: 18, offsetY: 6, radius: 14 });
    ctx.fillStyle = UI.cream;
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("技能", x + 20, y + 24);
    Object.keys(SKILL_INFO).forEach((key, i) => {
      const info = SKILL_INFO[key];
      const skill = this.skills[key];
      const col = i % 3;
      const row = Math.floor(i / 3);
      const rowX = x + 20 + col * 100;
      const rowY = y + 46 + row * 20;
      const need = this.getSkillXpNeed(skill.level);
      const ratio = need > 0 ? skill.xp / need : 0;
      ctx.fillStyle = "rgba(248,241,216,0.88)";
      ctx.font = "11px sans-serif";
      ctx.fillText(`${info.icon} ${info.label} ${skill.level}`, rowX, rowY);
      this.drawBar(rowX, rowY + 4, 78, 4, ratio, info.color, "rgba(255,255,255,0.16)");
    });
  }

  renderMessage() {
    const { ctx, canvas } = this;
    if (!this.interactionMessage) return;
    const maxW = canvas.width - 72;
    const text = this.interactionMessage;
    const font = "14px 'Noto Sans SC', sans-serif";
    const lines = this.wrapText(text, maxW - 42, font);
    const renderLines = lines.slice(0, 3);
    const w = Math.min(maxW, Math.max(280, ...renderLines.map((line) => ctx.measureText(line).width + 50)));
    const h = 18 + renderLines.length * 20;
    const x = (canvas.width - w) / 2;
    const y = canvas.height - h - 14;
    this.drawSoftPanel(x, y, w, h, { fill: "rgba(31,42,38,0.86)", stroke: "rgba(248,241,216,0.22)", blur: 16, offsetY: 5, radius: 14 });
    ctx.fillStyle = UI.cream;
    ctx.font = font;
    ctx.textAlign = "center";
    renderLines.forEach((line, index) => ctx.fillText(line, canvas.width / 2, y + 22 + index * 20));
    ctx.textAlign = "left";
  }

  renderTitle() {
    const { ctx, canvas } = this;
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#c9d8d0");
    grad.addColorStop(0.55, "#dbe3c8");
    grad.addColorStop(1, "#e6d1b3");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(0, 18);
    this.drawSoftPanel(94, 52, canvas.width - 188, 202, { fill: "rgba(248,244,230,0.78)", accent: "#7cae75", radius: 18, blur: 24, offsetY: 12 });
    ctx.fillStyle = UI.ink;
    ctx.font = "bold 46px 'Noto Sans SC', 'PingFang SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("晨露小镇", canvas.width / 2, 118);
    ctx.fillStyle = UI.inkSoft;
    ctx.font = "16px sans-serif";
    ctx.fillText("种植、牧场、加工坊、委托、钓鱼与四季日历", canvas.width / 2, 154);
    ctx.font = "13px sans-serif";
    ctx.fillText("一个更完整的慢生活经营原型，信息收进日志，画面留给小镇", canvas.width / 2, 184);

    const cards = [
      ["🌾", "经营农场", "解锁九种作物与农场扩建"],
      ["🐔", "照料牧场", "喂养动物，收集蛋奶羊毛"],
      ["🥣", "加工手作", "把原料做成高价商品"],
    ];
    cards.forEach((card, i) => {
      const x = 122 + i * 184;
      this.fillRoundRect(x, 286, 158, 82, 12, "rgba(248,244,230,0.62)", "rgba(255,255,255,0.42)");
      ctx.fillStyle = UI.ink;
      ctx.font = "22px sans-serif";
      ctx.fillText(card[0], x + 79, 315);
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(card[1], x + 79, 338);
      ctx.fillStyle = UI.inkSoft;
      ctx.font = "11px sans-serif";
      ctx.fillText(card[2], x + 79, 358);
    });

    if (Math.floor(this.lastTime / 500) % 2 === 0) {
      ctx.font = "bold 18px sans-serif";
      ctx.fillStyle = UI.cream;
      this.fillRoundRect(canvas.width / 2 - 92, 406, 184, 38, 18, "rgba(31,42,38,0.82)");
      ctx.fillStyle = UI.cream;
      ctx.fillText("按 Enter 开始", canvas.width / 2, 431);
    }
    ctx.restore();
    ctx.textAlign = "left";
  }

  renderDialogue() {
    const { ctx, canvas } = this;
    const text = this.dialoguePages[this.dialoguePage] || "";
    const x = 42, y = canvas.height - 142, w = canvas.width - 84, h = 112;
    this.drawSoftPanel(x, y, w, h, { fill: "rgba(248,244,230,0.94)", accent: this.dialogueTarget?.hatColor || this.getSeasonInfo().accent, radius: 16, blur: 18, offsetY: 8 });
    ctx.fillStyle = UI.ink;
    ctx.font = "bold 15px 'Noto Sans SC', sans-serif";
    ctx.fillText(this.dialogueTarget?.name || "居民", x + 28, y + 28);
    ctx.fillStyle = UI.inkSoft;
    ctx.font = "15px 'Noto Sans SC', sans-serif";
    this.wrapText(text, w - 56, "15px 'Noto Sans SC', sans-serif").slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, x + 28, y + 58 + i * 22);
    });
    ctx.fillStyle = UI.inkSoft;
    ctx.font = "13px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(this.dialoguePage >= this.dialoguePages.length - 1 ? "E 结束" : "E 下一句", x + w - 22, y + h - 18);
    ctx.textAlign = "left";
  }

  renderShop() {
    const { ctx, canvas } = this;
    const buyList = this.getShopBuyList();
    const sellList = Object.keys(this.inventory).filter(k => ITEMS[k]?.sellPrice > 0);
    const upgradeList = this.getUpgradeList();
    const list = this.shopMode === "buy" ? buyList : this.shopMode === "sell" ? sellList : upgradeList;

    const panelW = 628, panelH = 382;
    const px = (canvas.width - panelW) / 2;
    const py = (canvas.height - panelH) / 2;
    this.drawSoftPanel(px, py, panelW, panelH, { fill: "rgba(248,244,230,0.96)", accent: this.getSeasonInfo().accent, radius: 18, blur: 24, offsetY: 10 });
    ctx.fillStyle = UI.ink;
    ctx.font = "bold 20px 'Noto Sans SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("生活商店", canvas.width / 2, py + 34);

    ["buy", "sell", "upgrade"].forEach((m, i) => {
      const active = this.shopMode === m;
      this.fillRoundRect(px + 22 + i * 118, py + 54, 106, 28, 14, active ? UI.ink : "rgba(32,52,47,0.08)", active ? "" : "rgba(32,52,47,0.12)");
      ctx.fillStyle = active ? UI.cream : UI.inkSoft;
      ctx.font = "13px sans-serif";
      ctx.fillText(m === "buy" ? "购买" : m === "sell" ? "出售" : "投资", px + 75 + i * 118, py + 73);
    });

    ctx.fillStyle = UI.ink;
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(`${this.gold} 金`, px + panelW - 72, py + 34);
    ctx.textAlign = "left";

    const visible = 7;
    const start = Math.max(0, Math.min(Math.max(0, list.length - visible), this.shopSelection - Math.floor(visible / 2)));
    list.slice(start, start + visible).forEach((entry, offset) => {
      const i = start + offset;
      const y = py + 112 + offset * 34;
      const selected = i === this.shopSelection;
      if (selected) {
        this.fillRoundRect(px + 22, y - 20, panelW - 44, 30, 10, "rgba(118,164,106,0.18)");
      }
      if (this.shopMode === "upgrade") {
        const u = entry;
        ctx.fillStyle = UI.ink;
        ctx.font = "13px sans-serif";
        ctx.fillText(`${u.name}｜${u.desc}`, px + 20, y);
        const c = u.cost;
        const costText = Object.entries(c).filter(([, amount]) => amount > 0).map(([key, amount]) => key === "gold" ? `${amount}金` : `${ITEMS[key]?.name || key}${amount}`).join(" ");
        ctx.fillStyle = UI.inkSoft;
        ctx.fillText(`费用: ${costText}`, px + 378, y);
      } else {
        const key = entry;
        ctx.fillStyle = UI.ink;
        ctx.font = "13px sans-serif";
        ctx.fillText(`${ITEMS[key].icon} ${ITEMS[key].name}`, px + 34, y);
        ctx.fillStyle = UI.inkSoft;
        ctx.fillText(ITEMS[key].desc, px + 184, y);
        const price = this.shopMode === "buy" ? ITEMS[key].buyPrice : this.getSellPrice(key);
        ctx.fillStyle = UI.ink;
        ctx.textAlign = "right";
        ctx.fillText(`${price}金  持有:${this.inventory[key] || 0}`, px + panelW - 34, y);
        ctx.textAlign = "left";
      }
    });

    ctx.fillStyle = UI.inkSoft;
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    const pageText = list.length > visible ? `  ${start + 1}-${Math.min(list.length, start + visible)}/${list.length}` : "";
    ctx.fillText(`↑↓ 选择  E确认  Tab分页  ESC离开${pageText}`, canvas.width / 2, py + panelH - 20);
    ctx.textAlign = "left";
  }

  renderInventory() {
    const { ctx, canvas } = this;
    const panelW = 628, panelH = 382;
    const px = (canvas.width - panelW) / 2;
    const py = (canvas.height - panelH) / 2;
    this.drawSoftPanel(px, py, panelW, panelH, { fill: "rgba(248,244,230,0.96)", accent: this.getSeasonInfo().accent, radius: 18, blur: 24, offsetY: 10 });
    ctx.fillStyle = UI.ink;
    ctx.font = "bold 20px 'Noto Sans SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("背包与资产", canvas.width / 2, py + 34);
    ctx.fillStyle = UI.inkSoft;
    ctx.font = "12px sans-serif";
    ctx.fillText(`${this.getSeasonInfo().name} · ${this.getRanchSummary()} · 工坊Lv${this.progress.workshopLevel}`, canvas.width / 2, py + 58);
    ctx.textAlign = "left";

    const entries = Object.entries(this.inventory).sort((a, b) => (ITEMS[a[0]]?.name || a[0]).localeCompare(ITEMS[b[0]]?.name || b[0], "zh-CN"));
    const visibleEntries = entries.slice(0, 24);
    visibleEntries.forEach(([key, count], i) => {
      const col = i % 6, row = Math.floor(i / 6);
      const bx = px + 22 + col * 98, by = py + 82 + row * 62;
      this.fillRoundRect(bx, by, 88, 52, 10, "rgba(32,52,47,0.06)", "rgba(32,52,47,0.10)");
      ctx.fillStyle = UI.ink;
      ctx.font = "12px sans-serif";
      ctx.fillText(`${ITEMS[key]?.icon || "?"} ${ITEMS[key]?.name || key}`, bx + 6, by + 20);
      ctx.fillStyle = UI.inkSoft;
      ctx.fillText(`数量:${count}`, bx + 6, by + 38);
    });

    ctx.fillStyle = UI.inkSoft;
    ctx.font = "13px sans-serif";
    const overflowText = entries.length > visibleEntries.length ? `  另有 ${entries.length - visibleEntries.length} 项暂未展开。` : "";
    const totalValue = entries.reduce((sum, [key, count]) => sum + this.getSellPrice(key) * count, 0);
    ctx.textAlign = "center";
    ctx.fillText(`资产估值 ${totalValue} 金。农作物与动物产物可出售，也可进加工坊提价。${overflowText}`, canvas.width / 2, py + panelH - 20);
    ctx.textAlign = "left";
  }

  renderJournal() {
    const { ctx, canvas } = this;
    ctx.fillStyle = "rgba(20,31,28,0.42)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const panelW = 640, panelH = 382;
    const px = (canvas.width - panelW) / 2;
    const py = (canvas.height - panelH) / 2;
    this.drawSoftPanel(px, py, panelW, panelH, { fill: "rgba(248,244,230,0.96)", accent: this.getSeasonInfo().accent, radius: 18, blur: 24, offsetY: 10 });

    const tabs = ["日历", "关系", "图鉴", "工程", "经营"];
    ctx.fillStyle = UI.ink;
    ctx.font = "bold 20px 'Noto Sans SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("生活日志", canvas.width / 2, py + 34);
    tabs.forEach((tab, i) => {
      const active = i === this.journalTab;
      this.fillRoundRect(px + 24 + i * 108, py + 54, 90, 28, 14, active ? UI.ink : "rgba(32,52,47,0.08)");
      ctx.fillStyle = active ? UI.cream : UI.inkSoft;
      ctx.font = "13px sans-serif";
      ctx.fillText(tab, px + 69 + i * 108, py + 73);
    });
    ctx.textAlign = "left";

    const contentX = px + 38;
    let y = py + 112;
    if (this.journalTab === 0) {
      const season = this.getSeasonInfo();
      const festival = this.getFestivalInfo();
      ctx.fillStyle = UI.ink;
      ctx.font = "bold 17px sans-serif";
      ctx.fillText(`${season.name} · ${this.getSeasonDay()}日`, contentX, y);
      ctx.fillStyle = UI.inkSoft;
      ctx.font = "13px sans-serif";
      ctx.fillText(season.desc, contentX, y + 26);
      ctx.fillText(festival ? `今日节日：${festival.name} · ${festival.desc}` : `下一节日：${FESTIVALS.find((f) => f.day > this.getSeasonDay())?.name || FESTIVALS[0].name}`, contentX, y + 52);
      y += 88;
      FESTIVALS.forEach((event) => {
        const active = event.day === this.getSeasonDay();
        this.fillRoundRect(contentX, y - 17, 548, 28, 9, active ? "rgba(118,164,106,0.18)" : "rgba(32,52,47,0.05)");
        ctx.fillStyle = active ? UI.ink : UI.inkSoft;
        ctx.fillText(`${event.day}日 · ${event.name}：${event.desc}`, contentX + 14, y + 2);
        y += 34;
      });
    } else if (this.journalTab === 1) {
      NPCS.forEach((npc, i) => {
        const favor = this.relationship[npc.id] || 0;
        const rowX = contentX + (i % 2) * 280;
        const rowY = y + Math.floor(i / 2) * 54;
        this.fillRoundRect(rowX, rowY - 18, 250, 40, 10, "rgba(32,52,47,0.06)");
        ctx.fillStyle = UI.ink;
        ctx.font = "bold 13px sans-serif";
        ctx.fillText(npc.name, rowX + 14, rowY);
        this.drawBar(rowX + 72, rowY - 8, 128, 7, favor / 100, npc.hatColor, "rgba(32,52,47,0.12)");
        ctx.fillStyle = UI.inkSoft;
        ctx.font = "12px sans-serif";
        ctx.fillText(`${favor}/100`, rowX + 210, rowY);
      });
    } else if (this.journalTab === 2) {
      const cropCount = Object.values(CROPS).filter((crop) => this.collections.items[crop.harvest]).length;
      const fishKeys = ["fish", "nightFish", "silverFish", "goldKoi"];
      const fishCount = fishKeys.filter((key) => this.collections.items[key]).length;
      const artisanKeys = ["mayonnaise", "cheese", "jam", "cloth", "honey", "forestWax"];
      const artisanCount = artisanKeys.filter((key) => this.collections.items[key]).length;
      const resourceKeys = ["wood", "stone", "herb", "mushroom", "fern", "resin", "wildHoney", "fireflyJar", "relicShard", "crystal", "ore", "coral"];
      const resourceCount = resourceKeys.filter((key) => this.collections.items[key]).length;
      const rows = [
        ["作物", cropCount, Object.keys(CROPS).length, "解锁更多种子并完成收获"],
        ["鱼类", fishCount, fishKeys.length, "不同天气、时间、区域会出现不同鱼"],
        ["加工品", artisanCount, artisanKeys.length, "建造加工坊后制作高价商品"],
        ["资源", resourceCount, resourceKeys.length, "探索雾林、月湾和高地"],
      ];
      rows.forEach((row) => {
        this.fillRoundRect(contentX, y - 18, 548, 46, 12, "rgba(32,52,47,0.06)");
        ctx.fillStyle = UI.ink;
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(`${row[0]} ${row[1]}/${row[2]}`, contentX + 16, y);
        this.drawBar(contentX + 132, y - 9, 186, 8, row[1] / row[2], this.getSeasonInfo().accent, "rgba(32,52,47,0.12)");
        ctx.fillStyle = UI.inkSoft;
        ctx.font = "12px sans-serif";
        ctx.fillText(row[3], contentX + 336, y);
        y += 58;
      });
    } else if (this.journalTab === 3) {
      const projects = PROJECTS;
      projects.forEach((project) => {
        const done = this.getCompletedProjectIds().includes(project.id);
        const ready = !done && this.canCompleteProject(project);
        this.fillRoundRect(contentX, y - 16, 548, 32, 9, done ? "rgba(118,164,106,0.16)" : ready ? "rgba(215,184,109,0.18)" : "rgba(32,52,47,0.06)");
        ctx.fillStyle = UI.ink;
        ctx.font = "bold 12px sans-serif";
        ctx.fillText(`${done ? "完成" : ready ? "可交" : "进行"} · ${project.name}`, contentX + 14, y);
        ctx.fillStyle = UI.inkSoft;
        ctx.font = "10px sans-serif";
        ctx.fillText(done ? project.desc : this.formatRequirements(project.requirements), contentX + 150, y);
        y += 38;
      });
    } else {
      const entries = [
        `金币：${this.gold}，累计赚取：${this.progress.totalEarned}`,
        `农场 Lv${this.progress.farmLevel}，小屋 Lv${this.progress.houseLevel}，镇级 ${this.progress.townRank}`,
        `牧场 Lv${this.progress.ranchLevel}：${this.getRanchSummary()}`,
        `工具 Lv${this.progress.toolLevel}，鱼竿 Lv${this.progress.rodLevel}，水渠 Lv${this.progress.irrigationLevel}`,
        `出货 ${this.progress.shippingCount} 件 / ${this.progress.shippingValue} 金，加工 ${this.progress.artisanMade} 件`,
        `完成委托 ${this.progress.requestsCompleted}，区域委托 ${this.progress.areaTasksCompleted || 0}，小镇工程 ${this.progress.projectsCompleted}/${PROJECTS.length}`,
        `雾林声望 ${this.progress.forestRenown || 0}，遗迹碎片 ${this.progress.forestRelics || 0}，祭台祝福 ${this.progress.forestShrineBlessings || 0}`,
      ];
      const compact = entries.length > 6;
      entries.forEach((line) => {
        this.fillRoundRect(contentX, y - 16, 548, compact ? 32 : 38, 10, "rgba(32,52,47,0.06)");
        ctx.fillStyle = UI.ink;
        ctx.font = compact ? "12px sans-serif" : "13px sans-serif";
        ctx.fillText(line, contentX + 16, y + 1);
        y += compact ? 36 : 48;
      });
    }

    ctx.fillStyle = UI.inkSoft;
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Tab / ←→ 切换页面，J 或 ESC 返回", canvas.width / 2, py + panelH - 20);
    ctx.textAlign = "left";
  }

  renderFishing() {
    const { ctx, canvas } = this;
    ctx.fillStyle = "rgba(20,34,40,0.44)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const panelW = 252, panelH = 348;
    const px = canvas.width / 2 - panelW / 2;
    const py = canvas.height / 2 - panelH / 2;
    this.drawSoftPanel(px, py, panelW, panelH, { fill: "rgba(238,245,244,0.94)", accent: UI.blue, radius: 18, blur: 24, offsetY: 10 });
    ctx.fillStyle = UI.ink;
    ctx.font = "bold 18px 'Noto Sans SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("钓鱼", canvas.width / 2, py + 32);

    if (this.fishingState === "casting" || this.fishingState === "biting") {
      ctx.fillStyle = this.fishingState === "biting" ? UI.red : UI.inkSoft;
      ctx.font = "14px sans-serif";
      ctx.fillText(this.fishingState === "casting" ? "等待鱼上钩…" : "鱼咬钩了！", canvas.width / 2, py + 172);
      ctx.strokeStyle = "rgba(110,169,196,0.28)";
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, py + 170, 32 + i * 20 + Math.sin(this.lastTime * 0.003 + i) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    if (this.fishingState === "reeling") {
      const trackX = px + 54, trackY = py + 62, trackW = 34, trackH = 226;
      this.fillRoundRect(trackX, trackY, trackW, trackH, 15, "rgba(110,169,196,0.18)", "rgba(110,169,196,0.35)");
      ctx.fillStyle = UI.blue;
      ctx.beginPath();
      ctx.arc(trackX + trackW / 2, py + 50 + (this.fishingFishY / 320) * trackH, 14, 0, Math.PI * 2);
      ctx.fill();
      const barY = py + 50 + (this.fishingBarY / 320) * trackH;
      this.fillRoundRect(trackX + trackW + 12, barY, 24, (50 / 320) * trackH, 10, "rgba(118,164,106,0.62)");
      this.fillRoundRect(px + 142, py + 62, 34, 226, 15, "rgba(32,52,47,0.10)", "rgba(32,52,47,0.16)");
      this.fillRoundRect(px + 142, py + 62 + (1 - this.fishingProgress / 100) * 226, 34, Math.max(8, (this.fishingProgress / 100) * 226), 15, this.fishingProgress > 60 ? UI.green : UI.gold);
    }
    if (this.fishingState === "result" && this.fishingResult) {
      ctx.fillStyle = UI.gold;
      ctx.font = "36px serif";
      ctx.fillText(this.fishingResult.icon, canvas.width / 2, py + 160);
      ctx.fillStyle = UI.ink;
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`钓到 ${this.fishingResult.name}`, canvas.width / 2, py + 200);
      ctx.fillStyle = UI.inkSoft;
      ctx.fillText(`基础价值: ${this.fishingResult.value}`, canvas.width / 2, py + 226);
    }
    ctx.fillStyle = UI.inkSoft;
    ctx.font = "13px sans-serif";
    ctx.fillText("空格 / E 操作", canvas.width / 2, py + panelH - 20);
    ctx.textAlign = "left";
  }

  renderIndoor() {
    const { ctx, canvas } = this;
    const warmGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    warmGrad.addColorStop(0, "#ead9bd");
    warmGrad.addColorStop(1, "#b9936a");
    ctx.fillStyle = warmGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 10; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "rgba(174,126,78,0.24)" : "rgba(124,82,52,0.18)";
        ctx.fillRect(x * 80, y * 56 + 10, 80, 56);
      }
    }

    this.fillRoundRect(64, 42, 96, 68, 10, "rgba(226,238,232,0.55)", "rgba(255,255,255,0.25)");
    this.fillRoundRect(638, 54, 86, 62, 10, "rgba(226,238,232,0.48)", "rgba(255,255,255,0.22)");
    ctx.fillStyle = "rgba(70,42,18,0.12)";
    ctx.fillRect(0, 340, canvas.width, 140);

    const weather = this.getWeatherConfig();
    const forecast = WEATHER[this.tomorrowWeather] || WEATHER.sunny;
    const actions = this.getHouseActions();

    this.drawSoftPanel(34, 34, 294, 324, { fill: "rgba(248,244,230,0.90)", accent: this.getSeasonInfo().accent, radius: 18, blur: 20, offsetY: 8 });
    ctx.fillStyle = UI.ink;
    ctx.font = "bold 22px 'Noto Sans SC', sans-serif";
    ctx.fillText(`小屋 Lv${this.progress.houseLevel}`, 58, 70);
    ctx.font = "13px sans-serif";
    ctx.fillStyle = UI.inkSoft;
    ctx.fillText(`${this.getSeasonInfo().name}${this.getSeasonDay()}日 · 第${this.gameDay}天`, 58, 96);
    this.drawBar(58, 116, 205, 10, this.energy / this.maxEnergy, this.energy / this.maxEnergy > 0.35 ? UI.green : "#c98754");
    ctx.fillText(`体力 ${Math.round(this.energy)}/${this.maxEnergy}`, 58, 144);
    ctx.fillText(`${weather.icon} 今天：${weather.name}`, 58, 174);
    ctx.fillText(`明天：${forecast.icon} ${forecast.name}`, 58, 198);
    ctx.fillText(this.getFestivalInfo() ? `节日：${this.getFestivalInfo().name}` : this.isMarketDay() ? "今天是集市日" : "公告牌已刷新委托", 58, 222);
    ctx.fillText(this.currentBuff ? `料理：${this.currentBuff.label}` : "料理：无增益", 58, 246);
    ctx.fillText(`牧场：${this.getRanchSummary()}`, 58, 276);
    ctx.fillText(`工坊Lv${this.progress.workshopLevel} · 工具${this.progress.toolLevel} · 水渠${this.progress.irrigationLevel}`, 58, 300);

    this.drawSoftPanel(360, 34, 406, 324, { fill: "rgba(31,42,38,0.76)", accent: this.getSeasonInfo().accent, radius: 18, blur: 20, offsetY: 8 });
    ctx.fillStyle = UI.cream;
    ctx.font = "bold 21px 'Noto Sans SC', sans-serif";
    ctx.fillText("室内安排", 386, 70);

    const visible = 5;
    const start = Math.max(0, Math.min(Math.max(0, actions.length - visible), this.houseSelection - Math.floor(visible / 2)));
    actions.slice(start, start + visible).forEach((action, offset) => {
      const i = start + offset;
      const y = 112 + offset * 51;
      const selected = i === this.houseSelection;
      this.fillRoundRect(382, y - 24, 358, 42, 10, selected ? "rgba(248,241,216,0.18)" : "rgba(248,241,216,0.06)", selected ? "rgba(248,241,216,0.22)" : "");
      ctx.fillStyle = selected ? UI.cream : "rgba(248,241,216,0.82)";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(action.label, 396, y - 3);
      ctx.font = "11px sans-serif";
      ctx.fillStyle = "rgba(248,241,216,0.66)";
      if (action.type === "recipe" || action.type === "artisan") {
        const ingredients = Object.entries(action.recipe.ingredients).map(([key, count]) => `${ITEMS[key].name}x${count}`).join(" / ");
        const canMake = Object.entries(action.recipe.ingredients).every(([key, count]) => (this.inventory[key] || 0) >= count);
        ctx.fillText(ingredients, 396, y + 15);
        ctx.fillStyle = canMake ? "#b7d99e" : "#d99f8c";
        ctx.textAlign = "right";
        ctx.fillText(canMake ? "可制作" : "缺材料", 724, y - 3);
        ctx.textAlign = "left";
      } else {
        ctx.fillText(action.desc, 396, y + 15);
      }
    });

    this.fillRoundRect(140, 390, 520, 44, 16, "rgba(31,42,38,0.72)");
    ctx.fillStyle = UI.cream;
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    const pageText = actions.length > visible ? `  ${start + 1}-${Math.min(actions.length, start + visible)}/${actions.length}` : "";
    ctx.fillText(`W/S 或 ↑↓ 选择，E/Enter 执行，ESC 离开小屋${pageText}`, canvas.width / 2, 417);
    ctx.textAlign = "left";
    this.renderIndoorActionAnimation();
  }

  renderIndoorActionAnimation() {
    const { ctx, canvas } = this;
    const action = this.actionAnimation;
    if (!action) return;
    const progress = this.getActionProgress();
    const x = canvas.width / 2;
    const y = 318;
    const icon = this.getActionIcon(action.type, action.item);
    ctx.save();
    this.drawGroundShadow(x, y + 44, 38, 8, 0.22);
    const body = ctx.createLinearGradient(x, y - 16, x, y + 38);
    body.addColorStop(0, "#5b83a0");
    body.addColorStop(1, "#355a76");
    this.fillRoundRect(x - 17, y - 12, 34, 42, 11, body, "rgba(255,255,255,0.25)");
    this.fillRoundRect(x - 12, y - 34, 24, 22, 9, "#efc9a1", "rgba(116,80,55,0.14)");
    this.fillRoundRect(x - 17, y - 42, 34, 12, 6, "#9d5c4d");
    const stir = Math.sin(progress * Math.PI * 4);
    ctx.strokeStyle = "#efc9a1";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 15, y - 2);
    ctx.lineTo(x - 36, y + 14 + stir * 4);
    ctx.moveTo(x + 15, y - 2);
    ctx.lineTo(x + 34, y + 10 - stir * 4);
    ctx.stroke();
    this.fillRoundRect(x - 44, y + 18, 88, 18, 8, "rgba(79,54,38,0.72)");
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(icon, x, y + 16 - Math.sin(progress * Math.PI) * 12);
    if (action.type === "cook" || action.type === "craft") {
      ctx.strokeStyle = action.type === "cook" ? "rgba(255,229,172,0.60)" : "rgba(157,202,218,0.55)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(x, y + 12, 18 + i * 10 + Math.sin(progress * Math.PI * 2 + i) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
}
