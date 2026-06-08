<template>
  <div>
    <div class="lab-card">
      <h2>🪶 实验室 4：shallowRef / markRaw / readonly</h2>
      <p>
        Vue 默认对对象做<strong>深度响应式</strong>，大对象每个属性都会被 Proxy 追踪。
        <code>shallowRef</code> 只追踪 .value 的替换；<code>markRaw</code> 标记对象永不代理。
      </p>
      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        Performance 面板 → 录制 → 点击「触发深层属性变更」→ 对比两侧 JS 执行时间。deep reactive
        会触发大量依赖收集与更新。
      </div>
    </div>

    <div class="compare-grid">
      <div class="compare-box compare-box--bad">
        <div class="compare-box__header">❌ reactive —— 深度响应式</div>
        <div class="compare-box__body">
          <div class="code-snippet">
            <span class="cmt">// ❌ 10 万条数据全部变成 Proxy</span>
            <span class="kw">const</span> state = <span class="fn">reactive</span>({ items: bigArray
            }) state.items[<span class="num">0</span>].score++
            <span class="cmt">// 触发依赖追踪</span>
          </div>

          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">初始化耗时</div>
              <div class="metric-item__value" style="color: var(--color-danger)">
                {{ deepInitMs }}ms
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-item__label">更新耗时</div>
              <div class="metric-item__value" style="color: var(--color-danger)">
                {{ deepUpdateMs }}ms
              </div>
            </div>
          </div>

          <button class="btn btn-primary" @click="triggerDeepUpdate">触发深层属性变更</button>
          <p style="font-size: 12px; color: var(--color-text-muted); margin-top: 6px">
            已更新次数: {{ deepUpdateCount }} | 首项 score: {{ deepState.items[0]?.score }}
          </p>
        </div>
      </div>

      <div class="compare-box compare-box--good">
        <div class="compare-box__header">✅ shallowRef + markRaw —— 浅层追踪</div>
        <div class="compare-box__body">
          <div class="code-snippet">
            <span class="cmt">// ✅ 大数组 markRaw，不代理内部元素</span>
            <span class="kw">const</span> items = <span class="fn">markRaw</span>(bigArray)
            <span class="kw">const</span> state = <span class="fn">shallowRef</span>({ items })
            state.value.items[<span class="num">0</span>].score++
            <span class="cmt">// 不触发 Vue 更新</span> state.value = { items }
            <span class="cmt">// 替换 .value 才触发</span>
          </div>

          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">初始化耗时</div>
              <div class="metric-item__value" style="color: var(--color-success)">
                {{ shallowInitMs }}ms
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-item__label">更新耗时</div>
              <div class="metric-item__value" style="color: var(--color-success)">
                {{ shallowUpdateMs }}ms
              </div>
            </div>
          </div>

          <button class="btn btn-primary" @click="triggerShallowUpdate">
            触发 .value 替换更新
          </button>
          <p style="font-size: 12px; color: var(--color-text-muted); margin-top: 6px">
            已更新次数: {{ shallowUpdateCount }} | 版本: v{{ shallowVersion }}
          </p>
        </div>
      </div>
    </div>

    <div class="lab-card" style="margin-top: 20px">
      <h2>📖 使用场景</h2>
      <div class="tip-box tip-box--key">
        <strong>什么时候用 shallowRef / markRaw？</strong>
        • 第三方库实例（ECharts、Mapbox）— 用 markRaw 避免 Proxy 冲突<br />
        • 大列表原始数据 — shallowRef 存数组，只渲染需要的部分（配合虚拟列表）<br />
        • 表单大对象 — 只有提交时才需要响应式，编辑过程用普通对象
      </div>
      <div class="tip-box tip-box--warn">
        <strong>⚠️ 注意</strong>
        shallowRef 内部属性变化不会触发视图更新。需要更新 UI 时，要么替换整个 .value，要么配合
        <code>triggerRef</code>。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, shallowRef, markRaw, triggerRef, ref } from 'vue'
import { measurePaintTime } from '@/utils/measureRender'

const SIZE = 50_000

function createBigArray() {
  return Array.from({ length: SIZE }, (_, i) => ({
    id: i,
    name: `Item-${i}`,
    score: Math.floor(Math.random() * 100),
  }))
}

// ---- deep reactive ----
const deepInitMs = ref(0)
const deepUpdateMs = ref(0)
const deepUpdateCount = ref(0)
const deepState = reactive({ items: [] as ReturnType<typeof createBigArray> })

{
  const t0 = performance.now()
  deepState.items = createBigArray()
  deepInitMs.value = +(performance.now() - t0).toFixed(1)
}

async function triggerDeepUpdate() {
  deepUpdateMs.value = await measurePaintTime(() => {
    deepState.items[0].score++
    deepUpdateCount.value++
  })
}

// ---- shallowRef + markRaw ----
const shallowInitMs = ref(0)
const shallowUpdateMs = ref(0)
const shallowUpdateCount = ref(0)
const shallowVersion = ref(0)

const rawItems = markRaw(createBigArray())
const shallowState = shallowRef({ items: rawItems, version: 0 })

{
  const t0 = performance.now()
  // 重新赋值以测量初始化（markRaw 跳过代理）
  shallowState.value = { items: markRaw(createBigArray()), version: 0 }
  shallowInitMs.value = +(performance.now() - t0).toFixed(1)
}

async function triggerShallowUpdate() {
  shallowUpdateMs.value = await measurePaintTime(() => {
    shallowState.value.items[0].score++
    shallowVersion.value++
    shallowState.value = { ...shallowState.value, version: shallowVersion.value }
    triggerRef(shallowState)
    shallowUpdateCount.value++
  })
}
</script>
