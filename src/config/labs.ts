import type { Component } from 'vue'

export type LabCategory = 'render' | 'load' | 'runtime'

export interface LabConfig {
  path: string
  icon: string
  title: string
  desc: string
  order: number
  category: LabCategory
  devPanel: string
  devTip: string
  load: () => Promise<{ default: Component }>
}

export const categoryLabels: Record<LabCategory, string> = {
  render: '渲染性能',
  load: '加载性能',
  runtime: '运行时性能',
}

export const labs: LabConfig[] = [
  {
    path: '/lab/computed',
    icon: '🧮',
    title: '计算属性缓存',
    desc: 'computed vs method，理解缓存机制与何时失效',
    order: 1,
    category: 'render',
    devPanel: 'Performance',
    devTip: 'Flame Chart — 搜索 fibonacci，对比调用次数',
    load: () => import('@/views/lab/ComputedLab.vue'),
  },
  {
    path: '/lab/virtual-list',
    icon: '📋',
    title: '虚拟列表',
    desc: '渲染 10 万条数据，帧率保持 60fps',
    order: 2,
    category: 'render',
    devPanel: 'Performance',
    devTip: 'FPS 折线图、Layout 时间',
    load: () => import('@/views/lab/VirtualListLab.vue'),
  },
  {
    path: '/lab/v-memo',
    icon: '🔒',
    title: 'v-memo / v-once',
    desc: '跳过不变节点的 diff，配合大列表使用',
    order: 3,
    category: 'render',
    devPanel: 'Performance',
    devTip: 'patch / processFragment 耗时',
    load: () => import('@/views/lab/VMemoLab.vue'),
  },
  {
    path: '/lab/v-show-if',
    icon: '👁️',
    title: 'v-show vs v-if',
    desc: '条件渲染 vs 条件展示，DOM 开销与切换性能',
    order: 4,
    category: 'render',
    devPanel: 'Elements + Performance',
    devTip: 'DOM 增删 vs display 切换、连切 20 次耗时',
    load: () => import('@/views/lab/VShowIfLab.vue'),
  },
  {
    path: '/lab/shallow-ref',
    icon: '🪶',
    title: 'shallowRef / markRaw',
    desc: '大对象避免深度响应式，降低追踪开销',
    order: 5,
    category: 'render',
    devPanel: 'Performance',
    devTip: 'trigger 次数、JS 执行时长',
    load: () => import('@/views/lab/ShallowRefLab.vue'),
  },
  {
    path: '/lab/keep-alive',
    icon: '♻️',
    title: 'KeepAlive 缓存',
    desc: '切换 Tab 时复用组件实例，避免重复渲染',
    order: 6,
    category: 'render',
    devPanel: 'Vue DevTools',
    devTip: 'Component 树 — 组件是否销毁',
    load: () => import('@/views/lab/KeepAliveLab.vue'),
  },
  {
    path: '/lab/lazy-component',
    icon: '📦',
    title: '异步组件懒加载',
    desc: 'defineAsyncComponent 按需加载，减少首屏 JS',
    order: 7,
    category: 'load',
    devPanel: 'Network',
    devTip: 'Waterfall — chunk 何时加载、体积多大',
    load: () => import('@/views/lab/LazyComponentLab.vue'),
  },
  {
    path: '/lab/image-lazy',
    icon: '🖼️',
    title: '图片懒加载',
    desc: 'IntersectionObserver / loading=lazy，视口内才加载',
    order: 8,
    category: 'load',
    devPanel: 'Network',
    devTip: 'img 请求发出时机与数量',
    load: () => import('@/views/lab/ImageLazyLab.vue'),
  },
  {
    path: '/lab/debounce',
    icon: '⏱️',
    title: '防抖 & 节流',
    desc: '搜索框 / 滚动事件，避免过度触发',
    order: 9,
    category: 'runtime',
    devPanel: 'Performance',
    devTip: 'Main 线程 Task 密度',
    load: () => import('@/views/lab/DebounceThrottleLab.vue'),
  },
  {
    path: '/lab/web-worker',
    icon: '🧵',
    title: 'Web Worker',
    desc: '重计算移到 Worker 线程，主线程不卡顿',
    order: 10,
    category: 'runtime',
    devPanel: 'Performance → Threads',
    devTip: 'Long Task vs Worker 线程',
    load: () => import('@/views/lab/WebWorkerLab.vue'),
  },
].sort((a, b) => a.order - b.order) as LabConfig[]

export const labsByCategory = (category: LabCategory) =>
  labs.filter((lab) => lab.category === category)
