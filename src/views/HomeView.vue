<template>
  <div>
    <div class="home-hero">
      <div style="font-size:48px">⚡</div>
      <h1>Vue3 性能优化实验室</h1>
      <p>每个实验室都提供「优化前 vs 优化后」可量化对比，配合 DevTools 同步观察</p>
    </div>

    <div class="tip-box tip-box--info">
      <strong>🗺️ 建议学习顺序</strong>
      先跑 Lighthouse 拿到基线分数 → 按顺序过每个实验室 → 每次优化后再跑 Lighthouse 对比。
      每个实验室都有「在 DevTools 里看什么」提示。
    </div>

    <div class="lab-grid">
      <RouterLink
        v-for="item in labs"
        :key="item.path"
        :to="item.path"
        class="lab-entry"
      >
        <div class="lab-entry__icon">{{ item.icon }}</div>
        <div class="lab-entry__title">{{ item.title }}</div>
        <div class="lab-entry__desc">{{ item.desc }}</div>
      </RouterLink>
    </div>

    <div class="lab-card" style="margin-top:32px">
      <h2>📊 如何配合 DevTools 使用</h2>
      <p>每次进入实验室前，先按下面步骤打开对应面板</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="border-bottom:1px solid var(--color-border)">
            <th style="text-align:left;padding:8px 0;color:var(--color-text-muted);font-weight:500">实验室</th>
            <th style="text-align:left;padding:8px 0;color:var(--color-text-muted);font-weight:500">推荐面板</th>
            <th style="text-align:left;padding:8px 0;color:var(--color-text-muted);font-weight:500">重点观察</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in devtipsRows" :key="row.lab" style="border-bottom:1px solid var(--color-border)">
            <td style="padding:10px 0;font-weight:500">{{ row.lab }}</td>
            <td style="padding:10px 0;color:var(--color-primary)">{{ row.panel }}</td>
            <td style="padding:10px 0;color:var(--color-text-muted)">{{ row.tip }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const labs = [
  { path: '/lab/computed',       icon: '🧮', title: '计算属性缓存',   desc: 'computed vs method，理解缓存机制与何时失效' },
  { path: '/lab/virtual-list',   icon: '📋', title: '虚拟列表',       desc: '渲染 10 万条数据，帧率保持 60fps' },
  { path: '/lab/lazy-component', icon: '📦', title: '异步组件懒加载', desc: 'defineAsyncComponent 按需加载，减少首屏 JS' },
  { path: '/lab/keep-alive',     icon: '♻️',  title: 'KeepAlive 缓存',  desc: '切换 Tab 时复用组件实例，避免重复渲染' },
  { path: '/lab/v-memo',         icon: '🔒', title: 'v-memo / v-once', desc: '跳过不变节点的 diff，配合大列表使用' },
  { path: '/lab/debounce',       icon: '⏱️',  title: '防抖 & 节流',    desc: '搜索框 / 滚动事件，避免过度触发' },
  { path: '/lab/image-lazy',     icon: '🖼️',  title: '图片懒加载',     desc: 'IntersectionObserver 实现视口内才加载' },
  { path: '/lab/web-worker',     icon: '🧵', title: 'Web Worker',     desc: '重计算移到 Worker 线程，主线程不卡顿' },
]

const devtipsRows = [
  { lab: '计算属性',   panel: 'Performance',          tip: 'Flame Chart — JS 执行次数' },
  { lab: '虚拟列表',   panel: 'Performance',          tip: 'FPS 指标、Layout 时间' },
  { lab: '异步组件',   panel: 'Network',              tip: 'Waterfall — chunk 文件何时加载' },
  { lab: 'KeepAlive', panel: 'Vue DevTools',          tip: 'Component 树 — 组件是否销毁' },
  { lab: 'v-memo',    panel: 'Performance',          tip: 'Recalculate Style 次数' },
  { lab: '防抖节流',   panel: 'Performance',          tip: 'Event 触发频率' },
  { lab: '图片懒加载', panel: 'Network',              tip: 'img 请求发出时机' },
  { lab: 'Worker',    panel: 'Performance → Threads', tip: 'Worker 线程 vs 主线程' },
]
</script>
