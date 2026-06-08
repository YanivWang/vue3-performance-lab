<template>
  <div>
    <div class="lab-card">
      <h2>📊 性能仪表盘</h2>
      <p>
        实时采集 Core Web Vitals，配合 Lighthouse 使用。 建议
        <code>pnpm preview</code> 启动后在此记录基线，学完各实验室后再对比。
      </p>
      <div class="tip-box tip-box--info">
        <strong>👀 Lighthouse 怎么用</strong>
        DevTools → Lighthouse → 选 Performance → Analyze。 与下方实时指标对照：LCP ≈
        最大内容绘制，INP ≈ 交互延迟，CLS ≈ 布局偏移。
      </div>
    </div>

    <div class="metrics-row">
      <div v-for="metric in liveMetrics" :key="metric.name" class="metric-item">
        <div class="metric-item__label">{{ metric.label }}</div>
        <div class="metric-item__value metric-item__value--sm" :style="{ color: metric.color }">
          {{ metric.display }}
        </div>
        <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px">
          {{ metric.hint }}
        </div>
      </div>
    </div>

    <div class="lab-card">
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px">
        <button class="btn btn-primary" @click="saveSnapshot">💾 保存当前快照</button>
        <button class="btn btn-ghost" @click="clearHistory">🗑️ 清空历史</button>
      </div>

      <div v-if="history.length === 0" style="color: var(--color-text-muted); font-size: 14px">
        暂无历史记录。点击「保存当前快照」记录基线分数。
      </div>

      <table v-else class="history-table">
        <thead>
          <tr>
            <th>时间</th>
            <th>LCP</th>
            <th>INP</th>
            <th>CLS</th>
            <th>FCP</th>
            <th>TTFB</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in history" :key="i">
            <td>{{ row.time }}</td>
            <td>{{ formatMs(row.lcp) }}</td>
            <td>{{ formatMs(row.inp) }}</td>
            <td>{{ row.cls?.toFixed(3) ?? '–' }}</td>
            <td>{{ formatMs(row.fcp) }}</td>
            <td>{{ formatMs(row.ttfb) }}</td>
            <td>{{ row.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="lab-card">
      <h2>📖 Core Web Vitals 阈值（Google 标准）</h2>
      <table class="devtips-table">
        <thead>
          <tr>
            <th>指标</th>
            <th>好</th>
            <th>需改进</th>
            <th>差</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>LCP（最大内容绘制）</td>
            <td>≤ 2.5s</td>
            <td>≤ 4s</td>
            <td>&gt; 4s</td>
          </tr>
          <tr>
            <td>INP（交互延迟）</td>
            <td>≤ 200ms</td>
            <td>≤ 500ms</td>
            <td>&gt; 500ms</td>
          </tr>
          <tr>
            <td>CLS（布局偏移）</td>
            <td>≤ 0.1</td>
            <td>≤ 0.25</td>
            <td>&gt; 0.25</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals'

interface VitalsSnapshot {
  time: string
  lcp?: number
  inp?: number
  cls?: number
  fcp?: number
  ttfb?: number
  note: string
}

const STORAGE_KEY = 'perf-lab-vitals-history'

const vitals = ref<Record<string, number>>({})

function ratingColor(name: string, value: number): string {
  if (name === 'CLS') {
    if (value <= 0.1) return 'var(--color-success)'
    if (value <= 0.25) return 'var(--color-warn)'
    return 'var(--color-danger)'
  }
  const ms = value
  const thresholds: Record<string, [number, number]> = {
    LCP: [2500, 4000],
    INP: [200, 500],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
  }
  const [good, poor] = thresholds[name] ?? [Infinity, Infinity]
  if (ms <= good) return 'var(--color-success)'
  if (ms <= poor) return 'var(--color-warn)'
  return 'var(--color-danger)'
}

function onMetric(metric: Metric) {
  vitals.value[metric.name] = metric.value
}

const liveMetrics = computed(() => {
  const defs = [
    {
      name: 'LCP',
      label: 'LCP',
      hint: '最大内容绘制',
      format: (v: number) => `${(v / 1000).toFixed(2)}s`,
    },
    { name: 'INP', label: 'INP', hint: '交互延迟', format: (v: number) => `${Math.round(v)}ms` },
    { name: 'CLS', label: 'CLS', hint: '累积布局偏移', format: (v: number) => v.toFixed(3) },
    {
      name: 'FCP',
      label: 'FCP',
      hint: '首次内容绘制',
      format: (v: number) => `${Math.round(v)}ms`,
    },
    {
      name: 'TTFB',
      label: 'TTFB',
      hint: '首字节时间',
      format: (v: number) => `${Math.round(v)}ms`,
    },
  ]
  return defs.map((d) => {
    const val = vitals.value[d.name]
    return {
      name: d.name,
      label: d.label,
      hint: d.hint,
      display: val != null ? d.format(val) : '–',
      color: val != null ? ratingColor(d.name, val) : 'inherit',
    }
  })
})

const history = ref<VitalsSnapshot[]>([])

function loadHistory() {
  try {
    history.value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    history.value = []
  }
}

function saveSnapshot() {
  const note = history.value.length === 0 ? '基线' : `快照 #${history.value.length + 1}`
  history.value.unshift({
    time: new Date().toLocaleString('zh-CN'),
    lcp: vitals.value.LCP,
    inp: vitals.value.INP,
    cls: vitals.value.CLS,
    fcp: vitals.value.FCP,
    ttfb: vitals.value.TTFB,
    note,
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value.slice(0, 20)))
}

function clearHistory() {
  history.value = []
  localStorage.removeItem(STORAGE_KEY)
}

function formatMs(v?: number) {
  if (v == null) return '–'
  return v < 10 ? v.toFixed(3) : `${Math.round(v)}ms`
}

onMounted(() => {
  loadHistory()
  onLCP(onMetric)
  onINP(onMetric)
  onCLS(onMetric)
  onFCP(onMetric)
  onTTFB(onMetric)
})
</script>

<style scoped lang="scss">
.metric-item__value--sm {
  font-size: 20px;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    text-align: left;
    padding: 8px 12px 8px 0;
    border-bottom: 1px solid var(--color-border);
  }

  th {
    color: var(--color-text-muted);
    font-weight: 500;
  }
}

.devtips-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    text-align: left;
    padding: 10px 16px 10px 0;
    border-bottom: 1px solid var(--color-border);
  }

  th {
    color: var(--color-text-muted);
    font-weight: 500;
  }
}
</style>
