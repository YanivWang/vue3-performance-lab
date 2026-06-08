import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { labs } from '@/config/labs'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页总览' },
  },
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: '性能仪表盘' },
  },
  ...labs.map((lab) => ({
    path: lab.path,
    component: lab.load,
    meta: { title: lab.title, category: lab.category },
  })),
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
