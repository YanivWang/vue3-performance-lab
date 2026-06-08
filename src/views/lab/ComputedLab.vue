<template>
  <div>
    <div class="lab-card">
      <h2>🧮 实验室 1：计算属性缓存</h2>
      <p>
        computed 会缓存结果，只有依赖变化时才重新计算。method 每次渲染都执行。用大数字感受差距。
      </p>

      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        打开 Performance 面板 → 点「录制」→ 连续点击下方按钮 → 停止 → 在 Flame Chart 里 搜索
        <code>fibonacci</code>，对比两侧调用次数。
      </div>
    </div>

    <div class="compare-grid">
      <div class="compare-box compare-box--bad">
        <div class="compare-box__header">❌ method —— 每次渲染都重算</div>
        <div class="compare-box__body">
          <p class="lab-desc">
            模板里调用 <code>fibMethod()</code>，每次父组件重渲染都会执行一次昂贵计算
          </p>
          <div class="code-snippet">
            <span class="cmt">// ❌ 每次渲染都执行</span> <span class="kw">const</span>
            <span class="fn">fibMethod</span> = () => fibonacci(n.value)
            <span class="cmt">// 模板：{{ fibMethod() }}</span>
          </div>

          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">上次计算耗时</div>
              <div
                class="metric-item__value"
                :style="{ color: methodMs > 50 ? 'var(--color-danger)' : 'inherit' }"
              >
                {{ methodMs }}ms
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-item__label">累计调用次数</div>
              <div class="metric-item__value" style="color: var(--color-danger)">
                {{ methodCallCount }}
              </div>
            </div>
          </div>

          <div class="fib-result">fib({{ n }}) = {{ fibMethod() }}</div>

          <div class="btn-row">
            <button class="btn btn-ghost" @click="triggerRerender">🔄 触发重渲染（不改 n）</button>
            <button class="btn btn-primary" @click="n = Math.min(n + 1, 38)">n + 1</button>
            <button class="btn btn-ghost" @click="n = Math.max(n - 1, 1)">n - 1</button>
          </div>
        </div>
      </div>

      <div class="compare-box compare-box--good">
        <div class="compare-box__header">✅ computed —— 依赖不变就用缓存</div>
        <div class="compare-box__body">
          <p class="lab-desc">
            <code>computed</code> 内部追踪 <code>n</code>，只有 n 变化才重算，重渲染不触发
          </p>
          <div class="code-snippet">
            <span class="cmt">// ✅ 依赖不变直接返回缓存</span>
            <span class="kw">const</span> fibComputed = <span class="fn">computed</span>(() =>
            fibonacci(n.value)) <span class="cmt">// 模板：{{ fibComputed }}</span>
          </div>

          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">上次计算耗时</div>
              <div class="metric-item__value" style="color: var(--color-success)">
                {{ computedMs }}ms
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-item__label">累计重算次数</div>
              <div class="metric-item__value" style="color: var(--color-success)">
                {{ computedCallCount }}
              </div>
            </div>
          </div>

          <div class="fib-result">fib({{ n }}) = {{ fibComputed }}</div>

          <div class="btn-row">
            <button class="btn btn-ghost" @click="triggerRerender">🔄 触发重渲染（不改 n）</button>
          </div>
          <p v-if="lastRerenderCached" class="lab-hint lab-hint--success">
            ✅ 上次重渲染使用了缓存，未重新计算
          </p>
        </div>
      </div>
    </div>

    <div class="lab-card" style="margin-top: 20px">
      <h2>📖 核心原理</h2>
      <div class="tip-box tip-box--key">
        <strong>computed 的缓存机制</strong>
        Vue 的响应式系统为每个 computed 维护一个 dirty flag。 当依赖的响应式数据变化时，dirty 置为
        true；下次读取时重算并重置 dirty。 只要 dirty = false，读取 computed
        直接返回缓存值，不执行函数体。
      </div>
      <div class="tip-box tip-box--warn">
        <strong>⚠️ computed 失效的坑</strong>
        计算函数内部读取的值必须是响应式数据（ref / reactive）。 如果读取了普通 JS 变量或
        Date.now()，Vue 无法追踪，缓存永远不会更新。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { fibonacci } from '@/utils/fibonacci'

const n = ref(35)
const rerenderTick = ref(0)
const methodCallCount = ref(0)
const computedCallCount = ref(0)
const methodMs = ref(0)
const computedMs = ref(0)
const lastRerenderCached = ref(false)
const prevComputedCount = ref(0)

function fibMethod() {
  methodCallCount.value++
  const t0 = performance.now()
  const result = fibonacci(n.value)
  methodMs.value = +(performance.now() - t0).toFixed(1)
  void rerenderTick.value
  return result
}

const fibComputed = computed(() => fibonacci(n.value))

watch(
  fibComputed,
  () => {
    computedCallCount.value++
  },
  { flush: 'sync' },
)

watch(
  n,
  () => {
    const t0 = performance.now()
    void fibComputed.value
    computedMs.value = +(performance.now() - t0).toFixed(1)
  },
  { immediate: true },
)

function triggerRerender() {
  prevComputedCount.value = computedCallCount.value
  rerenderTick.value++
  lastRerenderCached.value = computedCallCount.value === prevComputedCount.value
}
</script>

<style scoped lang="scss">
.lab-desc {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0 0 12px;
}

.fib-result {
  font-size: 24px;
  font-weight: 700;
  margin: 8px 0;
}

.btn-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.lab-hint {
  font-size: 12px;
  margin: 6px 0 0;

  &--success {
    color: var(--color-success);
  }
}
</style>
