// 星禾镇物语 - 重写版生活模拟核心

const WIDTH = 1120;
const HEIGHT = 720;
const TILE = 32;
const MAP_W = 80;
const MAP_H = 58;
const SAVE_KEY = "szone.stargrain.save.v2";

const SCENE = {
  TITLE: "title",
  PLAYING: "playing",
  SHOP: "shop",
  HOUSE: "house",
  WORKSHOP: "workshop",
  TOWN: "town",
  REQUESTS: "requests",
  MUSEUM: "museum",
  NPC: "npc",
  INVENTORY: "inventory",
  JOURNAL: "journal",
  MAIL: "mail",
  FISHING: "fishing",
};

const TILE_KIND = {
  GRASS: 0,
  PATH: 1,
  WATER: 2,
  SAND: 3,
  FARM: 4,
  FOREST: 5,
  STONE: 6,
  FLOWER: 7,
  BRIDGE: 8,
};

const TILE_COLORS = {
  [TILE_KIND.GRASS]: ["#86b96f", "#7fad68"],
  [TILE_KIND.PATH]: ["#d7c198", "#cdb489"],
  [TILE_KIND.WATER]: ["#5f9fba", "#4e8ca8"],
  [TILE_KIND.SAND]: ["#e7d6aa", "#d8c58f"],
  [TILE_KIND.FARM]: ["#896247", "#77543d"],
  [TILE_KIND.FOREST]: ["#5d9361", "#4f8056"],
  [TILE_KIND.STONE]: ["#8d9690", "#7d8580"],
  [TILE_KIND.FLOWER]: ["#8ec779", "#79b468"],
  [TILE_KIND.BRIDGE]: ["#a9794f", "#8f6341"],
};

const LAYOUT = {
  top: { x: 0, y: 0, w: WIDTH, h: 54 },
  world: { x: 0, y: 54, w: 820, h: 590 },
  side: { x: 820, y: 54, w: 300, h: 590 },
  bottom: { x: 0, y: 644, w: WIDTH, h: 76 },
};

const UI = {
  ink: "#1d2e2a",
  inkSoft: "#5f706a",
  paper: "#f7f0dd",
  paper2: "#efe2c4",
  line: "rgba(31,45,42,0.16)",
  dark: "#243733",
  dark2: "#192a27",
  cream: "#fff5d6",
  leaf: "#6f9b66",
  mint: "#9fcf9d",
  water: "#5e9db8",
  sky: "#a7d7f0",
  sun: "#d7ad61",
  clay: "#b47a56",
  red: "#bd6f60",
  blue: "#5d84ad",
};

const SEASONS = [
  { id: "spring", name: "春芽季", accent: "#72a86f", crops: ["turnip", "potato", "strawberry", "tea"], desc: "野花和浆果更活跃，居民喜欢收到花束。" },
  { id: "summer", name: "夏潮季", accent: "#d4a05c", crops: ["tomato", "corn", "strawberry", "tea"], desc: "海边鱼价更好，炎热天气会更消耗体力。" },
  { id: "autumn", name: "秋实季", accent: "#c78058", crops: ["potato", "corn", "pumpkin", "tea"], desc: "农作物售价提升，适合完成镇务库存。" },
  { id: "winter", name: "冬灯季", accent: "#76a9bf", crops: ["winterRoot", "tea"], desc: "普通田地生长慢，挖矿、钓稀有鱼和料理更划算。" },
];

const WEATHER = {
  sunny: { name: "晴朗", icon: "晴", autoWater: false, energy: 1, fish: 1, forage: 1 },
  rain: { name: "细雨", icon: "雨", autoWater: true, energy: 0.94, fish: 1.15, forage: 1.05 },
  windy: { name: "海风", icon: "风", autoWater: false, energy: 1, fish: 1, forage: 1.25 },
  mist: { name: "薄雾", icon: "雾", autoWater: false, energy: 0.98, fish: 1.12, forage: 1.1 },
};

const FESTIVALS = [
  { day: 7, name: "花灯市集", desc: "花、果酱、茶类礼物好感加成。" },
  { day: 14, name: "潮声夜钓", desc: "夜晚鱼类售价提升。" },
  { day: 21, name: "丰收评议", desc: "农作物与加工品售价提升。" },
  { day: 28, name: "星禾晚餐", desc: "料理恢复更多体力。" },
];

const ITEMS = {
  seed_turnip: { name: "芜菁种子", type: "seed", buy: 16 },
  seed_potato: { name: "土豆种子", type: "seed", buy: 22 },
  seed_strawberry: { name: "草莓种子", type: "seed", buy: 46 },
  seed_tomato: { name: "番茄种子", type: "seed", buy: 36 },
  seed_corn: { name: "玉米种子", type: "seed", buy: 42 },
  seed_pumpkin: { name: "南瓜种子", type: "seed", buy: 58 },
  seed_tea: { name: "茶苗", type: "seed", buy: 64 },
  seed_winterRoot: { name: "雪根种子", type: "seed", buy: 34 },
  seed_carrot: { name: "胡萝卜种子", type: "seed", buy: 20 },
  seed_blueberry: { name: "蓝莓种子", type: "seed", buy: 50 },
  seed_rice: { name: "水稻种子", type: "seed", buy: 44 },
  seed_yam: { name: "山药种子", type: "seed", buy: 48 },
  seed_snowpea: { name: "雪豆种子", type: "seed", buy: 42 },

  turnip: { name: "芜菁", type: "crop", sell: 44 },
  potato: { name: "土豆", type: "crop", sell: 58 },
  strawberry: { name: "草莓", type: "crop", sell: 92 },
  tomato: { name: "番茄", type: "crop", sell: 72 },
  corn: { name: "玉米", type: "crop", sell: 80 },
  pumpkin: { name: "南瓜", type: "crop", sell: 136 },
  teaLeaf: { name: "茶叶", type: "crop", sell: 86 },
  winterRoot: { name: "雪根", type: "crop", sell: 64 },
  carrot: { name: "胡萝卜", type: "crop", sell: 52 },
  blueberry: { name: "蓝莓", type: "crop", sell: 78 },
  rice: { name: "稻米", type: "crop", sell: 92 },
  yam: { name: "山药", type: "crop", sell: 106 },
  snowpea: { name: "雪豆", type: "crop", sell: 82 },

  wood: { name: "木材", type: "material", sell: 5, keep: true },
  stone: { name: "石料", type: "material", sell: 5, keep: true },
  fiber: { name: "纤维", type: "material", sell: 4, keep: true },
  clay: { name: "黏土", type: "material", sell: 7, keep: true },
  ore: { name: "矿石", type: "material", sell: 16, keep: true },
  crystal: { name: "晶石", type: "material", sell: 44, keep: true },
  ingot: { name: "金属锭", type: "material", sell: 86, keep: true },
  pearl: { name: "月贝珠", type: "material", sell: 120, keep: true },

  flower: { name: "野花", type: "forage", sell: 10 },
  herb: { name: "香草", type: "forage", sell: 18 },
  berry: { name: "浆果", type: "forage", sell: 16 },
  mushroom: { name: "蘑菇", type: "forage", sell: 24 },
  shell: { name: "贝壳", type: "forage", sell: 18 },
  coral: { name: "珊瑚", type: "forage", sell: 38 },
  seaweed: { name: "海藻", type: "forage", sell: 22 },
  pinecone: { name: "松果", type: "forage", sell: 14 },
  honey: { name: "花蜜", type: "artisan", sell: 74 },

  riverFish: { name: "溪鱼", type: "fish", sell: 34 },
  seaBass: { name: "海鲈", type: "fish", sell: 48 },
  nightFish: { name: "夜光鱼", type: "fish", sell: 86 },
  koi: { name: "锦鲤", type: "fish", sell: 118 },
  crab: { name: "潮蟹", type: "fish", sell: 62 },
  catfish: { name: "雨鲶", type: "fish", sell: 74 },
  tuna: { name: "蓝鳍鱼", type: "fish", sell: 128 },
  glacierTrout: { name: "冰溪鳟", type: "fish", sell: 112 },

  butterfly: { name: "斑蝶", type: "bug", sell: 28 },
  beetle: { name: "树甲", type: "bug", sell: 46 },
  firefly: { name: "萤火", type: "bug", sell: 58 },
  cicada: { name: "夏蝉", type: "bug", sell: 42 },
  snowMoth: { name: "雪蛾", type: "bug", sell: 70 },

  egg: { name: "鸡蛋", type: "ranch", sell: 38 },
  milk: { name: "牛奶", type: "ranch", sell: 68 },
  wool: { name: "羊毛", type: "ranch", sell: 82 },
  duckEgg: { name: "鸭蛋", type: "ranch", sell: 56 },
  mayo: { name: "蛋黄酱", type: "artisan", sell: 96 },
  cheese: { name: "奶酪", type: "artisan", sell: 142 },
  jam: { name: "浆果酱", type: "artisan", sell: 120 },
  tea: { name: "星禾茶", type: "artisan", sell: 150 },
  cloth: { name: "布料", type: "artisan", sell: 150 },
  pickles: { name: "腌菜罐", type: "artisan", sell: 126 },
  flour: { name: "米粉", type: "artisan", sell: 138 },
  riceCake: { name: "年糕", type: "artisan", sell: 188 },
  fruitWine: { name: "果酒", type: "artisan", sell: 230 },
  bait: { name: "鱼饵", type: "tool", sell: 8, keep: true },
  hay: { name: "干草", type: "ranch", sell: 4, keep: true },

  salad: { name: "森林沙拉", type: "food", energy: 35 },
  stew: { name: "丰收炖菜", type: "food", energy: 48 },
  seaSnack: { name: "海风小食", type: "food", energy: 42 },
  riceBowl: { name: "山药饭", type: "food", energy: 46 },
  berryCake: { name: "蓝莓蛋糕", type: "food", energy: 54 },
  moonSoup: { name: "月湾汤", type: "food", energy: 62 },
};

const CROPS = {
  turnip: { name: "芜菁", seed: "seed_turnip", harvest: "turnip", days: 3, seasons: ["spring"], xp: 5 },
  potato: { name: "土豆", seed: "seed_potato", harvest: "potato", days: 4, seasons: ["spring", "autumn"], xp: 6 },
  strawberry: { name: "草莓", seed: "seed_strawberry", harvest: "strawberry", days: 6, regrow: 3, seasons: ["spring", "summer"], xp: 8 },
  tomato: { name: "番茄", seed: "seed_tomato", harvest: "tomato", days: 5, regrow: 3, seasons: ["summer"], xp: 7 },
  corn: { name: "玉米", seed: "seed_corn", harvest: "corn", days: 6, regrow: 4, seasons: ["summer", "autumn"], xp: 8 },
  pumpkin: { name: "南瓜", seed: "seed_pumpkin", harvest: "pumpkin", days: 7, seasons: ["autumn"], xp: 10 },
  tea: { name: "茶树", seed: "seed_tea", harvest: "teaLeaf", days: 5, regrow: 4, seasons: ["spring", "summer", "autumn", "winter"], xp: 8 },
  winterRoot: { name: "雪根", seed: "seed_winterRoot", harvest: "winterRoot", days: 4, seasons: ["winter"], xp: 7 },
  carrot: { name: "胡萝卜", seed: "seed_carrot", harvest: "carrot", days: 4, seasons: ["spring"], xp: 6 },
  blueberry: { name: "蓝莓", seed: "seed_blueberry", harvest: "blueberry", days: 7, regrow: 3, seasons: ["summer"], xp: 9 },
  rice: { name: "水稻", seed: "seed_rice", harvest: "rice", days: 6, seasons: ["summer", "autumn"], xp: 8 },
  yam: { name: "山药", seed: "seed_yam", harvest: "yam", days: 6, seasons: ["autumn"], xp: 9 },
  snowpea: { name: "雪豆", seed: "seed_snowpea", harvest: "snowpea", days: 5, regrow: 3, seasons: ["winter"], xp: 8 },
};

const SEED_TO_CROP = Object.fromEntries(Object.values(CROPS).map((crop) => [crop.seed, crop]));

const TOOLS = [
  { id: "hand", name: "手", hint: "采收/拾取/交谈", energy: 0 },
  { id: "hoe", name: "锄头", hint: "翻地", energy: 4 },
  { id: "seed", name: "种子", hint: "播种", energy: 1 },
  { id: "water", name: "水壶", hint: "浇水", energy: 2 },
  { id: "axe", name: "斧头", hint: "砍树", energy: 6 },
  { id: "pick", name: "矿镐", hint: "敲石", energy: 6 },
  { id: "rod", name: "钓竿", hint: "钓鱼", energy: 7 },
  { id: "net", name: "捕虫网", hint: "捕虫", energy: 3 },
];

const VILLAGERS = [
  { id: "lin", name: "林秋", role: "花店学徒", color: "#d889a0", loves: ["flower", "tea", "jam"], talks: ["今天的花开得很齐，像有人把清晨整理过一遍。", "如果你种出茶叶，记得留一点给镇上的茶会。"] },
  { id: "lan", name: "阿岚", role: "码头管理员", color: "#6093b6", loves: ["seaBass", "crab", "shell", "coral"], talks: ["涨潮前的海面最安静，适合把线抛远一点。", "码头修好后，外来的商船会更常靠岸。"] },
  { id: "shi", name: "石川", role: "木匠", color: "#9a7358", loves: ["wood", "stone", "ingot"], talks: ["好镇子不是一天建成的，但每天都能多钉一块板。", "矿石别急着卖，加工成锭会更有用。"] },
  { id: "miya", name: "米芽", role: "杂货店主", color: "#c2934d", loves: ["strawberry", "pumpkin", "honey"], talks: ["今天的货架换了季节种子，别买错时令。", "居民委托做得越多，商队越愿意给星禾镇让价。"] },
  { id: "ye", name: "叶生", role: "林务员", color: "#5d9a67", loves: ["herb", "mushroom", "firefly"], talks: ["森林会记住温柔的人，也会奖励勤快的人。", "起雾的晚上，萤火比平时更容易看见。"] },
  { id: "su", name: "苏白", role: "牧场主", color: "#8b8fb9", loves: ["egg", "milk", "cheese"], talks: ["动物吃饱后，产物会更稳定。", "别把干草全卖了，雨季前最好多留一点。"] },
];

const REQUESTS = [
  { id: "wood", title: "修路木料", npc: "shi", item: "wood", amount: [6, 10], gold: 92, favor: 7, minRank: 1 },
  { id: "flower", title: "集市花束", npc: "lin", item: "flower", amount: [2, 4], gold: 70, favor: 8, minRank: 1 },
  { id: "fish", title: "码头鱼筐", npc: "lan", item: "riverFish", amount: [1, 3], gold: 110, favor: 8, minRank: 1 },
  { id: "stone", title: "广场石料", npc: "shi", item: "stone", amount: [8, 12], gold: 104, favor: 6, minRank: 1 },
  { id: "berry", title: "果酱试作", npc: "miya", item: "berry", amount: [3, 5], gold: 118, favor: 8, minRank: 1 },
  { id: "herb", title: "森林药草包", npc: "ye", item: "herb", amount: [2, 4], gold: 118, favor: 8, minRank: 2 },
  { id: "shell", title: "贝壳装饰", npc: "lan", item: "shell", amount: [3, 5], gold: 128, favor: 7, minRank: 2 },
  { id: "egg", title: "早餐订单", npc: "su", item: "egg", amount: [2, 4], gold: 132, favor: 7, minRank: 2 },
  { id: "tea", title: "茶会备货", npc: "lin", item: "teaLeaf", amount: [2, 4], gold: 170, favor: 9, minRank: 3 },
  { id: "ore", title: "矿石样本", npc: "shi", item: "ore", amount: [4, 6], gold: 180, favor: 8, minRank: 3 },
  { id: "mayo", title: "野餐酱料", npc: "miya", item: "mayo", amount: [1, 2], gold: 210, favor: 10, minRank: 3 },
  { id: "firefly", title: "萤火观察", npc: "ye", item: "firefly", amount: [1, 2], gold: 190, favor: 10, minRank: 3 },
  { id: "cheese", title: "奶酪拼盘", npc: "su", item: "cheese", amount: [1, 2], gold: 250, favor: 11, minRank: 4 },
  { id: "koi", title: "镇馆锦鲤", npc: "lan", item: "koi", amount: [1, 1], gold: 320, favor: 12, minRank: 4 },
  { id: "blueberry", title: "蓝莓甜点", npc: "miya", item: "blueberry", amount: [3, 5], gold: 190, favor: 9, minRank: 3 },
  { id: "rice", title: "食堂米袋", npc: "su", item: "rice", amount: [2, 4], gold: 210, favor: 9, minRank: 3 },
  { id: "catfish", title: "雨天鱼样", npc: "lan", item: "catfish", amount: [1, 2], gold: 230, favor: 10, minRank: 3 },
  { id: "pickles", title: "腌菜订货", npc: "miya", item: "pickles", amount: [1, 2], gold: 260, favor: 11, minRank: 4 },
  { id: "pearl", title: "月贝珠研究", npc: "lin", item: "pearl", amount: [1, 1], gold: 380, favor: 13, minRank: 5 },
  { id: "wine", title: "庆典果酒", npc: "shi", item: "fruitWine", amount: [1, 2], gold: 420, favor: 13, minRank: 5 },
];

const PROJECTS = [
  { id: "garden", name: "公共花园", desc: "居民会送来更多花与香草，商店解锁茶苗。", req: { wood: 18, flower: 6, stone: 8 }, reward: { gold: 140, item: "seed_tea", amount: 4, rank: 1 } },
  { id: "bridge", name: "河桥修复", desc: "森林和海滩之间的路线更顺，采集点增加。", req: { wood: 32, stone: 18 }, reward: { gold: 220, rank: 1 } },
  { id: "dock", name: "月湾码头", desc: "海鱼与夜鱼概率提高，码头出现商队订单。", req: { wood: 26, shell: 6, coral: 2, seaBass: 2 }, reward: { gold: 260, rank: 1 } },
  { id: "coop", name: "牧场合作社", desc: "可在商店购买动物，干草售价降低。", req: { wood: 30, stone: 22, hay: 10 }, reward: { gold: 180, rank: 1 } },
  { id: "canal", name: "灌溉水渠", desc: "每天自动浇灌一批田地，雨天收益更稳。", req: { stone: 38, clay: 8, crystal: 2 }, reward: { gold: 260, rank: 1 } },
  { id: "museum", name: "博物馆侧厅", desc: "捐赠奖励提升，小镇评价更容易上升。", req: { wood: 24, stone: 24, crystal: 3, butterfly: 1 }, reward: { gold: 300, rank: 1 } },
  { id: "mineCart", name: "山道矿车", desc: "挖矿体力消耗降低，稀有晶石概率提高。", req: { wood: 30, stone: 42, ore: 10, ingot: 2 }, reward: { gold: 360, rank: 1 } },
  { id: "artisan", name: "手作摊位", desc: "加工品售价提高，居民委托会要求高级商品。", req: { jam: 2, mayo: 2, cheese: 1, cloth: 1 }, reward: { gold: 420, rank: 1 } },
  { id: "seedBank", name: "种子档案室", desc: "商店会进更多地方品种，季节轮换时也能买到备播种子。", req: { carrot: 4, blueberry: 3, rice: 3, yam: 2 }, reward: { gold: 360, item: "seed_snowpea", amount: 4, rank: 1 } },
  { id: "greenhouse", name: "温室玻璃房", desc: "农场可无视季节播种，冬天也能稳定经营作物。", req: { wood: 46, stone: 36, crystal: 5, ingot: 3 }, reward: { gold: 520, rank: 1 } },
  { id: "festivalStage", name: "星灯舞台", desc: "节日奖励提高，居民好感会带来更多回礼。", req: { wood: 42, cloth: 2, tea: 2, honey: 3 }, reward: { gold: 480, rank: 1 } },
  { id: "pearlDiving", name: "月湾潜水台", desc: "海滩会出现月贝珠，稀有海鱼概率进一步提高。", req: { wood: 36, coral: 6, pearl: 1, ingot: 2 }, reward: { gold: 560, rank: 1 } },
];

const RECIPES = [
  { id: "mayo", name: "蛋黄酱", station: "workshop", ingredients: { egg: 1 }, result: "mayo", amount: 1, xp: 5 },
  { id: "cheese", name: "奶酪", station: "workshop", ingredients: { milk: 1 }, result: "cheese", amount: 1, xp: 7 },
  { id: "jam", name: "浆果酱", station: "workshop", ingredients: { berry: 3 }, result: "jam", amount: 1, xp: 6 },
  { id: "tea", name: "星禾茶", station: "workshop", ingredients: { teaLeaf: 2, honey: 1 }, result: "tea", amount: 1, xp: 8 },
  { id: "ingot", name: "金属锭", station: "workshop", ingredients: { ore: 3, stone: 1 }, result: "ingot", amount: 1, xp: 6 },
  { id: "cloth", name: "布料", station: "workshop", ingredients: { wool: 1, fiber: 3 }, result: "cloth", amount: 1, xp: 8 },
  { id: "bait", name: "鱼饵", station: "workshop", ingredients: { fiber: 2, shell: 1 }, result: "bait", amount: 4, xp: 4 },
  { id: "pickles", name: "腌菜罐", station: "workshop", ingredients: { carrot: 1, yam: 1 }, result: "pickles", amount: 1, xp: 7 },
  { id: "flour", name: "米粉", station: "workshop", ingredients: { rice: 2 }, result: "flour", amount: 1, xp: 6 },
  { id: "riceCake", name: "年糕", station: "workshop", ingredients: { flour: 1, honey: 1 }, result: "riceCake", amount: 1, xp: 8 },
  { id: "fruitWine", name: "果酒", station: "workshop", ingredients: { blueberry: 3, berry: 2 }, result: "fruitWine", amount: 1, xp: 10 },
  { id: "salad", name: "森林沙拉", station: "house", ingredients: { herb: 1, mushroom: 1, berry: 1 }, result: "salad", amount: 1, xp: 4 },
  { id: "stew", name: "丰收炖菜", station: "house", ingredients: { potato: 1, turnip: 1, egg: 1 }, result: "stew", amount: 1, xp: 6 },
  { id: "seaSnack", name: "海风小食", station: "house", ingredients: { riverFish: 1, shell: 1, herb: 1 }, result: "seaSnack", amount: 1, xp: 5 },
  { id: "riceBowl", name: "山药饭", station: "house", ingredients: { rice: 1, yam: 1 }, result: "riceBowl", amount: 1, xp: 5 },
  { id: "berryCake", name: "蓝莓蛋糕", station: "house", ingredients: { blueberry: 2, egg: 1, flour: 1 }, result: "berryCake", amount: 1, xp: 7 },
  { id: "moonSoup", name: "月湾汤", station: "house", ingredients: { seaBass: 1, seaweed: 1, snowpea: 1 }, result: "moonSoup", amount: 1, xp: 8 },
];

const SHOP_TABS = ["种子", "工具", "牧场", "装饰"];
const SIDE_TABS = ["目标", "居民", "背包", "图鉴"];
const JOURNAL_TABS = ["日历", "经营", "技能", "工程", "收藏", "成就"];
const COLLECTION_TYPES = ["fish", "bug", "forage", "material", "crop", "artisan", "ranch"];

const SKILL_THRESHOLDS = [0, 24, 70, 150, 280, 460];
const SKILLS = {
  farming: { name: "耕作", color: "#6f9b66", reward: (level) => ({ maxEnergy: level % 2 === 0 ? 2 : 0, item: "seed_carrot", amount: level }) },
  fishing: { name: "垂钓", color: "#5e9db8", reward: (level) => ({ gold: 22 * level, item: "bait", amount: 2 + level }) },
  foraging: { name: "采集", color: "#75a65b", reward: (level) => ({ item: level >= 4 ? "honey" : "fiber", amount: level }) },
  mining: { name: "采矿", color: "#858e88", reward: (level) => ({ item: level >= 3 ? "ore" : "stone", amount: level + 1 }) },
  crafting: { name: "手作", color: "#c2934d", reward: (level) => ({ gold: 28 * level, item: level >= 4 ? "ingot" : "fiber", amount: 1 }) },
  social: { name: "社交", color: "#d889a0", reward: (level) => ({ gold: 18 * level, decor: level >= 4 ? 1 : 0 }) },
  nature: { name: "自然", color: "#9b7cc6", reward: (level) => ({ item: level >= 3 ? "flower" : "berry", amount: level }) },
};

const ACHIEVEMENTS = [
  { id: "firstHarvest", title: "第一篮收获", desc: "累计收获 8 件作物。", reward: { gold: 80, item: "seed_carrot", amount: 4 }, done: (g) => g.stats.harvested >= 8 },
  { id: "dailySupplier", title: "可靠的供货人", desc: "累计出货 25 件商品。", reward: { gold: 150 }, done: (g) => g.stats.shipped >= 25 },
  { id: "angler", title: "熟悉水纹", desc: "钓到 10 条鱼。", reward: { gold: 120, item: "bait", amount: 8 }, done: (g) => g.stats.fish >= 10 },
  { id: "bugBook", title: "林间观察者", desc: "捕虫 8 次。", reward: { gold: 90, item: "flower", amount: 3 }, done: (g) => g.stats.bugs >= 8 },
  { id: "neighbor", title: "街坊熟人", desc: "任意居民好感达到 45。", reward: { gold: 120, decor: 1 }, done: (g) => Math.max(...Object.values(g.relationships)) >= 45 },
  { id: "requestRunner", title: "公告牌常客", desc: "完成 8 个每日委托。", reward: { gold: 220, item: "tea", amount: 1 }, done: (g) => g.stats.requests >= 8 },
  { id: "artisanStart", title: "手作开张", desc: "制作 12 件物品。", reward: { gold: 180, item: "ore", amount: 3 }, done: (g) => g.stats.crafted >= 12 },
  { id: "collector", title: "图鉴启封", desc: "发现 18 种物品。", reward: { gold: 200, item: "crystal", amount: 1 }, done: (g) => Object.keys(g.collections).length >= 18 },
  { id: "museumFriend", title: "博物馆之友", desc: "捐赠 10 件藏品。", reward: { gold: 260, decor: 1 }, done: (g) => g.stats.donated >= 10 },
  { id: "builder", title: "镇务骨干", desc: "完成 5 个镇务工程。", reward: { gold: 360, item: "ingot", amount: 2 }, done: (g) => Object.values(g.projects).filter(Boolean).length >= 5 },
  { id: "rancher", title: "牧场清晨", desc: "拥有 3 只动物。", reward: { gold: 180, item: "hay", amount: 20 }, done: (g) => g.animals.length >= 3 },
  { id: "rankFour", title: "被看见的小镇", desc: "小镇评价达到 4 级。", reward: { gold: 420, item: "seed_blueberry", amount: 5 }, done: (g) => g.townRank >= 4 },
];

const MAIL_TEMPLATES = [
  { id: "welcome", from: "镇务所", title: "欢迎来到星禾镇", body: "先把小屋前的田地整理起来。出货箱会在夜里结算，材料可以留着做工程。", reward: { item: "seed_carrot", amount: 3 }, condition: (g) => g.day >= 1 },
  { id: "first-rain", from: "阿岚", title: "雨天钓鱼", body: "下雨时溪鱼会靠近岸边，也更容易遇到雨鲶。带上鱼饵会轻松不少。", reward: { item: "bait", amount: 4 }, condition: (g) => g.weather === "rain" || g.tomorrowWeather === "rain" },
  { id: "garden-mail", from: "林秋", title: "公共花园的回礼", body: "花园修好以后，大家都觉得广场柔和了许多。这里有一些适合茶会的苗。", reward: { item: "seed_tea", amount: 3 }, condition: (g) => g.projects.garden },
  { id: "coop-mail", from: "苏白", title: "牧场合作社开张", body: "动物不只带来产物，也会让每天更有规律。记得提前准备干草。", reward: { item: "hay", amount: 12 }, condition: (g) => g.projects.coop },
  { id: "rank-two", from: "米芽", title: "商队留言", body: "小镇评价升上来以后，外来的货车开始问这里要不要更多种子。", reward: { item: "seed_blueberry", amount: 3 }, condition: (g) => g.townRank >= 2 },
  { id: "greenhouse-tip", from: "石川", title: "温室图纸角注", body: "如果你想把冬天也过得热闹，温室会是最硬的一块骨头，也是最值的一块玻璃。", reward: { item: "stone", amount: 10 }, condition: (g) => Object.values(g.projects).filter(Boolean).length >= 4 },
  { id: "collector-note", from: "博物馆", title: "新的展柜", body: "你带来的藏品让展柜终于有了故事。继续收集鱼、虫、矿物和作物吧。", reward: { gold: 120 }, condition: (g) => g.stats.donated >= 5 },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function tileKey(tx, ty) {
  return `${tx},${ty}`;
}

function makeRng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick(list, rng) {
  return list[Math.floor(rng() * list.length)];
}

function itemName(id) {
  return ITEMS[id]?.name || id;
}

function formatReq(req) {
  return Object.entries(req).map(([id, amount]) => `${itemName(id)}x${amount}`).join(" / ");
}

function hasAll(inventory, req) {
  return Object.entries(req).every(([id, amount]) => (inventory[id] || 0) >= amount);
}

export class CozyPrototypeGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.canvas.width = WIDTH;
    this.canvas.height = HEIGHT;
    this.heldKeys = new Set();
    this.lastTime = 0;
    this.running = false;
    this.hasSave = Boolean(localStorage.getItem(SAVE_KEY));
    this.bindInput();
    this.newGame();
  }

  start() {
    if (this.running) return;
    this.running = true;
    requestAnimationFrame((time) => this.loop(time));
  }

  loop(time) {
    const dt = Math.min(0.05, (time - this.lastTime) / 1000 || 0);
    this.lastTime = time;
    this.update(dt);
    this.render();
    if (this.running) requestAnimationFrame((next) => this.loop(next));
  }

  bindInput() {
    window.addEventListener("keydown", (event) => {
      const key = this.normalizeKey(event);
      const managed = ["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", "shift", "space", "tab", "enter", "escape", "q", "r", "i", "j", "f5"].includes(key) || /^[1-8]$/.test(key);
      if (managed) event.preventDefault();
      this.heldKeys.add(key);
      if (!event.repeat) this.handleKeyDown(key);
    });

    window.addEventListener("keyup", (event) => {
      this.heldKeys.delete(this.normalizeKey(event));
    });
  }

  normalizeKey(event) {
    if (event.key === " ") return "space";
    return event.key.toLowerCase();
  }

  newGame(startPlaying = false) {
    this.scene = startPlaying ? SCENE.PLAYING : SCENE.TITLE;
    this.menuIndex = 0;
    this.menuTab = 0;
    this.sideTab = 0;
    this.journalTab = 0;
    this.day = 1;
    this.minute = 6 * 60;
    this.weather = "sunny";
    this.tomorrowWeather = "rain";
    this.gold = 420;
    this.energy = 104;
    this.maxEnergy = 104;
    this.player = { x: 16 * TILE + 16, y: 22 * TILE + 16, dir: "down", speed: 158, step: 0 };
    this.camera = { x: 0, y: 0 };
    this.selectedTool = 0;
    this.selectedSeed = "seed_turnip";
    this.inventory = {
      seed_turnip: 6,
      seed_potato: 4,
      wood: 10,
      stone: 8,
      hay: 6,
      berry: 2,
    };
    this.shipping = {};
    this.relationships = Object.fromEntries(VILLAGERS.map((npc) => [npc.id, 8]));
    this.giftedToday = {};
    this.projects = {};
    this.achievements = {};
    this.skillRewards = {};
    this.mail = [];
    this.collections = {};
    this.donated = {};
    this.animals = [];
    this.decor = 0;
    this.houseLevel = 1;
    this.toolLevel = 1;
    this.rodLevel = 1;
    this.townRank = 1;
    this.stats = {
      earned: 0,
      shipped: 0,
      harvested: 0,
      fish: 0,
      bugs: 0,
      requests: 0,
      crafted: 0,
      donated: 0,
      daysPlayed: 0,
      farming: 0,
      fishing: 0,
      foraging: 0,
      mining: 0,
      crafting: 0,
      social: 0,
      nature: 0,
    };
    this.messages = [];
    this.lastReport = null;
    this.activeNpc = null;
    this.fishing = null;
    this.map = [];
    this.plots = [];
    this.resources = [];
    this.objects = [];
    this.npcs = [];
    this.createMap();
    this.createPlots();
    this.createObjects();
    this.createNpcs();
    this.generateDailyContent();
    this.generateResources();
    this.refreshMail();
    this.checkAchievements();
    this.pushMessage("欢迎来到星禾镇。先整理农田，再拜访居民。");
  }

  createMap() {
    for (let y = 0; y < MAP_H; y++) {
      const row = [];
      for (let x = 0; x < MAP_W; x++) {
        let kind = TILE_KIND.GRASS;
        if (x < 24 && y < 18) kind = TILE_KIND.FOREST;
        if (x > 58 && y < 23) kind = TILE_KIND.STONE;
        if (y > 43) kind = TILE_KIND.SAND;
        if (y > 51) kind = TILE_KIND.WATER;
        if (x >= 9 && x <= 29 && y >= 17 && y <= 33) kind = TILE_KIND.FARM;
        if (x >= 37 && x <= 58 && y >= 15 && y <= 33) kind = TILE_KIND.GRASS;
        if ((x >= 16 && x <= 58 && y === 25) || (y >= 18 && y <= 41 && x === 48)) kind = TILE_KIND.PATH;
        if ((x >= 35 && x <= 58 && y === 20) || (x >= 41 && x <= 55 && y === 30)) kind = TILE_KIND.PATH;
        if (x >= 44 && x <= 46 && y < 43) kind = TILE_KIND.WATER;
        if (x >= 43 && x <= 47 && y >= 24 && y <= 27) kind = TILE_KIND.BRIDGE;
        if (x >= 49 && x <= 57 && y >= 44 && y <= 46) kind = TILE_KIND.PATH;
        if (x >= 3 && x <= 12 && y >= 36 && y <= 39) kind = TILE_KIND.FLOWER;
        row.push(kind);
      }
      this.map.push(row);
    }
  }

  createPlots() {
    for (let y = 22; y <= 27; y++) {
      for (let x = 12; x <= 19; x++) {
        this.plots.push({ tx: x, ty: y, tilled: false, watered: false, crop: null, age: 0, quality: 0 });
      }
    }
  }

  createObjects() {
    const b = (id, name, action, tx, ty, tw, th, color, roof) => ({
      kind: "building",
      id,
      name,
      action,
      x: tx * TILE,
      y: ty * TILE,
      w: tw * TILE,
      h: th * TILE,
      color,
      roof,
      blocks: true,
    });
    this.objects = [
      b("home", "小屋", "house", 10, 14, 5, 4, "#d7b486", "#9d5c4d"),
      b("shop", "杂货店", "shop", 39, 16, 5, 4, "#e0c78e", "#b57949"),
      b("townhall", "镇务所", "town", 50, 16, 6, 5, "#d9c6a4", "#6d8b74"),
      b("board", "公告牌", "requests", 47, 22, 2, 2, "#a77a4e", "#7a553d"),
      b("workshop", "工坊", "workshop", 41, 28, 5, 4, "#c69a72", "#7d6f61"),
      b("museum", "博物馆", "museum", 56, 27, 5, 4, "#c5ced0", "#587c8c"),
      b("ranch", "牧场棚", "ranch", 28, 31, 6, 4, "#d9b787", "#8b6d55"),
      b("mine", "山洞", "mine", 68, 12, 5, 4, "#858e88", "#59615d"),
      b("dock", "月湾码头", "dock", 51, 45, 7, 2, "#aa7a50", "#8e6342"),
      b("shipping", "出货箱", "shipping", 20, 19, 2, 2, "#ba7955", "#795241"),
    ];
  }

  createNpcs() {
    const positions = {
      lin: [38, 22],
      lan: [56, 45],
      shi: [43, 31],
      miya: [41, 21],
      ye: [14, 12],
      su: [31, 34],
    };
    this.npcs = VILLAGERS.map((npc, index) => ({
      ...npc,
      x: positions[npc.id][0] * TILE + 16,
      y: positions[npc.id][1] * TILE + 16,
      homeX: positions[npc.id][0] * TILE + 16,
      homeY: positions[npc.id][1] * TILE + 16,
      phase: index * 0.6,
    }));
  }

  generateDailyContent() {
    const rng = makeRng(this.day * 97 + this.townRank * 131);
    const pool = REQUESTS.filter((request) => request.minRank <= this.townRank);
    this.dailyRequests = [];
    const used = new Set();
    const count = clamp(3 + Math.floor(this.townRank / 2), 3, 5);
    while (this.dailyRequests.length < count && used.size < pool.length) {
      const template = pick(pool, rng);
      if (used.has(template.id)) continue;
      used.add(template.id);
      const amount = template.amount[0] + Math.floor(rng() * (template.amount[1] - template.amount[0] + 1));
      this.dailyRequests.push({
        ...template,
        amount,
        done: false,
        gold: Math.round(template.gold * (1 + (this.townRank - 1) * 0.08) * WEATHER[this.weather].forage),
      });
    }
    this.giftedToday = {};
  }

  generateResources() {
    const rng = makeRng(this.day * 1009 + this.getSeasonIndex() * 251);
    const resources = [];
    const add = (type, tx, ty, item, amount = 1, tool = "hand", blocks = false) => {
      resources.push({
        id: `${type}-${tx}-${ty}-${this.day}-${resources.length}`,
        kind: type,
        type,
        item,
        amount,
        tool,
        blocks,
        x: tx * TILE + 16,
        y: ty * TILE + 18,
        tx,
        ty,
        sway: rng() * Math.PI * 2,
      });
    };

    for (let i = 0; i < 58; i++) {
      const tx = 2 + Math.floor(rng() * 22);
      const ty = 2 + Math.floor(rng() * 34);
      if (this.map[ty]?.[tx] === TILE_KIND.FOREST && rng() > 0.18) add("tree", tx, ty, "wood", 2 + Math.floor(rng() * 3), "axe", true);
    }
    for (let i = 0; i < 34; i++) {
      const tx = 59 + Math.floor(rng() * 18);
      const ty = 4 + Math.floor(rng() * 26);
      if (this.map[ty]?.[tx] === TILE_KIND.STONE) {
        const roll = rng();
        const item = roll > 0.88 || (this.projects.mineCart && roll > 0.78) ? "crystal" : roll > 0.6 ? "ore" : "stone";
        add(item === "stone" ? "rock" : "ore", tx, ty, item, 1 + Math.floor(rng() * 3), "pick", true);
      }
    }
    for (let i = 0; i < 24; i++) {
      const tx = 3 + Math.floor(rng() * 24);
      const ty = 3 + Math.floor(rng() * 34);
      const forestPool = this.getSeason().id === "autumn"
        ? ["flower", "herb", "berry", "mushroom", "mushroom", "pinecone"]
        : this.getSeason().id === "winter"
          ? ["herb", "mushroom", "pinecone", "pinecone", "snowpea"]
          : ["flower", "herb", "berry", "mushroom", "pinecone"];
      const item = pick(forestPool, rng);
      if (this.map[ty]?.[tx] !== TILE_KIND.WATER) add("forage", tx, ty, item, 1, "hand");
    }
    for (let i = 0; i < 14; i++) {
      const tx = 49 + Math.floor(rng() * 20);
      const ty = 44 + Math.floor(rng() * 7);
      const roll = rng();
      const item = this.projects.pearlDiving && roll > 0.9 ? "pearl" : roll > 0.7 ? "coral" : roll > 0.42 ? "seaweed" : "shell";
      add("forage", tx, ty, item, 1, "hand");
    }
    for (let i = 0; i < 16; i++) {
      const evening = this.minute > 18 * 60;
      const tx = 5 + Math.floor(rng() * 30);
      const ty = 4 + Math.floor(rng() * 34);
      const season = this.getSeason().id;
      const item = season === "winter"
        ? (rng() > 0.62 ? "snowMoth" : "beetle")
        : season === "summer"
          ? (evening && rng() > 0.48 ? "firefly" : rng() > 0.42 ? "cicada" : "butterfly")
          : evening && rng() > 0.45 ? "firefly" : rng() > 0.45 ? "beetle" : "butterfly";
      add("bug", tx, ty, item, 1, "net");
    }
    if (this.projects.garden) {
      for (let i = 0; i < 8; i++) add("forage", 4 + i, 37 + (i % 2), i % 3 === 0 ? "honey" : "flower", 1, "hand");
    }
    this.resources = resources;
  }

  handleKeyDown(key) {
    if (this.scene === SCENE.TITLE) {
      if (key === "enter") {
        if (this.hasSave && this.loadGame()) return;
        this.scene = SCENE.PLAYING;
      }
      if (key === "n") this.newGame(true);
      if (key === "l") this.loadGame();
      return;
    }

    if (this.scene === SCENE.FISHING) {
      this.handleFishingKey(key);
      return;
    }

    if (this.scene !== SCENE.PLAYING) {
      this.handleMenuKey(key);
      return;
    }

    if (/^[1-8]$/.test(key)) {
      this.selectedTool = Number(key) - 1;
      this.pushMessage(`当前工具：${TOOLS[this.selectedTool].name}`);
    } else if (key === "q") {
      this.cycleSeed();
    } else if (key === "r") {
      this.selectedTool = (this.selectedTool + 1) % TOOLS.length;
      this.pushMessage(`当前工具：${TOOLS[this.selectedTool].name}`);
    } else if (key === "space") {
      this.useSelectedTool();
    } else if (key === "enter" || key === "e") {
      this.contextInteract();
    } else if (key === "tab") {
      this.sideTab = (this.sideTab + 1) % SIDE_TABS.length;
    } else if (key === "i") {
      this.openScene(SCENE.INVENTORY);
    } else if (key === "j") {
      this.openScene(SCENE.JOURNAL);
    } else if (key === "f5") {
      this.saveGame();
    }
  }

  handleMenuKey(key) {
    const items = this.getMenuItems();
    if (key === "escape") {
      this.closeScene();
    } else if (key === "arrowup" || key === "w") {
      this.menuIndex = clamp(this.menuIndex - 1, 0, Math.max(0, items.length - 1));
    } else if (key === "arrowdown" || key === "s") {
      this.menuIndex = clamp(this.menuIndex + 1, 0, Math.max(0, items.length - 1));
    } else if (key === "arrowleft" || key === "a") {
      this.shiftModalTab(-1);
    } else if (key === "arrowright" || key === "d" || key === "tab") {
      this.shiftModalTab(1);
    } else if (key === "enter" || key === "e" || key === "space") {
      const item = items[this.menuIndex];
      if (item && !item.disabled) item.run();
    } else if (key === "f5") {
      this.saveGame();
    }
  }

  shiftModalTab(delta) {
    const tabCount = this.getModalTabCount();
    if (tabCount <= 1) return;
    if (this.scene === SCENE.JOURNAL) {
      this.journalTab = (this.journalTab + delta + tabCount) % tabCount;
    } else {
      this.menuTab = (this.menuTab + delta + tabCount) % tabCount;
    }
    this.menuIndex = 0;
  }

  getModalTabCount() {
    if (this.scene === SCENE.SHOP) return SHOP_TABS.length;
    if (this.scene === SCENE.JOURNAL) return JOURNAL_TABS.length;
    return 1;
  }

  openScene(scene, tab = 0) {
    this.scene = scene;
    this.menuIndex = 0;
    this.menuTab = tab;
  }

  closeScene() {
    this.scene = SCENE.PLAYING;
    this.activeNpc = null;
    this.menuIndex = 0;
  }

  update(dt) {
    this.messages.forEach((message) => { message.life -= dt; });
    this.messages = this.messages.filter((message) => message.life > 0);

    if (this.scene === SCENE.PLAYING) {
      this.updateTime(dt);
      this.updateMovement(dt);
      this.updateNpcs(dt);
    } else if (this.scene === SCENE.FISHING) {
      this.updateFishing(dt);
    }
  }

  updateTime(dt) {
    this.minute += dt * 7;
    if (this.minute >= 26 * 60) {
      this.pushMessage("太晚了，你回到小屋休息。");
      this.advanceDay();
    }
  }

  updateMovement(dt) {
    let dx = 0;
    let dy = 0;
    if (this.heldKeys.has("arrowleft") || this.heldKeys.has("a")) dx -= 1;
    if (this.heldKeys.has("arrowright") || this.heldKeys.has("d")) dx += 1;
    if (this.heldKeys.has("arrowup") || this.heldKeys.has("w")) dy -= 1;
    if (this.heldKeys.has("arrowdown") || this.heldKeys.has("s")) dy += 1;
    if (!dx && !dy) return;
    const len = Math.hypot(dx, dy);
    dx /= len;
    dy /= len;
    if (Math.abs(dx) > Math.abs(dy)) this.player.dir = dx > 0 ? "right" : "left";
    else this.player.dir = dy > 0 ? "down" : "up";
    const speed = this.player.speed * (this.heldKeys.has("shift") ? 1.32 : 1);
    const next = { x: this.player.x + dx * speed * dt, y: this.player.y + dy * speed * dt };
    if (!this.collides(next.x, this.player.y)) this.player.x = next.x;
    if (!this.collides(this.player.x, next.y)) this.player.y = next.y;
    this.player.step += dt * speed * 0.08;
    this.updateCamera();
  }

  updateCamera() {
    this.camera.x = clamp(this.player.x - LAYOUT.world.w / 2, 0, MAP_W * TILE - LAYOUT.world.w);
    this.camera.y = clamp(this.player.y - LAYOUT.world.h / 2, 0, MAP_H * TILE - LAYOUT.world.h);
  }

  updateNpcs(dt) {
    const hour = this.getHour();
    this.npcs.forEach((npc, index) => {
      const range = hour >= 18 ? 12 : 28;
      const targetX = npc.homeX + Math.sin(this.lastTime * 0.00025 + npc.phase) * range;
      const targetY = npc.homeY + Math.cos(this.lastTime * 0.0002 + index) * range * 0.55;
      npc.x += (targetX - npc.x) * dt * 0.5;
      npc.y += (targetY - npc.y) * dt * 0.5;
    });
  }

  collides(x, y) {
    const halfW = 10;
    const top = y - 7;
    const bottom = y + 10;
    const points = [
      [x - halfW, top],
      [x + halfW, top],
      [x - halfW, bottom],
      [x + halfW, bottom],
    ];
    for (const [px, py] of points) {
      const tx = Math.floor(px / TILE);
      const ty = Math.floor(py / TILE);
      if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return true;
      const kind = this.map[ty][tx];
      if (kind === TILE_KIND.WATER) return true;
    }
    for (const object of this.objects) {
      if (!object.blocks) continue;
      if (x > object.x - 8 && x < object.x + object.w + 8 && y > object.y + 8 && y < object.y + object.h + 10) {
        return true;
      }
    }
    for (const resource of this.resources) {
      if (!resource.blocks) continue;
      if (Math.hypot(x - resource.x, y - resource.y) < 20) return true;
    }
    return false;
  }

  contextInteract(allowToolFallback = true) {
    const building = this.findNearestBuilding(54);
    if (building) {
      this.interactBuilding(building);
      return;
    }
    const npc = this.findNearestNpc(58);
    if (npc) {
      this.activeNpc = npc;
      this.openScene(SCENE.NPC);
      return;
    }
    const plot = this.getFacingPlot();
    if (plot && this.isCropReady(plot)) {
      this.harvestPlot(plot);
      return;
    }
    const resource = this.findNearestResource(42, (item) => item.tool === "hand" || item.type === "forage");
    if (resource) {
      this.collectResource(resource);
      return;
    }
    if (allowToolFallback) this.useSelectedTool();
    else this.pushMessage("附近没有可互动目标。");
  }

  interactBuilding(building) {
    const actions = {
      house: () => this.openScene(SCENE.HOUSE),
      shop: () => this.openScene(SCENE.SHOP),
      town: () => this.openScene(SCENE.TOWN),
      requests: () => this.openScene(SCENE.REQUESTS),
      workshop: () => this.openScene(SCENE.WORKSHOP),
      museum: () => this.openScene(SCENE.MUSEUM),
      ranch: () => this.openScene(SCENE.SHOP, 2),
      shipping: () => this.shipAllSellable(),
      mine: () => this.mineEntrance(),
      dock: () => this.startFishing("sea"),
    };
    actions[building.action]?.();
  }

  mineEntrance() {
    const found = this.projects.mineCart ? "crystal" : "ore";
    if (!this.spendEnergy(12)) return;
    this.addItem("stone", 4 + this.toolLevel);
    this.addItem("ore", 2 + Math.floor(this.toolLevel / 2));
    if (Math.random() < (this.projects.mineCart ? 0.55 : 0.24)) this.addItem(found, 1);
    this.addSkill("mining", 8);
    this.pushMessage("你在山洞里带回了一袋矿料。");
  }

  useSelectedTool() {
    const tool = TOOLS[this.selectedTool];
    if (!tool) return;
    if (tool.id === "hand") {
      this.contextInteract(false);
      return;
    }
    if (tool.id === "hoe") this.useHoe();
    if (tool.id === "seed") this.useSeed();
    if (tool.id === "water") this.useWater();
    if (tool.id === "axe") this.useAxe();
    if (tool.id === "pick") this.usePick();
    if (tool.id === "rod") this.tryStartFishing();
    if (tool.id === "net") this.useNet();
  }

  useHoe() {
    const { tx, ty } = this.getFacingTile();
    if (!this.isFarmable(tx, ty)) {
      this.pushMessage("这里不适合开垦。");
      return;
    }
    if (!this.spendEnergy(TOOLS[1].energy)) return;
    let plot = this.getPlot(tx, ty);
    if (!plot) {
      plot = { tx, ty, tilled: true, watered: false, crop: null, age: 0, quality: 0 };
      this.plots.push(plot);
    } else {
      plot.tilled = true;
    }
    this.pushMessage("土地已经翻松。");
  }

  useSeed() {
    const { tx, ty } = this.getFacingTile();
    const plot = this.getPlot(tx, ty);
    const crop = SEED_TO_CROP[this.selectedSeed];
    if (!crop || !this.inventory[this.selectedSeed]) {
      this.pushMessage("没有可播种的种子。按 Q 切换库存种子。");
      return;
    }
    if (!plot || !plot.tilled || plot.crop) {
      this.pushMessage("需要在已翻好的空地上播种。");
      return;
    }
    if (!crop.seasons.includes(this.getSeason().id) && !this.projects.greenhouse) {
      this.pushMessage(`${crop.name}不适合${this.getSeason().name}。`);
      return;
    }
    if (!this.spendEnergy(TOOLS[2].energy)) return;
    this.removeItem(this.selectedSeed, 1);
    plot.crop = Object.keys(CROPS).find((id) => CROPS[id] === crop);
    plot.age = 0;
    plot.quality = 0;
    plot.watered = false;
    this.pushMessage(`种下了${crop.name}。`);
  }

  useWater() {
    const { tx, ty } = this.getFacingTile();
    const plot = this.getPlot(tx, ty);
    if (!plot || !plot.tilled) {
      this.pushMessage("这里没有需要浇水的田地。");
      return;
    }
    if (!this.spendEnergy(Math.max(1, TOOLS[3].energy - Math.floor(this.toolLevel / 2)))) return;
    plot.watered = true;
    plot.quality += 1;
    this.pushMessage("田地浇好了。");
  }

  useAxe() {
    const resource = this.findNearestResource(42, (item) => item.tool === "axe");
    if (!resource) {
      this.pushMessage("附近没有能砍的树木。");
      return;
    }
    if (!this.spendEnergy(Math.max(3, TOOLS[4].energy - (this.toolLevel - 1)))) return;
    this.collectResource(resource, 1 + Math.floor(this.toolLevel / 2));
  }

  usePick() {
    const resource = this.findNearestResource(42, (item) => item.tool === "pick");
    if (!resource) {
      this.pushMessage("附近没有能敲的石块。");
      return;
    }
    const projectBonus = this.projects.mineCart ? 2 : 0;
    if (!this.spendEnergy(Math.max(3, TOOLS[5].energy - (this.toolLevel - 1) - projectBonus))) return;
    this.collectResource(resource, this.projects.mineCart ? 2 : 1);
  }

  tryStartFishing() {
    const { tx, ty } = this.getFacingTile();
    const tile = this.map[ty]?.[tx];
    if (tile === TILE_KIND.WATER || this.player.y > 43 * TILE) {
      this.startFishing(this.player.y > 43 * TILE ? "sea" : "river");
    } else {
      this.pushMessage("站在水边才能钓鱼。");
    }
  }

  useNet() {
    const resource = this.findNearestResource(46, (item) => item.type === "bug");
    if (!resource) {
      this.pushMessage("附近没有可以捕捉的虫。");
      return;
    }
    if (!this.spendEnergy(TOOLS[7].energy)) return;
    this.collectResource(resource);
    this.stats.bugs += 1;
    this.checkAchievements();
  }

  collectResource(resource, bonus = 0) {
    const amount = resource.amount + bonus;
    this.addItem(resource.item, amount);
    this.resources = this.resources.filter((item) => item.id !== resource.id);
    this.addCollection(resource.item);
    this.addSkill(resource.tool === "pick" ? "mining" : resource.type === "bug" ? "nature" : "foraging", 4 + amount);
    this.pushMessage(`获得${itemName(resource.item)}x${amount}。`);
  }

  harvestPlot(plot) {
    const crop = CROPS[plot.crop];
    if (!crop || !this.isCropReady(plot)) return;
    const qualityBonus = plot.quality >= crop.days + 2 ? 1 : 0;
    const festivalBonus = this.getFestival()?.day === 21 ? 1 : 0;
    const amount = 1 + qualityBonus + festivalBonus;
    this.addItem(crop.harvest, amount);
    this.addCollection(crop.harvest);
    this.stats.harvested += amount;
    this.addSkill("farming", crop.xp + amount);
    this.checkAchievements();
    if (crop.regrow) {
      plot.age = crop.days - crop.regrow;
      plot.watered = false;
      plot.quality = 1;
    } else {
      plot.crop = null;
      plot.age = 0;
      plot.watered = false;
      plot.quality = 0;
    }
    this.pushMessage(`收获${itemName(crop.harvest)}x${amount}。`);
  }

  isFarmable(tx, ty) {
    return tx >= 8 && tx <= 31 && ty >= 17 && ty <= 35 && this.map[ty]?.[tx] === TILE_KIND.FARM;
  }

  getPlot(tx, ty) {
    return this.plots.find((plot) => plot.tx === tx && plot.ty === ty);
  }

  getFacingPlot() {
    const { tx, ty } = this.getFacingTile();
    return this.getPlot(tx, ty);
  }

  getFacingTile(distancePx = 26) {
    let ox = 0;
    let oy = 0;
    if (this.player.dir === "left") ox = -distancePx;
    if (this.player.dir === "right") ox = distancePx;
    if (this.player.dir === "up") oy = -distancePx;
    if (this.player.dir === "down") oy = distancePx;
    return {
      tx: clamp(Math.floor((this.player.x + ox) / TILE), 0, MAP_W - 1),
      ty: clamp(Math.floor((this.player.y + oy) / TILE), 0, MAP_H - 1),
    };
  }

  isCropReady(plot) {
    const crop = CROPS[plot.crop];
    return Boolean(crop && plot.age >= crop.days);
  }

  findNearestBuilding(maxDistance) {
    let best = null;
    let bestDistance = Infinity;
    for (const object of this.objects) {
      const px = clamp(this.player.x, object.x, object.x + object.w);
      const py = clamp(this.player.y, object.y, object.y + object.h);
      const d = Math.hypot(this.player.x - px, this.player.y - py);
      if (d < maxDistance && d < bestDistance) {
        best = object;
        bestDistance = d;
      }
    }
    return best;
  }

  findNearestNpc(maxDistance) {
    return this.findNearest(this.npcs, maxDistance);
  }

  findNearestResource(maxDistance, predicate = () => true) {
    return this.findNearest(this.resources.filter(predicate), maxDistance);
  }

  findNearest(list, maxDistance) {
    let best = null;
    let bestDistance = Infinity;
    for (const item of list) {
      const d = distance(this.player, item);
      if (d < maxDistance && d < bestDistance) {
        best = item;
        bestDistance = d;
      }
    }
    return best;
  }

  cycleSeed() {
    const seeds = Object.keys(this.inventory).filter((id) => ITEMS[id]?.type === "seed" && this.inventory[id] > 0);
    if (!seeds.length) {
      this.pushMessage("背包里没有种子。");
      return;
    }
    const index = seeds.indexOf(this.selectedSeed);
    this.selectedSeed = seeds[(index + 1 + seeds.length) % seeds.length];
    this.pushMessage(`当前种子：${itemName(this.selectedSeed)}。`);
  }

  spendEnergy(amount) {
    const scaled = Math.ceil(amount * WEATHER[this.weather].energy);
    if (this.energy < scaled) {
      this.pushMessage("体力不足，回家吃点东西或睡一觉吧。");
      return false;
    }
    this.energy = Math.max(0, this.energy - scaled);
    return true;
  }

  addItem(id, amount = 1) {
    this.inventory[id] = (this.inventory[id] || 0) + amount;
    this.addCollection(id);
  }

  removeItem(id, amount = 1) {
    if ((this.inventory[id] || 0) < amount) return false;
    this.inventory[id] -= amount;
    if (this.inventory[id] <= 0) delete this.inventory[id];
    return true;
  }

  addCollection(id) {
    if (ITEMS[id]) this.collections[id] = true;
    this.checkAchievements();
  }

  addSkill(skill, xp) {
    if (!SKILLS[skill]) return;
    const before = this.getSkillLevel(skill);
    this.stats[skill] = (this.stats[skill] || 0) + xp;
    const after = this.getSkillLevel(skill);
    if (after > before) {
      for (let level = before + 1; level <= after; level++) {
        this.applySkillReward(skill, level);
      }
    }
  }

  getSkillLevel(skill) {
    const xp = this.stats?.[skill] || 0;
    let level = 1;
    for (let i = 1; i < SKILL_THRESHOLDS.length; i++) {
      if (xp >= SKILL_THRESHOLDS[i]) level = i + 1;
    }
    return clamp(level, 1, SKILL_THRESHOLDS.length);
  }

  getSkillProgress(skill) {
    const level = this.getSkillLevel(skill);
    const xp = this.stats?.[skill] || 0;
    const current = SKILL_THRESHOLDS[level - 1] || 0;
    const next = SKILL_THRESHOLDS[level] || current;
    return next === current ? 1 : clamp((xp - current) / (next - current), 0, 1);
  }

  applySkillReward(skill, level) {
    this.skillRewards[skill] = Math.max(this.skillRewards[skill] || 0, level);
    const info = SKILLS[skill];
    const reward = info.reward(level) || {};
    this.grantReward(reward);
    this.pushMessage(`${info.name}提升到 Lv${level}。`);
  }

  grantReward(reward = {}) {
    if (reward.gold) {
      this.gold += reward.gold;
      this.stats.earned += reward.gold;
    }
    if (reward.item) this.addItem(reward.item, reward.amount || 1);
    if (reward.maxEnergy) {
      this.maxEnergy += reward.maxEnergy;
      this.energy = Math.min(this.maxEnergy, this.energy + reward.maxEnergy);
    }
    if (reward.decor) {
      this.decor += reward.decor;
      this.updateTownRank();
    }
  }

  refreshMail() {
    const known = new Set(this.mail.map((mail) => mail.id));
    MAIL_TEMPLATES.forEach((template) => {
      if (!known.has(template.id) && template.condition(this)) {
        this.mail.unshift({
          id: template.id,
          from: template.from,
          title: template.title,
          body: template.body,
          reward: template.reward,
          day: this.day,
          read: false,
          claimed: false,
        });
      }
    });
  }

  getUnreadMail() {
    return this.mail.filter((mail) => !mail.read || (!mail.claimed && mail.reward));
  }

  checkAchievements() {
    if (!this.achievements) return;
    ACHIEVEMENTS.forEach((achievement) => {
      if (this.achievements[achievement.id]) return;
      if (!achievement.done(this)) return;
      this.achievements[achievement.id] = { day: this.day };
      this.grantReward(achievement.reward);
      this.pushMessage(`成就达成：${achievement.title}`);
    });
  }

  getSellPrice(id) {
    const item = ITEMS[id];
    if (!item?.sell) return 0;
    let price = item.sell;
    if (item.type === "crop" && this.getSeason().id === "autumn") price *= 1.08;
    if (item.type === "fish" && this.getFestival()?.day === 14 && this.getHour() >= 18) price *= 1.25;
    if (item.type === "artisan" && this.projects.artisan) price *= 1.18;
    if (this.getFestival()?.day === 21 && ["crop", "artisan"].includes(item.type)) price *= 1.2;
    return Math.round(price);
  }

  shipAllSellable() {
    const entries = Object.entries(this.inventory).filter(([id, count]) => count > 0 && this.getSellPrice(id) > 0 && !ITEMS[id].keep);
    if (!entries.length) {
      this.pushMessage("没有适合出货的商品。材料会默认保留。");
      return;
    }
    for (const [id, count] of entries) {
      this.shipping[id] = (this.shipping[id] || 0) + count;
      delete this.inventory[id];
    }
    const total = entries.reduce((sum, [id, count]) => sum + this.getSellPrice(id) * count, 0);
    this.pushMessage(`已放入出货箱，预计收入 ${total} 金。`);
  }

  advanceDay() {
    const shippedValue = Object.entries(this.shipping).reduce((sum, [id, count]) => sum + this.getSellPrice(id) * count, 0);
    const shippedCount = Object.values(this.shipping).reduce((sum, count) => sum + count, 0);
    this.gold += shippedValue;
    this.stats.earned += shippedValue;
    this.stats.shipped += shippedCount;
    this.shipping = {};

    const rain = WEATHER[this.weather].autoWater;
    let grown = 0;
    for (const plot of this.plots) {
      if (!plot.crop) {
        plot.watered = false;
        continue;
      }
      const crop = CROPS[plot.crop];
      const inSeason = crop.seasons.includes(this.getSeason().id);
      if (!inSeason && !this.projects.greenhouse && this.getSeason().id !== "winter") {
        plot.crop = null;
        plot.age = 0;
        plot.watered = false;
        continue;
      }
      if (plot.watered || rain) {
        plot.age += this.getSeason().id === "winter" && plot.crop !== "winterRoot" ? 0.5 : 1;
        grown += 1;
      }
      plot.watered = false;
    }
    if (this.projects.canal) {
      this.plots.filter((plot) => plot.crop && !plot.watered).slice(0, 10 + this.townRank * 2).forEach((plot) => { plot.watered = true; });
    }

    let animalGoods = 0;
    for (const animal of this.animals) {
      animal.age += 1;
      const fed = this.removeItem("hay", 1);
      animal.mood = clamp((animal.mood || 55) + (fed ? 6 : -12), 0, 100);
      if (fed && animal.age >= animal.mature) {
        this.addItem(animal.product, animal.mood > 75 ? 2 : 1);
        animalGoods += animal.mood > 75 ? 2 : 1;
      }
    }

    this.lastReport = {
      day: this.day,
      shippedValue,
      shippedCount,
      grown,
      animalGoods,
      grade: shippedValue > 600 ? "A" : shippedValue > 260 ? "B" : shippedValue > 80 ? "C" : "D",
    };
    this.day += 1;
    this.stats.daysPlayed += 1;
    this.minute = 6 * 60;
    this.weather = this.tomorrowWeather;
    this.tomorrowWeather = this.rollWeather();
    this.energy = this.maxEnergy;
    this.generateDailyContent();
    this.generateResources();
    this.updateTownRank();
    this.refreshMail();
    this.checkAchievements();
    this.saveGame(false);
    this.scene = SCENE.PLAYING;
    this.player.x = 16 * TILE + 16;
    this.player.y = 22 * TILE + 16;
    this.updateCamera();
    this.pushMessage(`新的一天开始。昨日出货 ${shippedValue} 金，评级 ${this.lastReport.grade}。`);
  }

  rollWeather() {
    const rng = makeRng((this.day + 1) * 571 + this.getSeasonIndex() * 37);
    const roll = rng();
    if (roll < 0.18) return "rain";
    if (roll < 0.32) return "windy";
    if (roll < 0.43) return "mist";
    return "sunny";
  }

  updateTownRank() {
    const projectScore = Object.values(this.projects).filter(Boolean).length * 20;
    const donateScore = Object.keys(this.donated).length * (this.projects.museum ? 4 : 3);
    const socialScore = Object.values(this.relationships).reduce((sum, value) => sum + value, 0) / 8;
    const decorScore = this.decor * 6;
    const rank = clamp(1 + Math.floor((projectScore + donateScore + socialScore + decorScore) / 70), 1, 6);
    if (rank > this.townRank) this.pushMessage(`星禾镇评价提升到 ${rank} 级。`);
    this.townRank = Math.max(this.townRank, rank);
  }

  startFishing(area = "river") {
    if (!this.spendEnergy(Math.max(3, TOOLS[6].energy - this.rodLevel))) return;
    if (this.inventory.bait) this.removeItem("bait", 1);
    this.scene = SCENE.FISHING;
    this.fishing = {
      area,
      phase: "waiting",
      timer: 0.9 + Math.random() * 1.4,
      fishY: 145,
      barY: 150,
      barVel: 0,
      progress: 34,
      difficulty: area === "sea" ? 1.15 : 1,
      result: null,
    };
  }

  handleFishingKey(key) {
    if (!this.fishing) return;
    if (key === "escape") {
      this.scene = SCENE.PLAYING;
      this.fishing = null;
      return;
    }
    if ((key === "space" || key === "enter" || key === "e") && this.fishing.phase === "bite") {
      this.fishing.phase = "reeling";
      this.fishing.progress = 38;
      this.pushMessage("上钩了，按住 Space 控制绿色钓条。");
    }
    if ((key === "space" || key === "enter" || key === "e") && this.fishing.phase === "result") {
      this.scene = SCENE.PLAYING;
      this.fishing = null;
    }
  }

  updateFishing(dt) {
    const fish = this.fishing;
    if (!fish) return;
    if (fish.phase === "waiting") {
      fish.timer -= dt * WEATHER[this.weather].fish;
      if (fish.timer <= 0) {
        fish.phase = "bite";
        fish.timer = 1.35;
      }
    } else if (fish.phase === "bite") {
      fish.timer -= dt;
      if (fish.timer <= 0) {
        fish.phase = "result";
        fish.result = { fail: true, text: "鱼脱钩了。" };
      }
    } else if (fish.phase === "reeling") {
      const t = this.lastTime * 0.003;
      fish.fishY += Math.sin(t * fish.difficulty) * 70 * dt + (Math.random() - 0.5) * 90 * dt * fish.difficulty;
      fish.fishY = clamp(fish.fishY, 24, 286);
      fish.barVel += (this.heldKeys.has("space") ? -520 : 420) * dt;
      fish.barVel *= 0.88;
      fish.barY += fish.barVel * dt;
      fish.barY = clamp(fish.barY, 18, 266);
      const overlap = fish.fishY > fish.barY && fish.fishY < fish.barY + 62;
      fish.progress += (overlap ? 32 : -24 * fish.difficulty) * dt * (this.rodLevel > 1 ? 1.12 : 1);
      fish.progress = clamp(fish.progress, 0, 100);
      if (fish.progress >= 100) this.completeFishing();
      if (fish.progress <= 0) {
        fish.phase = "result";
        fish.result = { fail: true, text: "没能收线成功。" };
      }
    }
  }

  completeFishing() {
    const fish = this.fishing;
    const hour = this.getHour();
    const rare = Math.random() < (0.08 + this.rodLevel * 0.03 + (this.weather === "rain" || this.weather === "mist" ? 0.06 : 0) + (this.projects.dock ? 0.05 : 0) + (this.projects.pearlDiving ? 0.04 : 0));
    let item = fish.area === "sea" ? "seaBass" : "riverFish";
    if (fish.area === "sea") {
      if (rare && this.getSeason().id === "summer") item = "tuna";
      else if (rare && hour >= 18) item = "nightFish";
      else if (rare) item = "crab";
    }
    if (fish.area === "river") {
      if (rare && this.getSeason().id === "winter") item = "glacierTrout";
      else if (rare && this.weather === "rain") item = "catfish";
      else if (rare && hour >= 18) item = "nightFish";
      else if (rare) item = "koi";
    }
    this.addItem(item, 1);
    this.addCollection(item);
    this.stats.fish += 1;
    this.addSkill("fishing", 8 + (rare ? 6 : 0));
    this.checkAchievements();
    fish.phase = "result";
    fish.result = { item, text: `钓到${itemName(item)}。` };
  }

  getMenuItems() {
    if (this.scene === SCENE.SHOP) return this.getShopItems();
    if (this.scene === SCENE.HOUSE) return this.getHouseItems();
    if (this.scene === SCENE.WORKSHOP) return this.getWorkshopItems();
    if (this.scene === SCENE.TOWN) return this.getProjectItems();
    if (this.scene === SCENE.REQUESTS) return this.getRequestItems();
    if (this.scene === SCENE.MUSEUM) return this.getMuseumItems();
    if (this.scene === SCENE.NPC) return this.getNpcItems();
    if (this.scene === SCENE.INVENTORY) return this.getInventoryItems();
    if (this.scene === SCENE.MAIL) return this.getMailItems();
    return [];
  }

  getShopItems() {
    if (this.menuTab === 0) {
      const season = this.getSeason();
      const cropIds = Object.keys(CROPS).filter((id) => {
        if (id === "tea" && !this.projects.garden) return false;
        if (this.projects.greenhouse || this.projects.seedBank) return true;
        return CROPS[id].seasons.includes(season.id);
      });
      return cropIds.map((id) => {
        const crop = CROPS[id];
        const price = ITEMS[crop.seed].buy;
        return {
          label: ITEMS[crop.seed].name,
          detail: `${crop.days}天成熟${crop.regrow ? `，${crop.regrow}天再生` : ""}。库存 ${this.inventory[crop.seed] || 0}`,
          right: `${price}金`,
          disabled: this.gold < price,
          run: () => this.buyItem(crop.seed, price, 1),
        };
      });
    }
    if (this.menuTab === 1) {
      return [
        { label: "升级工具组", detail: `斧、镐、水壶效率提升。当前 Lv${this.toolLevel}`, right: `${360 * this.toolLevel}金 / 矿石x${4 * this.toolLevel}`, disabled: this.gold < 360 * this.toolLevel || (this.inventory.ore || 0) < 4 * this.toolLevel, run: () => this.upgradeTool() },
        { label: "升级钓竿", detail: `钓条更稳，稀有鱼概率提高。当前 Lv${this.rodLevel}`, right: `${300 * this.rodLevel}金 / 木材x${6 * this.rodLevel}`, disabled: this.gold < 300 * this.rodLevel || (this.inventory.wood || 0) < 6 * this.rodLevel, run: () => this.upgradeRod() },
        { label: "购买鱼饵x5", detail: "钓鱼等待时间更短。", right: "36金", disabled: this.gold < 36, run: () => this.buyItem("bait", 36, 5) },
      ];
    }
    if (this.menuTab === 2) {
      const unlocked = this.projects.coop;
      return [
        { label: "干草x10", detail: "动物每天需要一份干草。", right: unlocked ? "38金" : "52金", disabled: this.gold < (unlocked ? 38 : 52), run: () => this.buyItem("hay", unlocked ? 38 : 52, 10) },
        { label: "小鸡", detail: "2天长成，产出鸡蛋。", right: "260金 / 木材x8", disabled: !unlocked || this.gold < 260 || (this.inventory.wood || 0) < 8, run: () => this.buyAnimal("小鸡", "egg", 2, 260, { wood: 8 }) },
        { label: "鸭子", detail: "3天长成，产出鸭蛋。", right: "380金 / 干草x8", disabled: !unlocked || this.gold < 380 || (this.inventory.hay || 0) < 8, run: () => this.buyAnimal("鸭子", "duckEgg", 3, 380, { hay: 8 }) },
        { label: "奶牛", detail: "4天长成，产出牛奶。", right: "560金 / 干草x10", disabled: !unlocked || this.gold < 560 || (this.inventory.hay || 0) < 10, run: () => this.buyAnimal("奶牛", "milk", 4, 560, { hay: 10 }) },
        { label: "绵羊", detail: "5天长成，产出羊毛。", right: "720金 / 干草x14", disabled: !unlocked || this.gold < 720 || (this.inventory.hay || 0) < 14, run: () => this.buyAnimal("绵羊", "wool", 5, 720, { hay: 14 }) },
      ];
    }
    return [
      { label: "窗边花架", detail: "小屋装饰 +1，小镇评价略升。", right: "180金 / 花x2", disabled: this.gold < 180 || (this.inventory.flower || 0) < 2, run: () => this.buyDecor(180, { flower: 2 }) },
      { label: "木质书柜", detail: "小屋装饰 +1，居民聊天更容易获得提示。", right: "240金 / 木材x10", disabled: this.gold < 240 || (this.inventory.wood || 0) < 10, run: () => this.buyDecor(240, { wood: 10 }) },
      { label: "海蓝地毯", detail: "小屋装饰 +2。", right: "360金 / 贝壳x4", disabled: this.gold < 360 || (this.inventory.shell || 0) < 4, run: () => this.buyDecor(360, { shell: 4 }, 2) },
    ];
  }

  buyItem(id, price, amount) {
    if (this.gold < price) return;
    this.gold -= price;
    this.addItem(id, amount);
    this.pushMessage(`购买${itemName(id)}x${amount}。`);
  }

  upgradeTool() {
    const cost = 360 * this.toolLevel;
    const ore = 4 * this.toolLevel;
    if (this.gold < cost || !this.removeItem("ore", ore)) return;
    this.gold -= cost;
    this.toolLevel += 1;
    this.pushMessage(`工具组升级到 Lv${this.toolLevel}。`);
  }

  upgradeRod() {
    const cost = 300 * this.rodLevel;
    const wood = 6 * this.rodLevel;
    if (this.gold < cost || !this.removeItem("wood", wood)) return;
    this.gold -= cost;
    this.rodLevel += 1;
    this.pushMessage(`钓竿升级到 Lv${this.rodLevel}。`);
  }

  buyAnimal(name, product, mature, price, req) {
    if (this.gold < price || !hasAll(this.inventory, req)) return;
    Object.entries(req).forEach(([id, amount]) => this.removeItem(id, amount));
    this.gold -= price;
    this.animals.push({ name, product, mature, age: 0, mood: 60 });
    this.checkAchievements();
    this.pushMessage(`${name}搬进牧场了。`);
  }

  buyDecor(price, req, amount = 1) {
    if (this.gold < price || !hasAll(this.inventory, req)) return;
    Object.entries(req).forEach(([id, count]) => this.removeItem(id, count));
    this.gold -= price;
    this.decor += amount;
    this.updateTownRank();
    this.refreshMail();
    this.checkAchievements();
    this.pushMessage(`小屋装饰提升到 ${this.decor}。`);
  }

  getHouseItems() {
    const recipes = RECIPES.filter((recipe) => recipe.station === "house").map((recipe) => ({
      label: `料理：${recipe.name}`,
      detail: formatReq(recipe.ingredients),
      right: `${itemName(recipe.result)}x${recipe.amount}`,
      disabled: !hasAll(this.inventory, recipe.ingredients),
      run: () => this.craftRecipe(recipe),
    }));
    return [
      { label: "睡到明天", detail: "结算出货、恢复体力、刷新委托与资源。", right: "结束当天", run: () => this.advanceDay() },
      { label: "查看邮箱", detail: `${this.getUnreadMail().length} 封未读或未领取回礼。`, right: "邮件", run: () => this.openScene(SCENE.MAIL) },
      { label: "整理背包", detail: "打开库存，选择食物可食用，选择商品可放入出货箱。", right: "I", run: () => this.openScene(SCENE.INVENTORY) },
      { label: "升级小屋", detail: `当前 Lv${this.houseLevel}，提升最大体力。`, right: `${420 * this.houseLevel}金 / 木材x${18 * this.houseLevel}`, disabled: this.gold < 420 * this.houseLevel || (this.inventory.wood || 0) < 18 * this.houseLevel, run: () => this.upgradeHouse() },
      ...recipes,
      { label: "保存游戏", detail: "立即写入本地存档。", right: "F5", run: () => this.saveGame() },
    ];
  }

  upgradeHouse() {
    const cost = 420 * this.houseLevel;
    const wood = 18 * this.houseLevel;
    if (this.gold < cost || !this.removeItem("wood", wood)) return;
    this.gold -= cost;
    this.houseLevel += 1;
    this.maxEnergy += 16;
    this.energy = this.maxEnergy;
    this.pushMessage(`小屋升级到 Lv${this.houseLevel}，体力上限提升。`);
  }

  getWorkshopItems() {
    return RECIPES.filter((recipe) => recipe.station === "workshop").map((recipe) => ({
      label: recipe.name,
      detail: formatReq(recipe.ingredients),
      right: `${itemName(recipe.result)}x${recipe.amount}`,
      disabled: !hasAll(this.inventory, recipe.ingredients),
      run: () => this.craftRecipe(recipe),
    }));
  }

  craftRecipe(recipe) {
    if (!hasAll(this.inventory, recipe.ingredients)) return;
    Object.entries(recipe.ingredients).forEach(([id, amount]) => this.removeItem(id, amount));
    this.addItem(recipe.result, recipe.amount);
    this.stats.crafted += recipe.amount;
    this.addSkill("crafting", recipe.xp);
    this.checkAchievements();
    this.pushMessage(`制作了${itemName(recipe.result)}x${recipe.amount}。`);
  }

  getProjectItems() {
    return PROJECTS.map((project) => {
      const done = this.projects[project.id];
      return {
        label: `${done ? "已完成" : hasAll(this.inventory, project.req) ? "可提交" : "建设中"}：${project.name}`,
        detail: done ? project.desc : formatReq(project.req),
        right: done ? "完成" : `奖励 ${project.reward.gold}金`,
        disabled: done || !hasAll(this.inventory, project.req),
        run: () => this.completeProject(project),
      };
    });
  }

  completeProject(project) {
    if (this.projects[project.id] || !hasAll(this.inventory, project.req)) return;
    Object.entries(project.req).forEach(([id, amount]) => this.removeItem(id, amount));
    this.projects[project.id] = true;
    this.gold += project.reward.gold;
    if (project.reward.item) this.addItem(project.reward.item, project.reward.amount || 1);
    this.townRank += project.reward.rank || 0;
    this.updateTownRank();
    this.generateResources();
    this.refreshMail();
    this.checkAchievements();
    this.pushMessage(`${project.name}完成了。${project.desc}`);
  }

  getRequestItems() {
    return this.dailyRequests.map((request) => {
      const npc = VILLAGERS.find((item) => item.id === request.npc);
      return {
        label: `${request.done ? "已完成" : "委托"}：${request.title}`,
        detail: `${npc?.name || ""}需要${itemName(request.item)}x${request.amount}`,
        right: `${request.gold}金 / 好感+${request.favor}`,
        disabled: request.done || (this.inventory[request.item] || 0) < request.amount,
        run: () => this.completeRequest(request),
      };
    });
  }

  completeRequest(request) {
    if (request.done || !this.removeItem(request.item, request.amount)) return;
    request.done = true;
    this.gold += request.gold;
    this.relationships[request.npc] = clamp((this.relationships[request.npc] || 0) + request.favor, 0, 100);
    this.stats.requests += 1;
    this.addSkill("social", 6);
    this.updateTownRank();
    this.refreshMail();
    this.checkAchievements();
    this.pushMessage(`完成委托：${request.title}，获得 ${request.gold} 金。`);
  }

  getMuseumItems() {
    const candidates = Object.keys(this.inventory).filter((id) => this.inventory[id] > 0 && ITEMS[id] && COLLECTION_TYPES.includes(ITEMS[id].type) && !this.donated[id]);
    if (!candidates.length) {
      return [{ label: "暂无可捐赠藏品", detail: "钓鱼、捕虫、采集、挖矿和收获都会填充图鉴。", disabled: true, run: () => {} }];
    }
    return candidates.map((id) => ({
      label: `捐赠：${itemName(id)}`,
      detail: `分类：${ITEMS[id].type}，库存 ${this.inventory[id]}`,
      right: "评价+",
      run: () => this.donateItem(id),
    }));
  }

  donateItem(id) {
    if (this.donated[id] || !this.removeItem(id, 1)) return;
    this.donated[id] = true;
    this.stats.donated += 1;
    const reward = this.stats.donated % 5 === 0 ? 160 : 46;
    this.gold += reward;
    this.updateTownRank();
    this.refreshMail();
    this.checkAchievements();
    this.pushMessage(`博物馆收下了${itemName(id)}，回赠 ${reward} 金。`);
  }

  getNpcItems() {
    const npc = this.activeNpc;
    if (!npc) return [];
    const items = [{
      label: `聊天：${npc.name}`,
      detail: npc.talks[(this.day + npc.id.length) % npc.talks.length],
      right: "好感+1",
      run: () => {
        this.relationships[npc.id] = clamp((this.relationships[npc.id] || 0) + 1, 0, 100);
        this.pushMessage(`${npc.name}：${npc.talks[(this.day + npc.id.length) % npc.talks.length]}`);
      },
    }];
    const giftables = Object.keys(this.inventory).filter((id) => this.inventory[id] > 0 && ITEMS[id]?.type !== "seed").slice(0, 12);
    giftables.forEach((id) => {
      const loved = npc.loves.includes(id);
      items.push({
        label: `赠送：${itemName(id)}`,
        detail: loved ? "很喜欢的礼物" : "普通礼物",
        right: loved ? "好感+10" : "好感+3",
        disabled: this.giftedToday[npc.id],
        run: () => this.giveGift(npc, id, loved ? 10 : 3),
      });
    });
    return items;
  }

  giveGift(npc, id, favor) {
    if (this.giftedToday[npc.id] || !this.removeItem(id, 1)) return;
    this.giftedToday[npc.id] = true;
    const festival = this.getFestival()?.day === 7 && ["flower", "berry", "jam", "tea"].includes(id);
    this.relationships[npc.id] = clamp((this.relationships[npc.id] || 0) + favor + (festival ? 4 : 0), 0, 100);
    this.addSkill("social", favor);
    this.updateTownRank();
    this.refreshMail();
    this.checkAchievements();
    this.pushMessage(`${npc.name}收下了${itemName(id)}。`);
  }

  getInventoryItems() {
    const entries = Object.entries(this.inventory).filter(([, count]) => count > 0).sort((a, b) => itemName(a[0]).localeCompare(itemName(b[0]), "zh-CN"));
    if (!entries.length) return [{ label: "背包空空", detail: "今天适合去森林、海边或农田找点东西。", disabled: true, run: () => {} }];
    return entries.map(([id, count]) => {
      const food = ITEMS[id]?.energy;
      const sell = this.getSellPrice(id);
      return {
        label: `${itemName(id)} x${count}`,
        detail: food ? `食用恢复 ${food} 体力` : sell && !ITEMS[id].keep ? `放入出货箱，单价 ${sell} 金` : ITEMS[id]?.keep ? "建设、制作与升级材料" : "收藏或委托物品",
        right: food ? "食用" : sell && !ITEMS[id].keep ? "出货1" : "",
        run: () => {
          if (food) this.eatFood(id);
          else if (sell && !ITEMS[id].keep) this.shipOne(id);
        },
      };
    });
  }

  getMailItems() {
    if (!this.mail.length) {
      return [{ label: "邮箱里暂时没有信", detail: "完成工程、提升评价、改变天气或捐赠藏品后会收到新信。", disabled: true, run: () => {} }];
    }
    return this.mail.map((mail) => ({
      label: `${mail.read ? "已读" : "新信"}：${mail.title}`,
      detail: `${mail.from} · ${mail.body.length > 34 ? `${mail.body.slice(0, 34)}...` : mail.body}`,
      right: mail.reward && !mail.claimed ? "领取回礼" : "",
      run: () => this.readMail(mail),
    }));
  }

  readMail(mail) {
    mail.read = true;
    if (mail.reward && !mail.claimed) {
      this.grantReward(mail.reward);
      mail.claimed = true;
      this.pushMessage(`领取了${mail.from}的回礼。`);
    } else {
      this.pushMessage(`${mail.from}：${mail.title}`);
    }
  }

  eatFood(id) {
    const food = ITEMS[id];
    if (!food?.energy || !this.removeItem(id, 1)) return;
    const boost = this.getFestival()?.day === 28 ? 1.25 : 1;
    this.energy = clamp(this.energy + Math.round(food.energy * boost), 0, this.maxEnergy);
    this.pushMessage(`吃下${itemName(id)}，体力恢复。`);
  }

  shipOne(id) {
    if (!this.removeItem(id, 1)) return;
    this.shipping[id] = (this.shipping[id] || 0) + 1;
    this.pushMessage(`${itemName(id)}放入出货箱。`);
  }

  saveGame(showMessage = true) {
    const data = {
      day: this.day,
      minute: this.minute,
      weather: this.weather,
      tomorrowWeather: this.tomorrowWeather,
      gold: this.gold,
      energy: this.energy,
      maxEnergy: this.maxEnergy,
      player: this.player,
      selectedTool: this.selectedTool,
      selectedSeed: this.selectedSeed,
      inventory: this.inventory,
      shipping: this.shipping,
      relationships: this.relationships,
      giftedToday: this.giftedToday,
      projects: this.projects,
      achievements: this.achievements,
      skillRewards: this.skillRewards,
      mail: this.mail,
      collections: this.collections,
      donated: this.donated,
      animals: this.animals,
      decor: this.decor,
      houseLevel: this.houseLevel,
      toolLevel: this.toolLevel,
      rodLevel: this.rodLevel,
      townRank: this.townRank,
      stats: this.stats,
      plots: this.plots,
      resources: this.resources,
      dailyRequests: this.dailyRequests,
      lastReport: this.lastReport,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    this.hasSave = true;
    if (showMessage) this.pushMessage("游戏已保存。");
  }

  loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    try {
      const data = JSON.parse(raw);
      this.newGame(true);
      Object.assign(this, {
        day: data.day,
        minute: data.minute,
        weather: data.weather,
        tomorrowWeather: data.tomorrowWeather,
        gold: data.gold,
        energy: data.energy,
        maxEnergy: data.maxEnergy,
        player: data.player,
        selectedTool: data.selectedTool,
        selectedSeed: data.selectedSeed,
        inventory: data.inventory || {},
        shipping: data.shipping || {},
        relationships: data.relationships || {},
        giftedToday: data.giftedToday || {},
        projects: data.projects || {},
        achievements: data.achievements || {},
        skillRewards: data.skillRewards || {},
        mail: data.mail || [],
        collections: data.collections || {},
        donated: data.donated || {},
        animals: data.animals || [],
        decor: data.decor || 0,
        houseLevel: data.houseLevel || 1,
        toolLevel: data.toolLevel || 1,
        rodLevel: data.rodLevel || 1,
        townRank: data.townRank || 1,
        stats: data.stats || this.stats,
        plots: data.plots || this.plots,
        resources: data.resources || this.resources,
        dailyRequests: data.dailyRequests || this.dailyRequests,
        lastReport: data.lastReport || null,
      });
      Object.keys(SKILLS).forEach((skill) => {
        if (typeof this.stats[skill] !== "number") this.stats[skill] = 0;
      });
      ["earned", "shipped", "harvested", "fish", "bugs", "requests", "crafted", "donated", "daysPlayed"].forEach((key) => {
        if (typeof this.stats[key] !== "number") this.stats[key] = 0;
      });
      this.refreshMail();
      this.checkAchievements();
      this.scene = SCENE.PLAYING;
      this.updateCamera();
      this.pushMessage("已读取存档。");
      return true;
    } catch (error) {
      console.error(error);
      this.pushMessage("存档读取失败，将开始新游戏。");
      this.newGame(true);
      return false;
    }
  }

  getSeasonIndex() {
    return Math.floor((this.day - 1) / 28) % SEASONS.length;
  }

  getSeason() {
    return SEASONS[this.getSeasonIndex()];
  }

  getSeasonDay() {
    return ((this.day - 1) % 28) + 1;
  }

  getFestival() {
    return FESTIVALS.find((festival) => festival.day === this.getSeasonDay()) || null;
  }

  getHour() {
    return Math.floor(this.minute / 60);
  }

  getTimeText() {
    const hour = Math.floor(this.minute / 60);
    const minute = Math.floor(this.minute % 60);
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }

  getTownScore() {
    return Object.values(this.projects).filter(Boolean).length * 20 + Object.keys(this.donated).length * 3 + this.decor * 6 + Math.round(Object.values(this.relationships).reduce((a, b) => a + b, 0) / 8);
  }

  pushMessage(text, life = 4.5) {
    this.messages.unshift({ text, life });
    this.messages = this.messages.slice(0, 5);
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    if (this.scene === SCENE.TITLE) {
      this.renderTitle();
      return;
    }
    this.renderTopHud();
    this.renderWorld();
    this.renderSidePanel();
    this.renderBottomBar();
    if (this.scene === SCENE.FISHING) this.renderFishing();
    else if (this.scene !== SCENE.PLAYING) this.renderModal();
  }

  renderTitle() {
    const ctx = this.ctx;
    const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    grad.addColorStop(0, "#9bd3e7");
    grad.addColorStop(0.46, "#bde0c3");
    grad.addColorStop(1, "#ead7a7");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    this.drawLandscape();
    this.panel(230, 122, 660, 410, 18, "rgba(247,240,221,0.92)", "rgba(31,45,42,0.14)");
    ctx.textAlign = "center";
    ctx.fillStyle = UI.ink;
    ctx.font = "bold 48px 'Microsoft YaHei', sans-serif";
    ctx.fillText("星禾镇物语", WIDTH / 2, 205);
    ctx.font = "18px 'Microsoft YaHei', sans-serif";
    ctx.fillStyle = UI.inkSoft;
    ctx.fillText("四季农场、邻里日常、收藏图鉴和镇务建设", WIDTH / 2, 244);
    ctx.font = "15px 'Microsoft YaHei', sans-serif";
    const lines = [
      "新版界面把任务与地图彻底分区：顶部状态栏、左侧世界、右侧管理、底部工具栏。",
      "经营农场，拜访居民，完成公告委托，把星禾镇一步步建设成有生命的小镇。",
      this.hasSave ? "Enter 读取存档  ·  N 新游戏  ·  L 读取存档" : "Enter 开始新游戏",
    ];
    lines.forEach((line, index) => ctx.fillText(line, WIDTH / 2, 302 + index * 32));
    this.panel(390, 440, 340, 48, 24, UI.dark, "rgba(255,255,255,0.18)");
    ctx.fillStyle = UI.cream;
    ctx.font = "bold 17px 'Microsoft YaHei', sans-serif";
    ctx.fillText(this.hasSave ? "按 Enter 继续生活" : "按 Enter 抵达星禾镇", WIDTH / 2, 471);
    ctx.textAlign = "left";
  }

  drawLandscape() {
    const ctx = this.ctx;
    ctx.fillStyle = "rgba(70,116,92,0.26)";
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.arc(40 + i * 106, 520 + Math.sin(i) * 16, 120, Math.PI, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(72,122,76,0.5)";
    ctx.fillRect(0, 548, WIDTH, 172);
    for (let i = 0; i < 38; i++) {
      const x = i * 34 + (i % 2) * 12;
      ctx.fillStyle = i % 3 === 0 ? "#d3b15f" : "#6d9d61";
      ctx.fillRect(x, 590 + (i % 5) * 4, 18, 68);
    }
  }

  renderTopHud() {
    const ctx = this.ctx;
    this.panel(0, 0, WIDTH, LAYOUT.top.h, 0, "#f8efd9", "rgba(31,45,42,0.16)");
    const season = this.getSeason();
    const weather = WEATHER[this.weather];
    const festival = this.getFestival();
    ctx.fillStyle = UI.ink;
    ctx.font = "bold 19px 'Microsoft YaHei', sans-serif";
    ctx.fillText("星禾镇物语", 20, 34);
    this.pill(172, 12, 142, 30, season.accent, `${season.name} ${this.getSeasonDay()}日`);
    this.pill(324, 12, 94, 30, UI.dark, this.getTimeText());
    this.pill(428, 12, 104, 30, UI.water, `${weather.icon} ${weather.name}`);
    this.pill(542, 12, 110, 30, UI.sun, `${this.gold} 金`);
    this.drawBar(664, 17, 156, 16, this.energy / this.maxEnergy, UI.leaf, "rgba(31,45,42,0.13)");
    ctx.fillStyle = UI.ink;
    ctx.font = "12px 'Microsoft YaHei', sans-serif";
    ctx.fillText(`体力 ${Math.round(this.energy)}/${this.maxEnergy}`, 674, 30);
    this.pill(842, 12, 98, 30, "#6f8c73", `评价 Lv${this.townRank}`);
    this.pill(950, 12, 150, 30, festival ? "#b57949" : "#839b89", festival ? festival.name : `明日 ${WEATHER[this.tomorrowWeather].name}`);
  }

  renderWorld() {
    const ctx = this.ctx;
    const r = LAYOUT.world;
    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();
    ctx.fillStyle = "#7dad6a";
    ctx.fillRect(r.x, r.y, r.w, r.h);

    const startX = Math.floor(this.camera.x / TILE);
    const endX = Math.ceil((this.camera.x + r.w) / TILE);
    const startY = Math.floor(this.camera.y / TILE);
    const endY = Math.ceil((this.camera.y + r.h) / TILE);
    for (let ty = startY; ty <= endY; ty++) {
      for (let tx = startX; tx <= endX; tx++) {
        if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) continue;
        this.drawTile(tx, ty, r.x + tx * TILE - this.camera.x, r.y + ty * TILE - this.camera.y);
      }
    }

    this.plots.forEach((plot) => this.drawPlot(plot));
    const entities = [
      ...this.objects,
      ...this.resources,
      ...this.npcs.map((npc) => ({ ...npc, kind: "npc" })),
      { kind: "player", x: this.player.x, y: this.player.y },
    ];
    entities.sort((a, b) => this.entityBottom(a) - this.entityBottom(b));
    entities.forEach((entity) => this.drawEntity(entity));
    this.drawInteractionHint();
    ctx.restore();
    ctx.strokeStyle = "rgba(31,45,42,0.22)";
    ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
  }

  drawTile(tx, ty, sx, sy) {
    const ctx = this.ctx;
    const kind = this.map[ty][tx];
    const colors = TILE_COLORS[kind] || TILE_COLORS[TILE_KIND.GRASS];
    ctx.fillStyle = (tx + ty) % 2 === 0 ? colors[0] : colors[1];
    ctx.fillRect(sx, sy, TILE, TILE);
    if (kind === TILE_KIND.WATER) {
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.beginPath();
      ctx.moveTo(sx + 4, sy + 17 + Math.sin(this.lastTime * 0.002 + tx) * 2);
      ctx.quadraticCurveTo(sx + 16, sy + 12, sx + 29, sy + 17 + Math.cos(this.lastTime * 0.002 + ty) * 2);
      ctx.stroke();
    } else if (kind === TILE_KIND.FOREST || kind === TILE_KIND.GRASS || kind === TILE_KIND.FLOWER) {
      ctx.fillStyle = kind === TILE_KIND.FLOWER ? "rgba(245,221,126,0.42)" : "rgba(255,255,255,0.07)";
      if ((tx * 13 + ty * 7) % 5 === 0) ctx.fillRect(sx + 8, sy + 8, 3, 12);
      if ((tx * 11 + ty * 3) % 7 === 0) ctx.fillRect(sx + 22, sy + 18, 3, 8);
    }
  }

  drawPlot(plot) {
    const sx = LAYOUT.world.x + plot.tx * TILE - this.camera.x;
    const sy = LAYOUT.world.y + plot.ty * TILE - this.camera.y;
    if (sx < -TILE || sy < LAYOUT.world.y - TILE || sx > LAYOUT.world.w || sy > LAYOUT.world.y + LAYOUT.world.h) return;
    const ctx = this.ctx;
    if (plot.tilled) {
      this.panel(sx + 3, sy + 4, TILE - 6, TILE - 7, 5, plot.watered ? "#6f5d4b" : "#815e43", "rgba(255,255,255,0.09)");
      ctx.strokeStyle = "rgba(42,27,16,0.2)";
      ctx.beginPath();
      ctx.moveTo(sx + 8, sy + 13);
      ctx.lineTo(sx + 25, sy + 13);
      ctx.moveTo(sx + 9, sy + 22);
      ctx.lineTo(sx + 24, sy + 21);
      ctx.stroke();
    }
    if (plot.crop) {
      const crop = CROPS[plot.crop];
      const progress = clamp(plot.age / crop.days, 0, 1);
      const cx = sx + TILE / 2;
      const base = sy + 24;
      ctx.strokeStyle = "#3f733d";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, base);
      ctx.lineTo(cx, base - 7 - progress * 13);
      ctx.stroke();
      ctx.fillStyle = progress >= 1 ? "#e0bd58" : "#69a85d";
      ctx.beginPath();
      ctx.ellipse(cx - 5, base - 7 - progress * 8, 6 + progress * 3, 4 + progress * 2, -0.5, 0, Math.PI * 2);
      ctx.ellipse(cx + 5, base - 9 - progress * 8, 6 + progress * 3, 4 + progress * 2, 0.5, 0, Math.PI * 2);
      ctx.fill();
      if (progress >= 1) {
        ctx.fillStyle = "#f2d06e";
        ctx.beginPath();
        ctx.arc(cx, base - 22, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  entityBottom(entity) {
    if (entity.kind === "building") return entity.y + entity.h;
    return entity.y + 16;
  }

  drawEntity(entity) {
    if (entity.kind === "building") return this.drawBuilding(entity);
    if (entity.kind === "tree") return this.drawTree(entity);
    if (entity.kind === "rock" || entity.kind === "ore") return this.drawRock(entity);
    if (entity.kind === "forage") return this.drawForage(entity);
    if (entity.kind === "bug") return this.drawBug(entity);
    if (entity.kind === "npc") return this.drawNpc(entity);
    if (entity.kind === "player") return this.drawPlayer();
  }

  drawBuilding(building) {
    const ctx = this.ctx;
    const x = LAYOUT.world.x + building.x - this.camera.x;
    const y = LAYOUT.world.y + building.y - this.camera.y;
    if (x > LAYOUT.world.w + 80 || x + building.w < -80 || y > HEIGHT || y + building.h < LAYOUT.world.y - 80) return;
    this.shadow(x + building.w / 2, y + building.h, building.w * 0.42, 12, 0.2);
    this.panel(x + 8, y + 28, building.w - 16, building.h - 24, 8, building.color, "rgba(31,45,42,0.18)");
    ctx.fillStyle = building.roof;
    ctx.beginPath();
    ctx.moveTo(x, y + 36);
    ctx.lineTo(x + building.w / 2, y + 4);
    ctx.lineTo(x + building.w, y + 36);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.24)";
    ctx.fillRect(x + 18, y + 48, 18, 18);
    ctx.fillRect(x + building.w - 36, y + 48, 18, 18);
    ctx.fillStyle = "rgba(70,45,32,0.55)";
    ctx.fillRect(x + building.w / 2 - 10, y + building.h - 32, 20, 32);
    ctx.fillStyle = UI.cream;
    ctx.font = "12px 'Microsoft YaHei', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(building.name, x + building.w / 2, y + 26);
    ctx.textAlign = "left";
  }

  drawTree(tree) {
    const ctx = this.ctx;
    const x = LAYOUT.world.x + tree.x - this.camera.x;
    const y = LAYOUT.world.y + tree.y - this.camera.y;
    this.shadow(x, y + 11, 17, 5, 0.18);
    ctx.fillStyle = "#7c5234";
    ctx.fillRect(x - 4, y - 3, 8, 24);
    ctx.fillStyle = "#3f7e48";
    ctx.beginPath();
    ctx.arc(x, y - 12, 20, 0, Math.PI * 2);
    ctx.arc(x - 13, y - 3, 15, 0, Math.PI * 2);
    ctx.arc(x + 13, y - 2, 15, 0, Math.PI * 2);
    ctx.fill();
  }

  drawRock(rock) {
    const ctx = this.ctx;
    const x = LAYOUT.world.x + rock.x - this.camera.x;
    const y = LAYOUT.world.y + rock.y - this.camera.y;
    this.shadow(x, y + 10, 14, 5, 0.16);
    ctx.fillStyle = rock.item === "crystal" ? "#9ebfc7" : rock.type === "ore" ? "#78888e" : "#888d88";
    ctx.beginPath();
    ctx.moveTo(x - 15, y + 10);
    ctx.lineTo(x - 9, y - 8);
    ctx.lineTo(x + 8, y - 13);
    ctx.lineTo(x + 16, y + 5);
    ctx.lineTo(x + 8, y + 15);
    ctx.closePath();
    ctx.fill();
    if (rock.type === "ore") {
      ctx.fillStyle = rock.item === "crystal" ? "#e0fbff" : "#c9e4ed";
      ctx.fillRect(x + 2, y - 5, 5, 5);
    }
  }

  drawForage(item) {
    const ctx = this.ctx;
    const x = LAYOUT.world.x + item.x - this.camera.x;
    const y = LAYOUT.world.y + item.y - this.camera.y;
    const color = {
      flower: "#e9c760",
      herb: "#6ab46d",
      berry: "#d35d70",
      mushroom: "#d99b79",
      shell: "#f0dfbd",
      coral: "#e98171",
      seaweed: "#4f8d61",
      pinecone: "#8f6a44",
      pearl: "#e6d8f2",
      honey: "#dcae45",
    }[item.item] || "#f0dfbd";
    this.shadow(x, y + 8, 9, 3, 0.12);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, item.item === "shell" ? 7 : 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillRect(x - 1, y - 4, 3, 3);
  }

  drawBug(bug) {
    const ctx = this.ctx;
    const x = LAYOUT.world.x + bug.x - this.camera.x + Math.sin(this.lastTime * 0.004 + bug.sway) * 4;
    const y = LAYOUT.world.y + bug.y - this.camera.y + Math.cos(this.lastTime * 0.005 + bug.sway) * 3;
    ctx.fillStyle = bug.item === "firefly" ? "#f2dd75" : bug.item === "beetle" ? "#3d5b45" : bug.item === "cicada" ? "#b58d55" : bug.item === "snowMoth" ? "#d7e8f0" : "#d789ad";
    ctx.beginPath();
    ctx.ellipse(x - 4, y, 6, 4, 0.4, 0, Math.PI * 2);
    ctx.ellipse(x + 4, y, 6, 4, -0.4, 0, Math.PI * 2);
    ctx.fill();
    if (bug.item === "firefly") {
      ctx.strokeStyle = "rgba(242,221,117,0.45)";
      ctx.beginPath();
      ctx.arc(x, y, 14 + Math.sin(this.lastTime * 0.006) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawNpc(npc) {
    const ctx = this.ctx;
    const x = LAYOUT.world.x + npc.x - this.camera.x;
    const y = LAYOUT.world.y + npc.y - this.camera.y;
    this.shadow(x, y + 15, 13, 4, 0.16);
    this.panel(x - 10, y - 8, 20, 26, 7, npc.color, "rgba(255,255,255,0.2)");
    ctx.fillStyle = "#efc9a5";
    ctx.beginPath();
    ctx.arc(x, y - 17, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = npc.color;
    ctx.fillRect(x - 12, y - 27, 24, 7);
    ctx.fillStyle = UI.cream;
    ctx.font = "10px 'Microsoft YaHei', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(npc.name, x, y - 34);
    ctx.textAlign = "left";
  }

  drawPlayer() {
    const ctx = this.ctx;
    const x = LAYOUT.world.x + this.player.x - this.camera.x;
    const y = LAYOUT.world.y + this.player.y - this.camera.y;
    const bob = Math.sin(this.player.step) * 1.5;
    this.shadow(x, y + 17, 14, 4, 0.22);
    ctx.strokeStyle = "#2f4b46";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 7, y + 10 + bob);
    ctx.lineTo(x - 10, y + 20 - bob);
    ctx.moveTo(x + 7, y + 10 - bob);
    ctx.lineTo(x + 10, y + 20 + bob);
    ctx.stroke();
    this.panel(x - 12, y - 8 + bob, 24, 30, 9, "#4f7fa2", "rgba(255,255,255,0.22)");
    ctx.fillStyle = "#efc9a5";
    ctx.beginPath();
    ctx.arc(x, y - 19 + bob, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#825543";
    ctx.fillRect(x - 13, y - 28 + bob, 26, 8);
    ctx.fillStyle = "#2f4b46";
    if (this.player.dir === "left" || this.player.dir === "right") {
      ctx.fillRect(x + (this.player.dir === "left" ? -5 : 4), y - 20 + bob, 3, 3);
    } else {
      ctx.fillRect(x - 5, y - 20 + bob, 3, 3);
      ctx.fillRect(x + 3, y - 20 + bob, 3, 3);
    }
  }

  drawInteractionHint() {
    const building = this.findNearestBuilding(54);
    const npc = this.findNearestNpc(58);
    const resource = this.findNearestResource(42, () => true);
    let text = "";
    if (building) text = `E 进入 ${building.name}`;
    else if (npc) text = `E 与 ${npc.name}交谈`;
    else if (resource && resource.tool === "hand") text = `E 拾取 ${itemName(resource.item)}`;
    else if (resource) text = `${resource.tool === "axe" ? "斧头" : resource.tool === "pick" ? "矿镐" : "捕虫网"} 可获取 ${itemName(resource.item)}`;
    const plot = this.getFacingPlot();
    if (!text && plot?.crop && this.isCropReady(plot)) text = `E 收获 ${CROPS[plot.crop].name}`;
    if (!text) return;
    const x = LAYOUT.world.x + this.player.x - this.camera.x;
    const y = LAYOUT.world.y + this.player.y - this.camera.y - 58;
    this.panel(x - 70, y, 140, 26, 13, "rgba(31,45,42,0.78)");
    this.ctx.fillStyle = UI.cream;
    this.ctx.font = "12px 'Microsoft YaHei', sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, x, y + 17);
    this.ctx.textAlign = "left";
  }

  renderSidePanel() {
    const ctx = this.ctx;
    const r = LAYOUT.side;
    this.panel(r.x, r.y, r.w, r.h, 0, "#f6ecd3", "rgba(31,45,42,0.18)");
    ctx.fillStyle = UI.ink;
    ctx.font = "bold 18px 'Microsoft YaHei', sans-serif";
    ctx.fillText("管理面板", r.x + 18, r.y + 31);
    SIDE_TABS.forEach((tab, index) => {
      const x = r.x + 16 + index * 68;
      this.panel(x, r.y + 46, 58, 26, 13, index === this.sideTab ? UI.dark : "rgba(31,45,42,0.08)");
      ctx.fillStyle = index === this.sideTab ? UI.cream : UI.inkSoft;
      ctx.font = "12px 'Microsoft YaHei', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(tab, x + 29, r.y + 63);
    });
    ctx.textAlign = "left";
    if (this.sideTab === 0) this.renderGoalsPanel(r);
    if (this.sideTab === 1) this.renderPeoplePanel(r);
    if (this.sideTab === 2) this.renderBagPanel(r);
    if (this.sideTab === 3) this.renderCollectionPanel(r);
  }

  renderGoalsPanel(r) {
    const ctx = this.ctx;
    let y = r.y + 100;
    this.sectionTitle("今日节奏", r.x + 18, y);
    y += 24;
    const festival = this.getFestival();
    const lines = [
      festival ? `节日：${festival.name}，${festival.desc}` : `明日天气：${WEATHER[this.tomorrowWeather].name}`,
      `出货箱：${Object.values(this.shipping).reduce((a, b) => a + b, 0)} 件，预计 ${Object.entries(this.shipping).reduce((sum, [id, count]) => sum + this.getSellPrice(id) * count, 0)} 金`,
      `牧场：${this.animals.length} 只，干草 ${this.inventory.hay || 0}`,
      `邮箱：${this.getUnreadMail().length} 封待读，成就 ${Object.keys(this.achievements).length}/${ACHIEVEMENTS.length}`,
    ];
    lines.forEach((line) => {
      this.wrapText(line, r.x + 20, y, 260, 17, UI.inkSoft, "12px 'Microsoft YaHei'");
      y += 28;
    });
    const topSkills = Object.keys(SKILLS).sort((a, b) => this.getSkillLevel(b) - this.getSkillLevel(a)).slice(0, 2);
    topSkills.forEach((skill) => {
      const info = SKILLS[skill];
      const level = this.getSkillLevel(skill);
      this.drawBar(r.x + 20, y + 3, 92, 7, this.getSkillProgress(skill), info.color, "rgba(31,45,42,0.12)");
      ctx.fillStyle = UI.inkSoft;
      ctx.font = "11px 'Microsoft YaHei', sans-serif";
      ctx.fillText(`${info.name} Lv${level}`, r.x + 122, y + 10);
      y += 17;
    });
    this.sectionTitle("公告委托", r.x + 18, y + 8);
    y += 36;
    this.dailyRequests.slice(0, 3).forEach((request) => {
      const ready = !request.done && (this.inventory[request.item] || 0) >= request.amount;
      this.panel(r.x + 16, y, 266, 44, 8, request.done ? "rgba(111,155,102,0.18)" : ready ? "rgba(215,173,97,0.2)" : "rgba(31,45,42,0.06)");
      ctx.fillStyle = UI.ink;
      ctx.font = "bold 12px 'Microsoft YaHei', sans-serif";
      ctx.fillText(`${request.done ? "完成" : ready ? "可交" : "委托"} ${request.title}`, r.x + 28, y + 18);
      ctx.fillStyle = UI.inkSoft;
      ctx.font = "11px 'Microsoft YaHei', sans-serif";
      ctx.fillText(`${itemName(request.item)} ${this.inventory[request.item] || 0}/${request.amount}  ·  ${request.gold}金`, r.x + 28, y + 36);
      y += 50;
    });
    this.sectionTitle("镇务工程", r.x + 18, y + 8);
    y += 36;
    const project = PROJECTS.find((item) => !this.projects[item.id]) || PROJECTS[PROJECTS.length - 1];
    this.panel(r.x + 16, y, 266, 76, 8, "rgba(31,45,42,0.06)");
    ctx.fillStyle = UI.ink;
    ctx.font = "bold 13px 'Microsoft YaHei', sans-serif";
    ctx.fillText(project.name, r.x + 28, y + 20);
    ctx.fillStyle = UI.inkSoft;
    ctx.font = "11px 'Microsoft YaHei', sans-serif";
    this.wrapText(formatReq(project.req), r.x + 28, y + 42, 236, 15, UI.inkSoft, "11px 'Microsoft YaHei'");
  }

  renderPeoplePanel(r) {
    let y = r.y + 96;
    VILLAGERS.forEach((npc) => {
      const favor = this.relationships[npc.id] || 0;
      this.panel(r.x + 16, y, 266, 58, 8, "rgba(31,45,42,0.06)");
      this.ctx.fillStyle = npc.color;
      this.ctx.beginPath();
      this.ctx.arc(r.x + 38, y + 28, 13, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = UI.ink;
      this.ctx.font = "bold 13px 'Microsoft YaHei', sans-serif";
      this.ctx.fillText(npc.name, r.x + 58, y + 22);
      this.ctx.fillStyle = UI.inkSoft;
      this.ctx.font = "11px 'Microsoft YaHei', sans-serif";
      this.ctx.fillText(npc.role, r.x + 58, y + 39);
      this.drawBar(r.x + 160, y + 24, 90, 8, favor / 100, npc.color, "rgba(31,45,42,0.12)");
      this.ctx.fillText(String(favor), r.x + 256, y + 31);
      y += 66;
    });
  }

  renderBagPanel(r) {
    const entries = Object.entries(this.inventory).filter(([, count]) => count > 0).slice(0, 13);
    let y = r.y + 96;
    this.sectionTitle(`背包 ${entries.length} 类`, r.x + 18, y);
    y += 26;
    entries.forEach(([id, count]) => {
      this.panel(r.x + 16, y, 266, 30, 8, "rgba(31,45,42,0.055)");
      this.ctx.fillStyle = UI.ink;
      this.ctx.font = "12px 'Microsoft YaHei', sans-serif";
      this.ctx.fillText(itemName(id), r.x + 28, y + 20);
      this.ctx.fillStyle = UI.inkSoft;
      this.ctx.textAlign = "right";
      this.ctx.fillText(`x${count}`, r.x + 266, y + 20);
      this.ctx.textAlign = "left";
      y += 36;
    });
    if (!entries.length) this.wrapText("背包空空。去采集、钓鱼、耕种或挖矿吧。", r.x + 20, y, 250, 18);
  }

  renderCollectionPanel(r) {
    const collected = Object.keys(this.collections).length;
    const donated = Object.keys(this.donated).length;
    let y = r.y + 96;
    this.sectionTitle("图鉴与博物馆", r.x + 18, y);
    y += 30;
    this.panel(r.x + 16, y, 266, 70, 8, "rgba(31,45,42,0.06)");
    this.ctx.fillStyle = UI.ink;
    this.ctx.font = "bold 18px 'Microsoft YaHei', sans-serif";
    this.ctx.fillText(`${collected} 已发现`, r.x + 30, y + 28);
    this.ctx.fillStyle = UI.inkSoft;
    this.ctx.font = "12px 'Microsoft YaHei', sans-serif";
    this.ctx.fillText(`${donated} 件已捐赠，评价分 ${this.getTownScore()}`, r.x + 30, y + 52);
    y += 92;
    COLLECTION_TYPES.forEach((type) => {
      const count = Object.keys(this.collections).filter((id) => ITEMS[id]?.type === type).length;
      const label = { fish: "鱼类", bug: "虫类", forage: "采集", material: "矿木", crop: "作物", artisan: "手作", ranch: "牧场" }[type];
      this.panel(r.x + 16, y, 266, 34, 8, "rgba(31,45,42,0.055)");
      this.ctx.fillStyle = UI.ink;
      this.ctx.font = "12px 'Microsoft YaHei', sans-serif";
      this.ctx.fillText(label, r.x + 28, y + 22);
      this.ctx.fillStyle = UI.inkSoft;
      this.ctx.textAlign = "right";
      this.ctx.fillText(`${count} 种`, r.x + 266, y + 22);
      this.ctx.textAlign = "left";
      y += 40;
    });
  }

  sectionTitle(text, x, y) {
    this.ctx.fillStyle = UI.ink;
    this.ctx.font = "bold 14px 'Microsoft YaHei', sans-serif";
    this.ctx.fillText(text, x, y);
  }

  renderBottomBar() {
    const ctx = this.ctx;
    const r = LAYOUT.bottom;
    this.panel(r.x, r.y, r.w, r.h, 0, "#efe2c4", "rgba(31,45,42,0.18)");
    TOOLS.forEach((tool, index) => {
      const x = 18 + index * 78;
      const active = index === this.selectedTool;
      this.panel(x, r.y + 11, 68, 52, 8, active ? UI.dark : "rgba(255,255,255,0.34)", active ? "rgba(255,255,255,0.2)" : "rgba(31,45,42,0.12)");
      ctx.fillStyle = active ? UI.cream : UI.ink;
      ctx.font = "bold 12px 'Microsoft YaHei', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${index + 1}. ${tool.name}`, x + 34, r.y + 30);
      ctx.font = "10px 'Microsoft YaHei', sans-serif";
      ctx.fillStyle = active ? "rgba(255,245,214,0.75)" : UI.inkSoft;
      ctx.fillText(tool.hint, x + 34, r.y + 47);
    });
    ctx.textAlign = "left";
    this.panel(656, r.y + 11, 166, 52, 8, "rgba(255,255,255,0.35)");
    ctx.fillStyle = UI.ink;
    ctx.font = "bold 12px 'Microsoft YaHei', sans-serif";
    ctx.fillText("当前种子", 670, r.y + 30);
    ctx.fillStyle = UI.inkSoft;
    ctx.font = "11px 'Microsoft YaHei', sans-serif";
    ctx.fillText(`${itemName(this.selectedSeed)} x${this.inventory[this.selectedSeed] || 0}`, 670, r.y + 48);
    this.panel(834, r.y + 11, 268, 52, 8, "rgba(31,45,42,0.08)");
    const hints = ["E 交互", "Space 使用工具", "Q 种子", "R 工具", "Tab 面板", "I 背包", "J 日志"];
    ctx.fillStyle = UI.inkSoft;
    ctx.font = "11px 'Microsoft YaHei', sans-serif";
    this.wrapText(hints.join("  ·  "), 848, r.y + 30, 238, 16, UI.inkSoft, "11px 'Microsoft YaHei'");
    this.renderMessages();
  }

  renderMessages() {
    const ctx = this.ctx;
    let y = LAYOUT.world.y + LAYOUT.world.h - 20;
    this.messages.slice(0, 3).forEach((message) => {
      const width = clamp(ctx.measureText(message.text).width + 28, 180, 560);
      this.panel(16, y - 27, width, 26, 13, "rgba(31,45,42,0.76)");
      ctx.fillStyle = UI.cream;
      ctx.font = "12px 'Microsoft YaHei', sans-serif";
      ctx.fillText(message.text, 30, y - 10);
      y -= 32;
    });
  }

  renderModal() {
    const ctx = this.ctx;
    ctx.fillStyle = "rgba(18,31,29,0.38)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    const config = this.getModalConfig();
    const x = (WIDTH - config.w) / 2;
    const y = (HEIGHT - config.h) / 2;
    this.panel(x, y, config.w, config.h, 16, "rgba(248,240,221,0.97)", "rgba(255,255,255,0.4)");
    ctx.fillStyle = UI.ink;
    ctx.font = "bold 22px 'Microsoft YaHei', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(config.title, WIDTH / 2, y + 38);
    ctx.textAlign = "left";
    if (config.subtitle) {
      ctx.fillStyle = UI.inkSoft;
      ctx.font = "12px 'Microsoft YaHei', sans-serif";
      ctx.fillText(config.subtitle, x + 28, y + 62);
    }
    this.renderModalTabs(x, y, config.w);
    if (this.scene === SCENE.JOURNAL) this.renderJournalContent(x, y, config.w, config.h);
    else this.renderMenuContent(x, y, config.w, config.h);
    ctx.fillStyle = UI.inkSoft;
    ctx.font = "12px 'Microsoft YaHei', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("↑↓ 选择  ·  Enter/E 确认  ·  Esc 返回", WIDTH / 2, y + config.h - 18);
    ctx.textAlign = "left";
  }

  getModalConfig() {
    const npcName = this.activeNpc?.name || "居民";
    const configs = {
      [SCENE.SHOP]: { title: "星禾杂货与集市", subtitle: "左右或 Tab 切换分类。", w: 690, h: 500 },
      [SCENE.HOUSE]: { title: "小屋安排", subtitle: `小屋 Lv${this.houseLevel}，装饰 ${this.decor}，明日 ${WEATHER[this.tomorrowWeather].name}。`, w: 690, h: 500 },
      [SCENE.WORKSHOP]: { title: "工坊制作", subtitle: "把原料加工成更高价值的商品或工具消耗品。", w: 690, h: 500 },
      [SCENE.TOWN]: { title: "镇务工程", subtitle: "长期建设会改变地图、商店、产出和小镇评价。", w: 760, h: 540 },
      [SCENE.REQUESTS]: { title: "公告委托", subtitle: "每日刷新，完成后立即获得金币与居民好感。", w: 720, h: 500 },
      [SCENE.MUSEUM]: { title: "星禾博物馆", subtitle: "首次发现的鱼、虫、作物、矿物和手作都可以捐赠。", w: 690, h: 500 },
      [SCENE.NPC]: { title: npcName, subtitle: `${this.activeNpc?.role || ""} · 好感 ${this.relationships[this.activeNpc?.id] || 0}/100`, w: 650, h: 500 },
      [SCENE.INVENTORY]: { title: "背包与出货", subtitle: "食物可食用，商品可逐个放入出货箱；材料默认保留。", w: 690, h: 500 },
      [SCENE.MAIL]: { title: "小屋邮箱", subtitle: "阅读信件可领取居民、镇务所和博物馆寄来的回礼。", w: 690, h: 500 },
      [SCENE.JOURNAL]: { title: "生活日志", subtitle: "左右或 Tab 切换日志页面。", w: 760, h: 540 },
    };
    return configs[this.scene] || { title: "菜单", w: 650, h: 480 };
  }

  renderModalTabs(x, y, w) {
    const tabs = this.scene === SCENE.SHOP ? SHOP_TABS : this.scene === SCENE.JOURNAL ? JOURNAL_TABS : [];
    if (!tabs.length) return;
    const active = this.scene === SCENE.JOURNAL ? this.journalTab : this.menuTab;
    tabs.forEach((tab, index) => {
      const tabW = 86;
      const tx = x + 28 + index * (tabW + 8);
      this.panel(tx, y + 76, tabW, 28, 14, active === index ? UI.dark : "rgba(31,45,42,0.08)");
      this.ctx.fillStyle = active === index ? UI.cream : UI.inkSoft;
      this.ctx.font = "12px 'Microsoft YaHei', sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.fillText(tab, tx + tabW / 2, y + 94);
    });
    this.ctx.textAlign = "left";
  }

  renderMenuContent(x, y, w, h) {
    const ctx = this.ctx;
    const items = this.getMenuItems();
    const startY = y + (this.getModalTabCount() > 1 ? 122 : 86);
    const rowH = 52;
    const maxRows = Math.floor((h - (startY - y) - 50) / rowH);
    const start = clamp(this.menuIndex - Math.floor(maxRows / 2), 0, Math.max(0, items.length - maxRows));
    items.slice(start, start + maxRows).forEach((item, offset) => {
      const index = start + offset;
      const rowY = startY + offset * rowH;
      const active = index === this.menuIndex;
      this.panel(x + 28, rowY, w - 56, rowH - 8, 9, active ? "rgba(31,45,42,0.12)" : "rgba(31,45,42,0.055)", active ? "rgba(31,45,42,0.18)" : "rgba(31,45,42,0.08)");
      ctx.fillStyle = item.disabled ? "rgba(31,45,42,0.35)" : UI.ink;
      ctx.font = "bold 13px 'Microsoft YaHei', sans-serif";
      ctx.fillText(item.label, x + 44, rowY + 19);
      ctx.font = "11px 'Microsoft YaHei', sans-serif";
      ctx.fillStyle = item.disabled ? "rgba(31,45,42,0.32)" : UI.inkSoft;
      ctx.fillText(item.detail || "", x + 44, rowY + 37);
      if (item.right) {
        ctx.textAlign = "right";
        ctx.fillStyle = item.disabled ? "rgba(31,45,42,0.32)" : UI.clay;
        ctx.fillText(item.right, x + w - 44, rowY + 27);
        ctx.textAlign = "left";
      }
    });
  }

  renderJournalContent(x, y, w, h) {
    const ctx = this.ctx;
    const contentX = x + 38;
    let yy = y + 126;
    ctx.fillStyle = UI.ink;
    ctx.font = "bold 15px 'Microsoft YaHei', sans-serif";
    if (this.journalTab === 0) {
      ctx.fillText(`${this.getSeason().name} ${this.getSeasonDay()}日 · 第 ${this.day} 天`, contentX, yy);
      yy += 30;
      this.wrapText(this.getSeason().desc, contentX, yy, w - 76, 20);
      yy += 58;
      FESTIVALS.forEach((festival) => {
        const active = festival.day === this.getSeasonDay();
        this.panel(contentX, yy, w - 76, 38, 8, active ? "rgba(215,173,97,0.22)" : "rgba(31,45,42,0.055)");
        ctx.fillStyle = active ? UI.ink : UI.inkSoft;
        ctx.font = active ? "bold 12px 'Microsoft YaHei'" : "12px 'Microsoft YaHei'";
        ctx.fillText(`${festival.day}日  ${festival.name}：${festival.desc}`, contentX + 14, yy + 24);
        yy += 46;
      });
    } else if (this.journalTab === 1) {
      const rows = [
        `金币 ${this.gold}，累计收入 ${this.stats.earned}`,
        `出货 ${this.stats.shipped} 件，收获 ${this.stats.harvested} 件，钓鱼 ${this.stats.fish} 次，捕虫 ${this.stats.bugs} 次`,
        `工具 Lv${this.toolLevel}，钓竿 Lv${this.rodLevel}，小屋 Lv${this.houseLevel}，装饰 ${this.decor}`,
        `牧场 ${this.animals.length} 只：${this.animals.map((animal) => `${animal.name}${animal.age >= animal.mature ? "" : "(幼年)"}`).join("、") || "暂无"}`,
        this.lastReport ? `昨日评级 ${this.lastReport.grade}：出货 ${this.lastReport.shippedValue} 金，作物成长 ${this.lastReport.grown} 块，牧场产物 ${this.lastReport.animalGoods} 件` : "还没有昨日结算。",
      ];
      rows.forEach((line) => {
        this.panel(contentX, yy, w - 76, 44, 8, "rgba(31,45,42,0.055)");
        this.wrapText(line, contentX + 14, yy + 18, w - 104, 16, UI.ink, "12px 'Microsoft YaHei'");
        yy += 52;
      });
    } else if (this.journalTab === 2) {
      Object.entries(SKILLS).forEach(([id, info]) => {
        const level = this.getSkillLevel(id);
        const xp = this.stats[id] || 0;
        this.panel(contentX, yy, w - 76, 44, 8, "rgba(31,45,42,0.055)");
        ctx.fillStyle = UI.ink;
        ctx.font = "bold 12px 'Microsoft YaHei'";
        ctx.fillText(`${info.name} Lv${level}`, contentX + 14, yy + 18);
        this.drawBar(contentX + 110, yy + 13, 190, 8, this.getSkillProgress(id), info.color, "rgba(31,45,42,0.12)");
        ctx.fillStyle = UI.inkSoft;
        ctx.font = "11px 'Microsoft YaHei'";
        ctx.fillText(`${xp} 经验`, contentX + 324, yy + 19);
        yy += 50;
      });
    } else if (this.journalTab === 3) {
      PROJECTS.forEach((project) => {
        const done = this.projects[project.id];
        this.panel(contentX, yy, w - 76, 42, 8, done ? "rgba(111,155,102,0.18)" : "rgba(31,45,42,0.055)");
        ctx.fillStyle = UI.ink;
        ctx.font = "bold 12px 'Microsoft YaHei'";
        ctx.fillText(`${done ? "完成" : "未完成"} · ${project.name}`, contentX + 14, yy + 18);
        ctx.fillStyle = UI.inkSoft;
        ctx.font = "11px 'Microsoft YaHei'";
        ctx.fillText(done ? project.desc : formatReq(project.req), contentX + 14, yy + 34);
        yy += 48;
      });
    } else if (this.journalTab === 4) {
      const entries = Object.keys(this.collections).sort((a, b) => itemName(a).localeCompare(itemName(b), "zh-CN"));
      this.wrapText(`已发现 ${entries.length} 种，已捐赠 ${Object.keys(this.donated).length} 种。`, contentX, yy, w - 76, 18);
      yy += 34;
      entries.slice(0, 48).forEach((id, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const bx = contentX + col * 220;
        const by = yy + row * 34;
        this.panel(bx, by, 200, 28, 7, this.donated[id] ? "rgba(111,155,102,0.16)" : "rgba(31,45,42,0.055)");
        ctx.fillStyle = UI.ink;
        ctx.font = "11px 'Microsoft YaHei'";
        ctx.fillText(`${this.donated[id] ? "捐" : "藏"} ${itemName(id)}`, bx + 10, by + 18);
      });
    } else {
      ACHIEVEMENTS.forEach((achievement) => {
        const done = this.achievements[achievement.id];
        this.panel(contentX, yy, w - 76, 42, 8, done ? "rgba(111,155,102,0.18)" : "rgba(31,45,42,0.055)");
        ctx.fillStyle = done ? UI.ink : UI.inkSoft;
        ctx.font = "bold 12px 'Microsoft YaHei'";
        ctx.fillText(`${done ? "达成" : "未达成"} · ${achievement.title}`, contentX + 14, yy + 18);
        ctx.font = "11px 'Microsoft YaHei'";
        ctx.fillText(achievement.desc, contentX + 14, yy + 34);
        yy += 48;
      });
    }
  }

  renderFishing() {
    const ctx = this.ctx;
    const fish = this.fishing;
    ctx.fillStyle = "rgba(18,31,38,0.5)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    const x = 410;
    const y = 150;
    this.panel(x, y, 300, 420, 18, "rgba(239,246,244,0.97)", "rgba(255,255,255,0.36)");
    ctx.textAlign = "center";
    ctx.fillStyle = UI.ink;
    ctx.font = "bold 22px 'Microsoft YaHei'";
    ctx.fillText(fish.area === "sea" ? "月湾钓鱼" : "溪流钓鱼", x + 150, y + 42);
    if (fish.phase === "waiting" || fish.phase === "bite") {
      ctx.fillStyle = fish.phase === "bite" ? UI.red : UI.water;
      ctx.font = "bold 16px 'Microsoft YaHei'";
      ctx.fillText(fish.phase === "bite" ? "上钩了！按 Space！" : "等待浮标动静...", x + 150, y + 208);
      ctx.strokeStyle = "rgba(94,157,184,0.35)";
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(x + 150, y + 205, 30 + i * 18 + Math.sin(this.lastTime * 0.004 + i) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    if (fish.phase === "reeling") {
      const trackX = x + 72;
      const trackY = y + 78;
      this.panel(trackX, trackY, 56, 270, 24, "rgba(94,157,184,0.16)", "rgba(94,157,184,0.28)");
      this.panel(trackX + 76, trackY, 42, 270, 18, "rgba(31,45,42,0.1)");
      const fishY = trackY + fish.fishY;
      ctx.fillStyle = UI.water;
      ctx.beginPath();
      ctx.ellipse(trackX + 28, fishY, 17, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      const barY = trackY + fish.barY;
      this.panel(trackX + 8, barY, 40, 62, 16, "rgba(111,155,102,0.72)", "rgba(255,255,255,0.18)");
      this.panel(trackX + 80, trackY + 270 * (1 - fish.progress / 100), 34, Math.max(8, 270 * (fish.progress / 100)), 14, fish.progress > 55 ? UI.leaf : UI.sun);
      ctx.fillStyle = UI.inkSoft;
      ctx.font = "12px 'Microsoft YaHei'";
      ctx.fillText("按住 Space 上升，松开下降", x + 150, y + 380);
    }
    if (fish.phase === "result") {
      ctx.fillStyle = fish.result?.fail ? UI.red : UI.leaf;
      ctx.font = "bold 20px 'Microsoft YaHei'";
      ctx.fillText(fish.result?.text || "", x + 150, y + 210);
      ctx.fillStyle = UI.inkSoft;
      ctx.font = "13px 'Microsoft YaHei'";
      ctx.fillText("按 Enter 返回", x + 150, y + 246);
    }
    ctx.textAlign = "left";
  }

  panel(x, y, w, h, radius = 8, fill = UI.paper, stroke = "") {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    this.roundRectPath(x, y, w, h, radius);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
    ctx.restore();
  }

  pill(x, y, w, h, fill, text) {
    this.panel(x, y, w, h, h / 2, fill, "rgba(255,255,255,0.16)");
    this.ctx.fillStyle = fill === UI.dark ? UI.cream : "#fff7df";
    if (fill === UI.sun || fill === "#839b89") this.ctx.fillStyle = UI.ink;
    this.ctx.font = "bold 12px 'Microsoft YaHei', sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, x + w / 2, y + h / 2 + 4);
    this.ctx.textAlign = "left";
  }

  roundRectPath(x, y, w, h, radius) {
    const r = Math.min(radius, w / 2, h / 2);
    const ctx = this.ctx;
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }

  drawBar(x, y, w, h, value, fill, bg) {
    this.panel(x, y, w, h, h / 2, bg);
    this.panel(x, y, Math.max(h, w * clamp(value, 0, 1)), h, h / 2, fill);
  }

  shadow(x, y, rx, ry, alpha) {
    const ctx = this.ctx;
    ctx.fillStyle = `rgba(22,33,30,${alpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  wrapText(text, x, y, maxWidth, lineHeight = 18, color = UI.inkSoft, font = "12px 'Microsoft YaHei'") {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.font = font;
    const chars = String(text).split("");
    let line = "";
    let yy = y;
    for (const char of chars) {
      const test = line + char;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, yy);
        line = char;
        yy += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, yy);
    return yy + lineHeight;
  }
}
