# 晨露小镇（Cozy Town）

一个基于 **HTML5 Canvas + JavaScript** 的 2D 生活模拟游戏原型，支持 **Electron 桌面运行（Windows）** 与自动化发布。

---

## Features

- 🌿 多区域探索（晨露镇、雾林、月湾、高地）
- 🌾 农场种植、地块扩建与九种作物
- 🐔 牧场动物、喂养、成熟产物与亲密度
- 🥣 小屋料理、加工坊手作商品与矿石熔锭
- 🗣️ NPC 对话、赠礼、每日委托与关系成长
- 🎣 钓鱼小游戏、天气与夜钓收益
- 📦 出货箱批量出售、工具/鱼竿升级与灌溉水渠
- 🏗️ 镇务工程捐献目标与长期解锁
- 📅 四季、节日、集市日、收藏图鉴与生活日志
- 💾 本地存档（localStorage）

---

## Tech Stack

- **Runtime:** Browser / Electron
- **Rendering:** HTML5 Canvas 2D
- **Language:** Vanilla JavaScript (ESM)
- **Packaging:** electron-builder
- **CI/CD:** GitHub Actions + GitHub Releases

---

## Project Structure

```text
.
├── electron/
│   ├── main.js
│   └── preload.js
├── src/
│   ├── game.js
│   └── main.js
├── index.html
├── styles.css
└── package.json
```

---

## Quick Start

> Node.js 20+ (18+ 可运行但不保证一致性)

```bash
npm install
npm run dev
```

可选：

```bash
npm start
```

---

## Controls

- `Enter` 开始游戏
- `WASD / 方向键` 移动
- `E` 互动 / 对话 / 提交工程 / 使用出货箱
- `Q` 切换当前种子
- `G` 给附近居民赠礼
- `I` 背包
- `J` 生活日志
- `Space` 钓鱼操作
- `Tab` 商店买卖切换
- `F5` 存档
- `Esc` 关闭当前面板

---

## Build (Windows)

```bash
npm run pack       # 生成 unpacked
npm run dist:win   # 生成 portable + nsis
```

输出目录：`release/`

---

## Release

推送版本 tag（`v*`）后，GitHub Actions 自动构建并发布到 Releases。

```bash
git tag v0.1.0
git push origin v0.1.0
```

---

## License

MIT
