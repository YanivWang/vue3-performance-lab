# Vue3 性能优化实验室

基于 Vue3 + Vite 的性能优化实战学习项目，每个实验室提供「优化前 vs 优化后」可量化对比。

## 快速开始

```bash
npm install
npm run dev        # 开发服务器
npm run build      # 生产构建
npm run preview    # 预览构建产物（Lighthouse 需要这个）
npm run build:analyze  # 构建 + 打开 bundle 体积分析
```

## 实验室列表

| 实验室 | 核心知识点 | DevTools 面板 |
|--------|-----------|--------------|
| 计算属性缓存 | computed vs method，dirty flag | Performance → Flame Chart |
| 虚拟列表 | 只渲染可见 DOM | Performance → FPS |
| 异步组件懒加载 | defineAsyncComponent，动态 import | Network → Waterfall |
| KeepAlive 缓存 | 组件实例复用 | Vue DevTools → Component |
| v-memo / v-once | 跳过 diff | Performance → patch 时间 |
| 防抖 & 节流 | 控制高频事件 | Performance → Main 线程密度 |
| 图片懒加载 | IntersectionObserver | Network → Img 请求时机 |
| Web Worker | 主线程卸载 | Performance → Threads |

## 学习建议

1. `npm run preview` 启动后，先用 Lighthouse 跑一次基线报告
2. 按顺序进入每个实验室，先点"❌ 坏的方案"感受问题
3. 再看"✅ 好的方案"，对比数字差异
4. 打开对应 DevTools 面板验证原理
5. 优化后再跑 Lighthouse 对比分数
