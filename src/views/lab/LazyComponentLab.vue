<template>
  <div>
    <div class="lab-card">
      <h2>📦 实验室 6：异步组件懒加载</h2>
      <p>
        <code>defineAsyncComponent</code> 让组件代码单独打包成 chunk，
        仅在需要时才通过网络加载，减少首屏 JS 体积。
      </p>
      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        Network 面板 → 过滤 JS → 对比两侧 chunk 加载时机与体积。 静态 import 的 echarts
        随页面首屏一起下载；异步组件首次点击才加载。
      </div>
    </div>

    <div class="compare-grid">
      <div class="compare-box compare-box--bad">
        <div class="compare-box__header">❌ 静态 import —— 进入页面就加载 ECharts</div>
        <div class="compare-box__body">
          <div class="code-snippet">
            <span class="cmt">// ❌ EagerHeavyChart.vue 顶部静态 import echarts</span>
            <span class="kw">import</span> * <span class="kw">as</span> echarts
            <span class="kw">from</span> <span class="str">'echarts'</span>
            <span class="cmt">// 页面加载时已下载 ~1MB+ JS</span>
          </div>

          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">首屏 JS 资源</div>
              <div
                class="metric-item__value metric-item__value--sm"
                style="color: var(--color-danger)"
              >
                {{ jsResourceCount }} 个
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-item__label">已传输体积</div>
              <div class="metric-item__value" style="color: var(--color-danger)">
                {{ totalJsKb }}KB
              </div>
            </div>
          </div>

          <button class="btn btn-primary" @click="showEager = !showEager">
            {{ showEager ? '隐藏图表' : '显示图表（ECharts 已在首屏加载）' }}
          </button>
          <EagerHeavyChart :visible="showEager" />
        </div>
      </div>

      <div class="compare-box compare-box--good">
        <div class="compare-box__header">✅ defineAsyncComponent —— 需要时才下载</div>
        <div class="compare-box__body">
          <div class="code-snippet">
            <span class="cmt">// ✅ 懒加载 —— 单独 chunk，按需下载</span>
            <span class="kw">const</span> HeavyChart =
            <span class="fn">defineAsyncComponent</span>({ loader: () =>
            <span class="kw">import</span>(<span class="str">'./HeavySimulator.vue'</span>), delay:
            <span class="num">200</span>, timeout: <span class="num">8000</span>, })
          </div>

          <button class="btn btn-primary" @click="showHeavy = !showHeavy">
            {{ showHeavy ? '隐藏组件' : '加载重型组件（点击后看 Network）' }}
          </button>

          <div v-if="showHeavy" style="margin-top: 12px">
            <Suspense>
              <HeavyComponent />
              <template #fallback>
                <div class="perf-badge perf-badge--neutral">⏳ 下载 ECharts chunk 中…</div>
              </template>
            </Suspense>
          </div>

          <div v-if="lazyChunkLoaded" class="perf-badge perf-badge--fast" style="margin-top: 8px">
            ✅ 懒加载 chunk 已加载（查看 Network 新增 JS 请求）
          </div>
        </div>
      </div>
    </div>

    <div class="lab-card" style="margin-top: 20px">
      <h2>🛣️ 路由级懒加载</h2>
      <p>
        本项目的每个实验室路由都使用了动态 import，切换路由时在 Network 可观察到 chunk 按需加载。
      </p>
      <div class="tip-box tip-box--key">
        <strong>Vite 预加载策略</strong>
        打包后 HTML 会注入 <code>&lt;link rel="modulepreload"&gt;</code>， 浏览器空闲时预取其他路由
        chunk，实现「首屏快 + 后续路由秒切」。 运行 <code>pnpm build:analyze</code> 查看 chunk
        分布。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, computed, onMounted, watch } from 'vue'
import EagerHeavyChart from '@/components/EagerHeavyChart.vue'
import { getJsResourceSizes } from '@/utils/measureRender'

const showEager = ref(false)
const showHeavy = ref(false)
const lazyChunkLoaded = ref(false)
const jsSizes = ref<{ name: string; sizeKb: number }[]>([])

const jsResourceCount = computed(() => jsSizes.value.length)
const totalJsKb = computed(() => jsSizes.value.reduce((sum, r) => sum + r.sizeKb, 0).toFixed(1))

function refreshJsSizes() {
  jsSizes.value = getJsResourceSizes()
}

onMounted(refreshJsSizes)

watch(showHeavy, (val) => {
  if (val) {
    setTimeout(refreshJsSizes, 1000)
    lazyChunkLoaded.value = true
  }
})

const HeavyComponent = defineAsyncComponent({
  loader: () => import('@/components/HeavySimulator.vue'),
  delay: 200,
  timeout: 8000,
})
</script>

<style scoped lang="scss">
.metric-item__value--sm {
  font-size: 18px;
}
</style>
