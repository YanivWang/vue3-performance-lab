<template>
  <div>
    <div class="home-hero">
      <div style="font-size: 48px">⚡</div>
      <h1>Vue3 性能优化实验室</h1>
      <p>每个实验室都提供「优化前 vs 优化后」可量化对比，配合 DevTools 同步观察</p>
      <RouterLink
        to="/dashboard"
        class="btn btn-primary"
        style="margin-top: 16px; text-decoration: none"
      >
        📊 打开性能仪表盘
      </RouterLink>
    </div>

    <div class="tip-box tip-box--info">
      <strong>🗺️ 建议学习顺序</strong>
      先在<a href="#/dashboard" style="color: inherit">性能仪表盘</a>记录 Web Vitals 基线 → 按「渲染
      → 加载 → 运行时」顺序过每个实验室 → 优化后再对比仪表盘数据。 每个实验室都有「在 DevTools
      里看什么」提示。
    </div>

    <div v-for="cat in categories" :key="cat" style="margin-top: 32px">
      <h2 style="font-size: 16px; color: var(--color-text-muted); margin: 0 0 12px">
        {{ categoryLabels[cat] }}
      </h2>
      <div class="lab-grid">
        <RouterLink
          v-for="item in labsByCategory(cat)"
          :key="item.path"
          :to="item.path"
          class="lab-entry"
        >
          <div class="lab-entry__icon">{{ item.icon }}</div>
          <div class="lab-entry__title">{{ item.title }}</div>
          <div class="lab-entry__desc">{{ item.desc }}</div>
        </RouterLink>
      </div>
    </div>

    <div class="lab-card" style="margin-top: 32px">
      <h2>📊 如何配合 DevTools 使用</h2>
      <p>每次进入实验室前，先按下面步骤打开对应面板</p>
      <table class="devtips-table">
        <thead>
          <tr>
            <th>实验室</th>
            <th>推荐面板</th>
            <th>重点观察</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lab in labs" :key="lab.path">
            <td>{{ lab.title }}</td>
            <td>{{ lab.devPanel }}</td>
            <td>{{ lab.devTip }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { labs, labsByCategory, categoryLabels, type LabCategory } from '@/config/labs'

const categories: LabCategory[] = ['render', 'load', 'runtime']
</script>

<style scoped lang="scss">
.devtips-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    text-align: left;
    padding: 10px 0;
    border-bottom: 1px solid var(--color-border);
  }

  th {
    color: var(--color-text-muted);
    font-weight: 500;
  }

  td:nth-child(2) {
    color: var(--color-primary);
  }

  td:nth-child(3) {
    color: var(--color-text-muted);
  }
}
</style>
