<template>
  <div>
    <div class="lab-card">
      <h2>⏱️ 实验室 6：防抖 & 节流</h2>
      <p>
        高频事件（输入、滚动、resize）不加控制会每帧触发，造成大量无效计算。
        防抖（debounce）= 停下来后才执行；节流（throttle）= 固定间隔最多执行一次。
      </p>
      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        Performance 面板 → 录制 → 在输入框快速连续输入 → 停止 →
        Main 线程时间线上观察"黄色 Task"的密度。无防抖时 Task 密集，有防抖时稀疏。
      </div>
    </div>

    <!-- 防抖 -->
    <div class="lab-card">
      <h2>防抖（Debounce）— 搜索框场景</h2>
      <p>用户停止输入 300ms 后才触发搜索，避免每个字符都发一次请求。</p>

      <div class="compare-grid">
        <div class="compare-box compare-box--bad">
          <div class="compare-box__header">❌ 无防抖 —— 每次 input 触发</div>
          <div class="compare-box__body">
            <input
              class="search-input"
              placeholder="快速输入试试…"
              @input="onRawInput"
            />
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-item__label">触发次数</div>
                <div class="metric-item__value" style="color:var(--color-danger)">{{ rawCount }}</div>
              </div>
            </div>
            <div v-if="rawLogs.length" style="max-height:120px;overflow-y:auto;font-size:12px;color:var(--color-text-muted)">
              <div v-for="(l,i) in rawLogs.slice(-8)" :key="i">{{ l }}</div>
            </div>
          </div>
        </div>

        <div class="compare-box compare-box--good">
          <div class="compare-box__header">✅ 防抖 300ms —— 停止输入后才触发</div>
          <div class="compare-box__body">
            <input
              class="search-input"
              placeholder="快速输入试试…"
              @input="onDebouncedInput"
            />
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-item__label">触发次数</div>
                <div class="metric-item__value" style="color:var(--color-success)">{{ debounceCount }}</div>
              </div>
            </div>
            <div v-if="debounceLogs.length" style="max-height:120px;overflow-y:auto;font-size:12px;color:var(--color-text-muted)">
              <div v-for="(l,i) in debounceLogs.slice(-8)" :key="i">{{ l }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 节流 -->
    <div class="lab-card">
      <h2>节流（Throttle）— 滚动 / resize 场景</h2>
      <p>每 200ms 最多执行一次，适合滚动位置同步、resize 重布局等不需要最终值的场景。</p>

      <div class="compare-grid">
        <div class="compare-box compare-box--bad">
          <div class="compare-box__header">❌ 无节流 —— 每帧 mousemove 触发</div>
          <div class="compare-box__body">
            <div
              class="track-area"
              @mousemove="onRawMove"
            >在这里移动鼠标</div>
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-item__label">触发次数</div>
                <div class="metric-item__value" style="color:var(--color-danger)">{{ rawMoveCount }}</div>
              </div>
              <div class="metric-item">
                <div class="metric-item__label">坐标</div>
                <div class="metric-item__value" style="font-size:14px">{{ rawPos }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="compare-box compare-box--good">
          <div class="compare-box__header">✅ 节流 200ms —— 每 200ms 最多一次</div>
          <div class="compare-box__body">
            <div
              class="track-area"
              @mousemove="onThrottledMove"
            >在这里移动鼠标</div>
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-item__label">触发次数</div>
                <div class="metric-item__value" style="color:var(--color-success)">{{ throttleMoveCount }}</div>
              </div>
              <div class="metric-item">
                <div class="metric-item__label">坐标</div>
                <div class="metric-item__value" style="font-size:14px">{{ throttlePos }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 手写实现 -->
    <div class="lab-card">
      <h2>📖 手写防抖 & 节流（面试常考）</h2>
      <div class="code-snippet"><span class="cmt">// 防抖：停止触发 delay ms 后执行</span>
<span class="kw">function</span> <span class="fn">debounce</span>(fn, delay) {
  <span class="kw">let</span> timer
  <span class="kw">return</span> <span class="kw">function</span>(...args) {
    <span class="fn">clearTimeout</span>(timer)
    timer = <span class="fn">setTimeout</span>(() => fn.<span class="fn">apply</span>(<span class="kw">this</span>, args), delay)
  }
}

<span class="cmt">// 节流：每 interval ms 最多执行一次（时间戳版）</span>
<span class="kw">function</span> <span class="fn">throttle</span>(fn, interval) {
  <span class="kw">let</span> last = <span class="num">0</span>
  <span class="kw">return</span> <span class="kw">function</span>(...args) {
    <span class="kw">const</span> now = Date.<span class="fn">now</span>()
    <span class="kw">if</span> (now - last >= interval) {
      last = now
      fn.<span class="fn">apply</span>(<span class="kw">this</span>, args)
    }
  }
}</div>

      <div class="tip-box tip-box--key">
        <strong>Vue3 中的最佳实践</strong>
        在 <code>setup()</code> 里创建防抖/节流函数，而不是在模板中直接调用。
        组件卸载时记得 <code>onUnmounted(() => debouncedFn.cancel?.())</code>，
        防止组件销毁后定时器仍然触发。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 防抖实现
function debounce<T extends (...args: never[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// 节流实现
function throttle<T extends (...args: never[]) => void>(fn: T, interval: number) {
  let last = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn(...args)
    }
  }
}

// ---- 搜索防抖 ----
const rawCount = ref(0)
const debounceCount = ref(0)
const rawLogs = ref<string[]>([])
const debounceLogs = ref<string[]>([])

function onRawInput(e: Event) {
  rawCount.value++
  rawLogs.value.push(`[${new Date().toLocaleTimeString('zh',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'})}] 搜索: "${(e.target as HTMLInputElement).value}"`)
}

const onDebouncedInput = debounce((e: Event) => {
  debounceCount.value++
  debounceLogs.value.push(`[${new Date().toLocaleTimeString('zh',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'})}] 搜索: "${(e.target as HTMLInputElement).value}"`)
}, 300)

// ---- 鼠标移动节流 ----
const rawMoveCount = ref(0)
const throttleMoveCount = ref(0)
const rawPos = ref('–')
const throttlePos = ref('–')

function onRawMove(e: MouseEvent) {
  rawMoveCount.value++
  rawPos.value = `${e.offsetX}, ${e.offsetY}`
}

const onThrottledMove = throttle((e: MouseEvent) => {
  throttleMoveCount.value++
  throttlePos.value = `${e.offsetX}, ${e.offsetY}`
}, 200)
</script>

<style scoped lang="scss">
.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: $color-primary;
  }
}

.track-area {
  height: 80px;
  border: 1px dashed var(--color-border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 13px;
  cursor: crosshair;
  background: var(--color-bg);
}
</style>
