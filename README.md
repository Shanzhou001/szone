# 温馨小镇（Cozy Town）

一个基于 **HTML5 Canvas + JavaScript** 的 2D 生活模拟游戏原型，支持 **Electron 桌面运行（Windows）** 与自动化发布。

---

## Features

- 🌿 小镇探索（大地图 + 相机跟随）
- 🗣️ NPC 对话与互动
- ⛏️ 资源采集与再生
- 🎣 钓鱼小游戏（判定条机制）
- 🛒 商店买卖系统
- 🎒 背包、任务、成就
- ⏰ 昼夜与时间流逝
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
- `E` 互动 / 对话
- `I` 背包
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
