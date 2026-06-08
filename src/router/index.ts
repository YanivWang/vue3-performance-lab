import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

// ★ 路由懒加载：每个实验室页面单独打包，仅在访问时加载
//   对比：如果全部改成 import XxxView from '...'（静态导入），
//   所有代码会打进一个 chunk，首屏 JS 体积翻倍
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/lab/computed',
    component: () => import('../views/lab/ComputedLab.vue'),
    meta: { title: '计算属性缓存' },
  },
  {
    path: '/lab/virtual-list',
    component: () => import('../views/lab/VirtualListLab.vue'),
    meta: { title: '虚拟列表' },
  },
  {
    path: '/lab/lazy-component',
    component: () => import('../views/lab/LazyComponentLab.vue'),
    meta: { title: '异步组件懒加载' },
  },
  {
    path: '/lab/keep-alive',
    component: () => import('../views/lab/KeepAliveLab.vue'),
    meta: { title: 'KeepAlive 缓存' },
  },
  {
    path: '/lab/v-memo',
    component: () => import('../views/lab/VMemoLab.vue'),
    meta: { title: 'v-memo / v-once' },
  },
  {
    path: '/lab/debounce',
    component: () => import('../views/lab/DebounceThrottleLab.vue'),
    meta: { title: '防抖 & 节流' },
  },
  {
    path: '/lab/image-lazy',
    component: () => import('../views/lab/ImageLazyLab.vue'),
    meta: { title: '图片懒加载' },
  },
  {
    path: '/lab/web-worker',
    component: () => import('../views/lab/WebWorkerLab.vue'),
    meta: { title: 'Web Worker' },
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
