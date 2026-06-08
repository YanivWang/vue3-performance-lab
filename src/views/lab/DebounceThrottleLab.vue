<template>
  <div>
    <div class="lab-card">
      <h2>⏱️ 实验室 8：防抖 & 节流</h2>
      <p>
        高频事件（输入、滚动、resize）不加控制会每帧触发，造成大量无效计算。 防抖（debounce）=
        停下来后才执行；节流（throttle）= 固定间隔最多执行一次。
      </p>
      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        Performance 面板 → 录制 → 在输入框快速连续输入 → 停止 → Main 线程时间线上观察 Task
        密度。无防抖时 Task 密集，有防抖时稀疏。
      </div>
    </div>

    <div class="lab-card">
      <h2>防抖（Debounce）— 搜索框场景</h2>
      <p>用户停止输入 300ms 后才触发搜索，避免每个字符都发一次请求。</p>

      <div class="compare-grid">
        <div class="compare-box compare-box--bad">
          <div class="compare-box__header">❌ 无防抖 —— 每次 input 触发</div>
          <div class="compare-box__body">
            <input class="search-input" placeholder="快速输入试试…" @input="onRawInput" />
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-item__label">触发次数</div>
                <div class="metric-item__value" style="color: var(--color-danger)">
                  {{ rawCount }}
                </div>
              </div>
            </div>
            <div v-if="rawLogs.length" class="log-panel">
              <div v-for="(l, i) in rawLogs.slice(-8)" :key="i">{{ l }}</div>
            </div>
          </div>
        </div>

        <div class="compare-box compare-box--good">
          <div class="compare-box__header">✅ 防抖 300ms —— 停止输入后才触发</div>
          <div class="compare-box__body">
            <input class="search-input" placeholder="快速输入试试…" @input="onDebouncedInput" />
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-item__label">触发次数</div>
                <div class="metric-item__value" style="color: var(--color-success)">
                  {{ debounceCount }}
                </div>
              </div>
            </div>
            <div v-if="debounceLogs.length" class="log-panel">
              <div v-for="(l, i) in debounceLogs.slice(-8)" :key="i">{{ l }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lab-card">
      <h2>节流（Throttle）— 滚动 / mousemove 场景</h2>
      <p>每 200ms 最多执行一次，适合滚动位置同步、resize 重布局等不需要最终值的场景。</p>

      <div class="compare-grid">
        <div class="compare-box compare-box--bad">
          <div class="compare-box__header">❌ 无节流 —— 每帧 mousemove 触发</div>
          <div class="compare-box__body">
            <div class="track-area" @mousemove="onRawMove">在这里移动鼠标</div>
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-item__label">触发次数</div>
                <div class="metric-item__value" style="color: var(--color-danger)">
                  {{ rawMoveCount }}
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-item__label">坐标</div>
                <div class="metric-item__value metric-item__value--sm">{{ rawPos }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="compare-box compare-box--good">
          <div class="compare-box__header">✅ 节流 200ms —— 每 200ms 最多一次</div>
          <div class="compare-box__body">
            <div class="track-area" @mousemove="onThrottledMove">在这里移动鼠标</div>
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-item__label">触发次数</div>
                <div class="metric-item__value" style="color: var(--color-success)">
                  {{ throttleMoveCount }}
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-item__label">坐标</div>
                <div class="metric-item__value metric-item__value--sm">{{ throttlePos }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lab-card">
      <h2>📖 实现来源</h2>
      <p>
        防抖/节流实现已抽取到 <code>src/utils/debounce.ts</code> 和
        <code>src/utils/throttle.ts</code>，并附带单元测试。
      </p>
      <div class="tip-box tip-box--key">
        <strong>Vue3 最佳实践</strong>
        在 <code>setup()</code> 里创建防抖/节流函数。 组件卸载时调用
        <code>debouncedFn.cancel()</code>，防止定时器泄漏。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { debounce } from '@/utils/debounce'
import { throttle } from '@/utils/throttle'

function timeTag() {
  return new Date().toLocaleTimeString('zh', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const rawCount = ref(0)
const debounceCount = ref(0)
const rawLogs = ref<string[]>([])
const debounceLogs = ref<string[]>([])

function onRawInput(e: Event) {
  rawCount.value++
  rawLogs.value.push(`[${timeTag()}] 搜索: "${(e.target as HTMLInputElement).value}"`)
}

const onDebouncedInput = debounce((e: Event) => {
  debounceCount.value++
  debounceLogs.value.push(`[${timeTag()}] 搜索: "${(e.target as HTMLInputElement).value}"`)
}, 300)

onUnmounted(() => onDebouncedInput.cancel())

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

.log-panel {
  max-height: 120px;
  overflow-y: auto;
  font-size: 12px;
  color: var(--color-text-muted);
}

.metric-item__value--sm {
  font-size: 14px;
}
</style>
