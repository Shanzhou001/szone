# 温馨小镇（Cozy Town）

> 基于 `HTML + CSS + JavaScript + Canvas` 的原创单机 2D 游戏原型。当前仓库已支持 **Electron Windows 桌面封装 + GitHub Actions 自动打包发布**。

当前进度：**阶段 2（最小可玩版）+ Windows 桌面发布流程**

---

## 1. 项目结构

```text
.
├── .github/
│   └── workflows/
│       └── release-windows.yml
├── electron/
│   ├── main.js
│   └── preload.js
├── src/
│   ├── game.js
│   └── main.js
├── index.html
├── styles.css
├── package.json
└── README.md
```

---

## 2. Electron 桌面封装说明

当前桌面版方案遵循“**尽量复用现有前端代码，不重写游戏逻辑**”：

- Electron 主进程入口：`electron/main.js`
- 渲染内容直接加载：`index.html`
- 原有游戏逻辑保持在：`src/game.js`、`src/main.js`
- 预加载脚本：`electron/preload.js`（当前作为安全扩展预留）

因此浏览器版和桌面版共享同一套游戏代码。

---

## 3. 本地开发与运行

> 建议 Node.js 20（最低 Node.js 18+ 也可尝试）。

### 3.1 安装依赖

```bash
npm install
```

### 3.2 启动桌面应用（开发模式）

```bash
npm run dev
```

或：

```bash
npm start
```

---

## 4. 本地打包（Windows）

### 4.1 生成 unpacked 目录（调试打包产物）

```bash
npm run pack
```

### 4.2 生成 Windows 可分发文件

```bash
npm run dist:win
```

当前 `electron-builder` 会生成以下目标：

- `portable`（可直接运行的 `.exe`，优先）
- `nsis`（安装程序 `.exe`）

默认输出目录：

```text
release/
```

---

## 5. GitHub Actions 自动构建 + 发布 Releases

仓库已包含工作流：

- `.github/workflows/release-windows.yml`

触发条件：

- 推送符合 `v*` 的 tag（例如 `v0.1.0`）

运行环境：

- `windows-latest`

工作流执行步骤：

1. 检出代码
2. 安装 Node.js 20
3. `npm install` 安装依赖
4. 运行 `npm run release:win`（electron-builder）
5. 显式上传构建产物到 Actions Artifacts（便于每次运行直接下载）
6. 显式创建/更新对应 tag 的 GitHub Release，并上传附件（不只依赖 electron-builder 的隐式 publish）

> 对于同一个 tag：若 Release 不存在会自动创建；若已存在会自动更新并覆盖同名附件。

---

## 6. 如何触发一次正式发布

在本地完成代码合并后，执行：

```bash
git tag v0.1.0
git push origin v0.1.0
```

随后 GitHub Actions 会自动开始构建并发布。

> 如果要发布下一个版本，按语义化版本号递增，例如：`v0.1.1`、`v0.2.0`。

---

## 7. 发布后会产出什么文件

推送 `v*` tag（如 `v0.1.4`）后，可在两个位置下载 Windows 构建产物：

1. **GitHub Actions > 对应 workflow run > Artifacts**
2. **GitHub Releases > 对应 tag 的 Release Assets**

两处都应至少包含：

- `CozyTownPrototype-<version>-x64-portable.exe`（便携版）
- `CozyTownPrototype-<version>-x64-nsis.exe`（安装版）
- `latest.yml`（electron-builder 自动生成，用于更新元数据）

文件名中的 `<version>` 来自 `package.json` 的 `version` 字段。

---

## 8. 浏览器版运行方式（保留）

如需浏览器运行：

```bash
python3 -m http.server 8000
```

打开：

```text
http://localhost:8000
```

---

## 9. 阶段 2 操作说明（桌面版同样适用）

- `Enter`：从标题界面进入游戏
- `WASD` 或 `方向键`：移动角色
- `E`：与附近物体互动 / 收集
