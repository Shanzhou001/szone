# 温馨小镇（Cozy Town）

> 一个受“温馨生活模拟”设计方向启发、但完全原创内容的单机 2D 游戏原型。当前已在原生浏览器版基础上，新增 **Electron Windows 桌面版封装**。

当前进度：**阶段 2（最小可玩版）+ Windows 桌面原型**

---

## 本次新增：Electron 桌面版封装

本次改造目标是“尽量复用现有前端代码，不重写游戏逻辑”，因此保留了原有：

- `index.html`
- `styles.css`
- `src/main.js`
- `src/game.js`

仅新增最少必要的 Electron 入口、配置与打包脚本，让项目可以：

1. 作为桌面应用启动（开发模式）
2. 具备后续生成 Windows `exe` 安装包的基础

---

## 当前目录结构

```text
.
├── .gitignore
├── README.md
├── index.html
├── styles.css
├── package.json
├── electron/
│   ├── main.js
│   └── preload.js
└── src/
    ├── game.js
    └── main.js
```

---

## 新增/变更文件说明

### 新增文件

- `package.json`
  - 增加 Electron 与 electron-builder 依赖
  - 增加桌面运行脚本与 Windows 打包脚本
  - 增加 `build` 配置（输出目录、打包内容、win target）

- `electron/main.js`
  - Electron 主进程入口
  - 创建 `BrowserWindow`
  - 加载现有 `index.html`（复用前端）

- `electron/preload.js`
  - 预留 preload（当前不注入业务逻辑，仅保留安全扩展位）

- `.gitignore`
  - 忽略 `node_modules/`、`release/` 等构建产物

### 保持不变（核心玩法逻辑）

- `src/game.js`
- `src/main.js`

> 即：阶段 2 的移动、互动、收集、HUD 逻辑无需重写，直接运行在 Electron 渲染进程。

---

## 开发运行（桌面版）

> 下面命令在 Windows PowerShell / CMD（安装 Node.js 18+）中均可使用。

### 1) 安装依赖

```bash
npm install
```

### 2) 启动 Electron 桌面应用

```bash
npm run dev
```

启动后将打开桌面窗口并加载当前游戏页面。

---

## 打包（Windows）

### 1) 生成可分发目录（不打安装包）

```bash
npm run pack
```

### 2) 生成 Windows 安装包（exe）

```bash
npm run dist:win
```

默认输出目录：

```text
release/
```

`dist:win` 成功后，会在 `release/` 下生成 `.exe` 安装包（NSIS 目标）。

---

## 浏览器版运行方式（保留）

如需继续以浏览器模式运行：

### 1) 启动本地静态服务器

```bash
python3 -m http.server 8000
```

### 2) 打开浏览器

```text
http://localhost:8000
```

---

## 操作说明（阶段 2）

- `Enter`：从标题界面进入游戏
- `WASD` 或 `方向键`：移动角色
- `E`：与附近物体互动 / 收集

---

## 验证方式（Done Checklist）

按以下步骤手动验证：

1. 执行 `npm run dev`，桌面窗口可正常打开。
2. 进入标题界面后按 `Enter` 能进入游戏。
3. 角色可用 `WASD`/方向键移动。
4. 走到小树、圆石、木屋附近会出现互动提示。
5. 按 `E` 可触发互动文本。
6. 与可收集物体互动后，左上角 HUD 计数会增加。

若以上都满足，则“桌面封装 + 阶段 2玩法可运行”完成。

---

## 技术约束（保持不变）

- 仍使用原生 `HTML + CSS + JavaScript + Canvas`
- 不引入 Phaser、React 等大型游戏/前端框架
- 仅增加 Electron 最小入口与打包配置，便于后续迭代为正式桌面版
