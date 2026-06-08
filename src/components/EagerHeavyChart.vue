<template>
  <div v-if="visible" class="eager-heavy">
    <p style="font-size: 13px; color: var(--color-text-muted); margin: 0 0 8px">
      ECharts 已在页面加载时下载（静态 import）
    </p>
    <div ref="chartRef" class="eager-heavy__chart" />
    <div class="perf-badge perf-badge--slow" style="margin-top: 8px">
      初始化耗时: {{ initMs }}ms
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 静态导入 echarts — 父组件 import 此文件时，echarts 打进当前 chunk。
 * 用于 LazyComponentLab「坏方案」对比。
 */
import { ref, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

const props = defineProps<{ visible: boolean }>()

const chartRef = ref<HTMLElement | null>(null)
const initMs = ref(0)
let chart: ECharts | null = null

watch(
  () => props.visible,
  (show) => {
    if (!show) {
      chart?.dispose()
      chart = null
      return
    }
    requestAnimationFrame(() => {
      if (!chartRef.value) return
      const t0 = performance.now()
      chart = echarts.init(chartRef.value)
      chart.setOption({
        animation: false,
        xAxis: { type: 'category', data: ['A', 'B', 'C'] },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [10, 22, 18] }],
      })
      initMs.value = +(performance.now() - t0).toFixed(1)
    })
  },
  { immediate: true },
)

onUnmounted(() => chart?.dispose())
</script>

<style scoped lang="scss">
.eager-heavy__chart {
  height: 160px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid var(--color-border);
}
</style>
