<template>
  <div class="lab-layout">
    <aside class="lab-sidebar">
      <div class="sidebar-title">⚡ 性能优化实验室</div>
      <ul class="sidebar-nav">
        <li><RouterLink to="/">🏠 首页总览</RouterLink></li>
        <li><RouterLink to="/dashboard">📊 性能仪表盘</RouterLink></li>
      </ul>

      <template v-for="cat in categories" :key="cat">
        <div class="sidebar-title" style="margin-top: 16px">{{ categoryLabels[cat] }}</div>
        <ul class="sidebar-nav">
          <li v-for="item in labsByCategory(cat)" :key="item.path">
            <RouterLink :to="item.path">{{ item.icon }} {{ item.title }}</RouterLink>
          </li>
        </ul>
      </template>
    </aside>

    <main class="lab-main">
      <Suspense>
        <RouterView />
        <template #fallback>
          <div class="lab-loading">⏳ 加载实验室…</div>
        </template>
      </Suspense>
    </main>
  </div>
</template>

<script setup lang="ts">
import { labsByCategory, categoryLabels, type LabCategory } from '@/config/labs'

const categories: LabCategory[] = ['render', 'load', 'runtime']
</script>

<style scoped lang="scss">
.lab-loading {
  padding: 60px;
  text-align: center;
  color: var(--color-text-muted);
}
</style>
