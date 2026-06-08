<template>
  <div>
    <div class="lab-card">
      <h2>🧮 实验室 1：计算属性缓存</h2>
      <p>computed 会缓存结果，只有依赖变化时才重新计算。method 每次渲染都执行。用大数字感受差距。</p>

      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        打开 Performance 面板 → 点「录制」→ 连续点击下方按钮 → 停止 → 在 Flame Chart 里
        搜索 <code>fibonacci</code>，对比两侧调用次数。
      </div>
    </div>

    <div class="compare-grid">
      <!-- 坏的：method -->
      <div class="compare-box compare-box--bad">
        <div class="compare-box__header">❌ method —— 每次渲染都重算</div>
        <div class="compare-box__body">
          <p style="font-size:13px;color:var(--color-text-muted);margin:0 0 12px">
            模板里调用 <code>fibMethod()</code>，每次父组件重渲染都会执行一次昂贵计算
          </p>
          <div class="code-snippet"><span class="cmt">// ❌ 每次渲染都执行</span>
<span class="kw">const</span> <span class="fn">fibMethod</span> = () => fibonacci(n.value)
<span class="cmt">// 模板：{{ fibMethod() }}</span></div>

          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">计算耗时</div>
              <div class="metric-item__value" :style="{ color: methodMs > 50 ? 'var(--color-danger)' : 'inherit' }">
                {{ methodMs }}ms
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-item__label">调用次数</div>
              <div class="metric-item__value" style="color:var(--color-danger)">{{ methodCallCount }}</div>
            </div>
          </div>

          <div style="font-size:24px;font-weight:700;margin:8px 0">fib({{ n }}) = {{ fibMethod() }}</div>

          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
            <button class="btn btn-ghost" @click="triggerRerender">🔄 触发重渲染（不改 n）</button>
            <button class="btn btn-primary" @click="n = Math.min(n + 1, 38)">n + 1</button>
            <button class="btn btn-ghost" @click="n = Math.max(n - 1, 1)">n - 1</button>
          </div>
        </div>
      </div>

      <!-- 好的：computed -->
      <div class="compare-box compare-box--good">
        <div class="compare-box__header">✅ computed —— 依赖不变就用缓存</div>
        <div class="compare-box__body">
          <p style="font-size:13px;color:var(--color-text-muted);margin:0 0 12px">
            <code>computed</code> 内部追踪 <code>n</code>，只有 n 变化才重算，重渲染不触发
          </p>
          <div class="code-snippet"><span class="cmt">// ✅ 依赖不变直接返回缓存</span>
<span class="kw">const</span> fibComputed = <span class="fn">computed</span>(() => fibonacci(n.value))
<span class="cmt">// 模板：{{ fibComputed }}</span></div>

          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">计算耗时</div>
              <div class="metric-item__value" style="color:var(--color-success)">
                {{ computedMs }}ms
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-item__label">调用次数</div>
              <div class="metric-item__value" style="color:var(--color-success)">{{ computedCallCount }}</div>
            </div>
          </div>

          <div style="font-size:24px;font-weight:700;margin:8px 0">fib({{ n }}) = {{ fibComputed }}</div>

          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
            <button class="btn btn-ghost" @click="triggerRerender">🔄 触发重渲染（不改 n）</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 知识点 -->
    <div class="lab-card" style="margin-top:20px">
      <h2>📖 核心原理</h2>
      <div class="tip-box tip-box--key">
        <strong>computed 的缓存机制</strong>
        Vue 的响应式系统为每个 computed 维护一个"脏标记"（dirty flag）。
        当依赖的响应式数据变化时，dirty 置为 true；下次读取时重算并重置 dirty。
        只要 dirty = false，读取 computed 直接返回缓存值，不执行函数体。
      </div>
      <div class="tip-box tip-box--warn">
        <strong>⚠️ computed 失效的坑</strong>
        计算函数内部读取的值必须是响应式数据（ref / reactive）。
        如果读取了普通 JS 变量或 Date.now()，Vue 无法追踪，缓存永远不会更新。
      </div>
      <div class="tip-box tip-box--info">
        <strong>什么时候用 method 而不是 computed？</strong>
        需要传参数时（<code>getItem(id)</code>）——computed 不接受参数。
        但可以用"返回函数"的 computed 变通：<code>const getItem = computed(() => (id) => ...)</code>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const n = ref(35)
const rerenderTick = ref(0) // 用于触发重渲染但不改 n
const methodCallCount = ref(0)
const computedCallCount = ref(0)
const methodMs = ref(0)
const computedMs = ref(0)

// 斐波那契（故意递归，计算量大）
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

// ❌ method：每次渲染都执行
function fibMethod() {
  methodCallCount.value++
  const t0 = performance.now()
  const result = fibonacci(n.value)
  methodMs.value = +(performance.now() - t0).toFixed(1)
  // 读 rerenderTick 让这个 method 依赖它，从而每次重渲染都触发
  void rerenderTick.value
  return result
}

// ✅ computed：只有 n 变化才重算
const fibComputed = computed(() => {
  computedCallCount.value++
  const t0 = performance.now()
  const result = fibonacci(n.value)
  computedMs.value = +(performance.now() - t0).toFixed(1)
  return result
})

function triggerRerender() {
  // 只改 rerenderTick，method 会重算，computed 不会
  rerenderTick.value++
}
</script>
