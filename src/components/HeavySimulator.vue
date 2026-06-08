<template>
  <div class="lab-card heavy-simulator">
    <h2 style="color: var(--color-success)">✅ 重型组件已加载（含 ECharts）</h2>
    <p>
      本组件依赖 <code>echarts</code>（约 1MB+），被 Vite 单独打包成 chunk。 打开 Network → JS
      可看到按需加载的请求与体积。
    </p>

    <div class="metrics-row">
      <div class="metric-item">
        <div class="metric-item__label">加载时刻</div>
        <div class="metric-item__value metric-item__value--sm">{{ loadTime }}</div>
      </div>
      <div class="metric-item">
        <div class="metric-item__label">挂载耗时</div>
        <div class="metric-item__value">{{ mountMs }}ms</div>
      </div>
      <div class="metric-item">
        <div class="metric-item__label">ECharts 初始化</div>
        <div class="metric-item__value">{{ chartInitMs }}ms</div>
      </div>
    </div>

    <div ref="chartRef" class="heavy-simulator__chart" />

    <div class="tip-box tip-box--info" style="margin-top: 12px">
      <strong>验证懒加载</strong>
      1. Network 过滤 JS → 首次点击才出现含 echarts 的 chunk。<br />
      2. 运行 <code>pnpm build:analyze</code> 查看 chunk 体积分布。
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

const loadTime = new Date().toLocaleTimeString()
const mountMs = ref(0)
const chartInitMs = ref(0)
const chartRef = ref<HTMLElement | null>(null)
let chart: ECharts | null = null

onMounted(() => {
  const t0 = performance.now()

  if (chartRef.value) {
    const tChart = performance.now()
    chart = echarts.init(chartRef.value)
    chartInitMs.value = +(performance.now() - tChart).toFixed(1)

    chart.setOption({
      animation: false,
      grid: { top: 20, right: 20, bottom: 30, left: 40 },
      xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'bar',
          data: [120, 200, 150, 80, 70],
          itemStyle: { color: '#6366f1' },
        },
      ],
    })
  }

  mountMs.value = +(performance.now() - t0).toFixed(1)
})

onUnmounted(() => {
  chart?.dispose()
})
</script>

<style scoped lang="scss">
.heavy-simulator {
  border-color: var(--color-success);
  background: var(--color-success-bg);

  &__chart {
    height: 200px;
    margin-top: 12px;
    background: #fff;
    border-radius: 6px;
  }
}

.metric-item__value--sm {
  font-size: 16px;
}
</style>
