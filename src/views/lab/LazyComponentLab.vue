<template>
  <div>
    <div class="lab-card">
      <h2>📦 实验室 3：异步组件懒加载</h2>
      <p>
        <code>defineAsyncComponent</code> 让组件代码单独打包成 chunk，
        仅在需要时才通过网络加载，减少首屏 JS 体积。
      </p>
      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        Network 面板 → 过滤 JS → 点击"加载重型组件"按钮 → 观察新增的 chunk 文件加载请求。
        首次点击才发请求，第二次从缓存读。
      </div>
    </div>

    <div class="compare-grid">
      <div class="compare-box compare-box--bad">
        <div class="compare-box__header">❌ 静态导入 —— 进入页面就加载所有代码</div>
        <div class="compare-box__body">
          <div class="code-snippet"><span class="cmt">// ❌ 静态 import —— 打进主 bundle</span>
<span class="kw">import</span> HeavyChart <span class="kw">from</span> <span class="str">'./HeavyChart.vue'</span>
<span class="cmt">// 即使用户没点"显示图表"，代码也已下载</span></div>
          <div class="tip-box tip-box--warn" style="margin-top:12px">
            假设 HeavyChart 依赖 echarts（~1MB），用户不需要时也会下载，
            首屏 LCP 变慢。
          </div>
        </div>
      </div>

      <div class="compare-box compare-box--good">
        <div class="compare-box__header">✅ defineAsyncComponent —— 需要时才下载</div>
        <div class="compare-box__body">
          <div class="code-snippet"><span class="cmt">// ✅ 懒加载 —— 单独 chunk，按需下载</span>
<span class="kw">const</span> HeavyChart = <span class="fn">defineAsyncComponent</span>({
  loader: () => <span class="kw">import</span>(<span class="str">'./HeavyChart.vue'</span>),
  loadingComponent: Spinner,
  delay: <span class="num">200</span>,       <span class="cmt">// 200ms 内完成不显示 loading</span>
  errorComponent: ErrorComp,
  timeout: <span class="num">5000</span>,
})</div>

          <div style="margin-top:16px">
            <button class="btn btn-primary" @click="showHeavy = !showHeavy">
              {{ showHeavy ? '隐藏组件' : '加载重型组件（点击后看 Network）' }}
            </button>

            <div v-if="showHeavy" style="margin-top:12px">
              <Suspense>
                <HeavyComponent />
                <template #fallback>
                  <div class="perf-badge perf-badge--neutral">⏳ 加载中…</div>
                </template>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 路由级懒加载 -->
    <div class="lab-card" style="margin-top:20px">
      <h2>🛣️ 路由级懒加载（更常用）</h2>
      <p>本项目的每个路由都已经做了路由级懒加载，打开 Network 面板切换路由时可以观察到 chunk 按需加载。</p>
      <div class="code-snippet"><span class="cmt">// router/index.js —— 每个路由都是独立 chunk</span>
{
  path: <span class="str">'/lab/computed'</span>,
  component: () => <span class="kw">import</span>(<span class="str">'../views/lab/ComputedLab.vue'</span>)
}
<span class="cmt">// Vite 自动将每个动态 import 打成独立 chunk</span>
<span class="cmt">// 首屏只下载当前路由的代码</span></div>

      <div class="tip-box tip-box--key">
        <strong>Vite 预加载策略</strong>
        Vite 打包后会在 HTML 里注入 <code>&lt;link rel="modulepreload"&gt;</code>，
        在浏览器空闲时预取其他路由的 chunk，实现"首屏快 + 后续路由秒切"的最优体验。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

const showHeavy = ref(false)

// 异步组件：只有 showHeavy=true 时才开始下载
const HeavyComponent = defineAsyncComponent({
  loader: () => import('../../components/HeavySimulator.vue'),
  delay: 200,
  timeout: 8000,
})
</script>
