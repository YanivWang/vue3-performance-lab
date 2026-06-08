<template>
  <div class="lab-card" style="border-color:var(--color-success);background:var(--color-success-bg)">
    <h2 style="color:var(--color-success)">✅ 重型组件已加载！</h2>
    <p>这个组件被单独打包成一个 chunk。你在 Network 面板看到的 js 请求，就是刚才点击按钮触发的按需加载。</p>
    <div class="metrics-row">
      <div class="metric-item">
        <div class="metric-item__label">加载时刻</div>
        <div class="metric-item__value" style="font-size:16px">{{ loadTime }}</div>
      </div>
      <div class="metric-item">
        <div class="metric-item__label">组件挂载次数</div>
        <div class="metric-item__value">{{ mountCount }}</div>
      </div>
    </div>
    <div class="tip-box tip-box--info" style="margin-top:12px">
      <strong>验证懒加载成功的方法</strong>
      1. 打开 Network → 过滤 JS → 隐藏后再次点击加载 → 看是否发出新请求（第二次不发，来自缓存）。<br>
      2. 运行 <code>npm run build</code> 后看 dist/ 里是否有多个 js chunk 文件。
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const loadTime = new Date().toLocaleTimeString()
const mountCount = ref(0)

onMounted(() => { mountCount.value++ })
</script>
