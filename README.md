# Vue3 性能优化实验室

基于 Vue3 + Vite + TypeScript 的性能优化实战学习项目。每个实验室提供「优化前 vs 优化后」可量化对比，配合 DevTools 与 Web Vitals 仪表盘同步观察。

## 快速开始

本项目使用 **pnpm** 管理依赖，Node 版本锁定为 **20.19.5**。

```bash
nvm use          # 或 fnm use
corepack enable
pnpm install
pnpm dev              # 开发服务器
pnpm build            # 生产构建
pnpm preview          # 预览构建产物（Lighthouse / Web Vitals 需要这个）
pnpm build:analyze    # 构建 + 打开 bundle 体积分析
pnpm test:run         # 运行工具函数单元测试
pnpm typecheck        # TypeScript 类型检查
pnpm lint             # ESLint 检查
pnpm lint:style       # Stylelint 检查（样式 / Vue SFC）
pnpm format           # Prettier 格式化
pnpm format:check     # Prettier 检查（不写入）
pnpm lint:all         # ESLint + Stylelint + Prettier 一并检查
```

## GitHub Pages 部署

仓库已配置 GitHub Actions（`.github/workflows/deploy.yml`），推送到 `main` 分支后会自动构建并部署。

**首次启用：**

1. 打开 GitHub 仓库 → **Settings** → **Pages**
2. **Build and deployment** → Source 选择 **GitHub Actions**
3. 推送代码到 `main`，等待 workflow 完成

**访问地址：** https://yanivwang.github.io/vue3-performance-lab/

本地模拟 Pages 构建（含子路径 base）：

```bash
pnpm build:pages
pnpm preview:pages
```

## 学习路径

1. `pnpm preview` 启动后，打开 **性能仪表盘**（`/dashboard`）记录 Web Vitals 基线
2. 按「渲染 → 加载 → 运行时」顺序进入各实验室
3. 先体验 ❌ 坏方案，再对比 ✅ 好方案，观察页面指标差异
4. 打开对应 DevTools 面板验证原理（每个 Lab 内有提示）
5. 回到仪表盘保存快照，对比优化前后数据

## 实验室列表

| 分类   | 实验室               | 核心知识点                                |
| ------ | -------------------- | ----------------------------------------- |
| 渲染   | 计算属性缓存         | computed vs method，dirty flag            |
| 渲染   | 虚拟列表             | 只渲染可见 DOM，useVirtualList composable |
| 渲染   | v-memo / v-once      | 跳过 diff                                 |
| 渲染   | v-show vs v-if       | 条件渲染 vs 条件展示，DOM 开销与切换性能  |
| 渲染   | shallowRef / markRaw | 大对象浅层响应式                          |
| 渲染   | KeepAlive            | 组件实例复用，max / activated 生命周期    |
| 加载   | 异步组件懒加载       | defineAsyncComponent + ECharts 真实 chunk |
| 加载   | 图片懒加载           | 共享 Observer vs loading="lazy"           |
| 运行时 | 防抖 & 节流          | 控制高频事件                              |
| 运行时 | Web Worker           | Vite Worker 打包，主线程卸载              |

## 项目结构

```
src/
  config/labs.ts          # 实验室单一数据源（路由/导航/DevTips 共用）
  composables/            # useVirtualList、共享懒加载 Observer
  utils/                  # fibonacci、debounce、throttle、measureRender
  workers/                # fib.worker.ts（Vite Worker 示例）
  components/             # 可复用演示组件
  views/lab/              # 各实验室页面
  views/DashboardView.vue # Web Vitals 仪表盘
```

## DevTools 对照表

| 实验室         | 推荐面板               | 重点观察                          |
| -------------- | ---------------------- | --------------------------------- |
| 计算属性       | Performance            | Flame Chart 中 fibonacci 调用次数 |
| 虚拟列表       | Performance            | FPS、Layout 时间                  |
| v-memo         | Performance            | patch 耗时                        |
| v-show vs v-if | Elements + Performance | DOM 增删 vs display 切换          |
| shallowRef     | Performance            | 初始化/更新 JS 时长               |
| KeepAlive      | Vue DevTools           | 组件是否销毁                      |
| 异步组件       | Network                | chunk 加载时机与体积              |
| 图片懒加载     | Network                | img 请求数量与时机                |
| 防抖节流       | Performance            | Main 线程 Task 密度               |
| Worker         | Performance → Threads  | Long Task vs Worker 线程          |
