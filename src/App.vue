<template>
  <div class="lab-layout">
    <!-- 左侧导航 -->
    <aside class="lab-sidebar">
      <div class="sidebar-title">⚡ 性能优化实验室</div>
      <ul class="sidebar-nav">
        <li><RouterLink to="/">🏠 首页总览</RouterLink></li>
      </ul>

      <div class="sidebar-title" style="margin-top:16px">实验室</div>
      <ul class="sidebar-nav">
        <li v-for="item in labs" :key="item.path">
          <RouterLink :to="item.path">{{ item.icon }} {{ item.title }}</RouterLink>
        </li>
      </ul>
    </aside>

    <!-- 主内容 -->
    <main class="lab-main">
      <!-- Suspense 包裹路由，懒加载时显示 loading -->
      <Suspense>
        <RouterView />
        <template #fallback>
          <div style="padding:60px;text-align:center;color:var(--color-text-muted)">
            ⏳ 加载实验室…
          </div>
        </template>
      </Suspense>
    </main>
  </div>
</template>

<script setup>
const labs = [
  { path: '/lab/computed',       icon: '🧮', title: '计算属性缓存' },
  { path: '/lab/virtual-list',   icon: '📋', title: '虚拟列表' },
  { path: '/lab/lazy-component', icon: '📦', title: '异步组件懒加载' },
  { path: '/lab/keep-alive',     icon: '♻️',  title: 'KeepAlive 缓存' },
  { path: '/lab/v-memo',         icon: '🔒', title: 'v-memo / v-once' },
  { path: '/lab/debounce',       icon: '⏱️',  title: '防抖 & 节流' },
  { path: '/lab/image-lazy',     icon: '🖼️',  title: '图片懒加载' },
  { path: '/lab/web-worker',     icon: '🧵', title: 'Web Worker' },
]
</script>
