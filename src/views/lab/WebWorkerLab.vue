<template>
  <div>
    <div class="lab-card">
      <h2>🧵 实验室 8：Web Worker</h2>
      <p>
        CPU 密集型任务（加密、图像处理、大数据计算）在主线程执行会阻塞 UI，
        导致页面无响应。Web Worker 将任务移到独立线程，主线程保持 60fps。
      </p>
      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        Performance 面板 → 录制 → 分别点击两个按钮 → 停止 →
        查看 <b>Main</b> 线程时间线：主线程版有大块橙色 Long Task，Worker 版几乎为空。
        展开 <b>Worker</b> 部分可看到计算在 Worker 线程执行。
      </div>
    </div>

    <div class="compare-grid">
      <!-- 主线程阻塞 -->
      <div class="compare-box compare-box--bad">
        <div class="compare-box__header">❌ 主线程计算 —— UI 冻结</div>
        <div class="compare-box__body">
          <p style="font-size:13px;color:var(--color-text-muted);margin:0 0 12px">
            计算期间按钮无响应，动画停止，INP 爆表。
          </p>

          <div class="fps-indicator">
            <div class="fps-dot" :class="{ 'fps-dot--frozen': isMainRunning }"></div>
            {{ isMainRunning ? '⚠️ UI 已冻结' : '✅ UI 正常' }}
          </div>

          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">计算耗时</div>
              <div class="metric-item__value" :style="{ color: mainMs > 0 ? 'var(--color-danger)' : 'inherit' }">
                {{ mainMs > 0 ? mainMs + 'ms' : '–' }}
              </div>
            </div>
          </div>

          <button
            class="btn btn-primary"
            :disabled="isMainRunning"
            @click="runOnMain"
          >
            {{ isMainRunning ? '⏳ 计算中（UI 已冻结）' : '▶️ 主线程计算 fib(42)' }}
          </button>

          <div class="tip-box tip-box--warn" style="margin-top:12px">
            点击后页面会冻结几秒，这是预期现象。
            观察这段时间内动画是否停止。
          </div>

          <!-- 动画球，冻结时会停 -->
          <div class="anim-track">
            <div class="anim-ball" :class="{ 'anim-ball--paused': isMainRunning }"></div>
          </div>
        </div>
      </div>

      <!-- Worker -->
      <div class="compare-box compare-box--good">
        <div class="compare-box__header">✅ Web Worker —— UI 保持流畅</div>
        <div class="compare-box__body">
          <p style="font-size:13px;color:var(--color-text-muted);margin:0 0 12px">
            计算在独立线程，主线程继续渲染动画、响应交互。
          </p>

          <div class="fps-indicator">
            <div class="fps-dot fps-dot--active"></div>
            ✅ UI 始终流畅
          </div>

          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">计算耗时</div>
              <div class="metric-item__value" style="color:var(--color-success)">
                {{ workerMs > 0 ? workerMs + 'ms' : '–' }}
              </div>
            </div>
          </div>

          <button
            class="btn btn-primary"
            :disabled="isWorkerRunning"
            @click="runOnWorker"
          >
            {{ isWorkerRunning ? '⏳ Worker 计算中（UI 正常）' : '▶️ Worker 线程计算 fib(42)' }}
          </button>

          <div class="tip-box tip-box--info" style="margin-top:12px">
            点击后动画继续运行，按钮可正常点击，
            结果出来后自动显示。
          </div>

          <!-- 动画球，始终动 -->
          <div class="anim-track">
            <div class="anim-ball"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="lab-card" style="margin-top:20px">
      <h2>📖 Worker 通信模式</h2>
      <div class="code-snippet"><span class="cmt">// 主线程：创建 Worker 并发送任务</span>
<span class="kw">const</span> worker = <span class="kw">new</span> <span class="fn">Worker</span>(<span class="kw">new</span> <span class="fn">URL</span>(<span class="str">'./fib.worker.js'</span>, <span class="kw">import</span>.meta.url))
worker.<span class="fn">postMessage</span>({ n: <span class="num">42</span> })
worker.onmessage = (e) => console.<span class="fn">log</span>(<span class="str">'结果:'</span>, e.data.result)

<span class="cmt">// fib.worker.js（Vite 自动识别 ?worker 后缀）</span>
self.onmessage = ({ data }) => {
  <span class="kw">const</span> result = <span class="fn">fibonacci</span>(data.n)
  self.<span class="fn">postMessage</span>({ result })
}</div>

      <div class="tip-box tip-box--key">
        <strong>Vite 中的 Worker 使用方式</strong>
        推荐用 <code>import MyWorker from './worker?worker'</code>，
        Vite 会自动处理打包和路径。或者用 <code>new URL('./worker.js', import.meta.url)</code>
        在 new Worker() 中内联写法（本实验室采用后者，兼容标准 Module Worker）。
      </div>
      <div class="tip-box tip-box--warn">
        <strong>⚠️ Worker 不能访问 DOM</strong>
        Worker 运行在独立上下文，无法访问 window、document、Vue 响应式对象。
        只能通过 postMessage 传递可序列化的数据（JSON、ArrayBuffer、TransferableObject）。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface WorkerResultMessage {
  result: number
  ms: number
}

const isMainRunning = ref(false)
const isWorkerRunning = ref(false)
const mainMs = ref(0)
const workerMs = ref(0)

// 同步斐波那契（故意慢）
function fibonacci(n: number): number {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

// ❌ 主线程执行
function runOnMain() {
  isMainRunning.value = true
  mainMs.value = 0
  // setTimeout(0) 让 Vue 先渲染"冻结"状态，再执行
  setTimeout(() => {
    const t0 = performance.now()
    fibonacci(42)
    mainMs.value = +(performance.now() - t0).toFixed(0)
    isMainRunning.value = false
  }, 0)
}

// ✅ Worker 执行
function runOnWorker() {
  isWorkerRunning.value = true
  workerMs.value = 0

  // 内联 Worker：把函数转成 Blob URL，无需单独文件
  const workerCode = `
    function fibonacci(n) {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    }
    self.onmessage = ({ data }) => {
      const t0 = performance.now();
      const result = fibonacci(data.n);
      self.postMessage({ result, ms: +(performance.now() - t0).toFixed(0) });
    };
  `
  const blob = new Blob([workerCode], { type: 'application/javascript' })
  const url = URL.createObjectURL(blob)
  const worker = new Worker(url)

  worker.postMessage({ n: 42 })
  worker.onmessage = ({ data }: MessageEvent<WorkerResultMessage>) => {
    workerMs.value = data.ms
    isWorkerRunning.value = false
    worker.terminate()
    URL.revokeObjectURL(url)
  }
}
</script>

<style scoped lang="scss">
.fps-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 12px;
}

.fps-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-border);

  &--active {
    background: var(--color-success);
    animation: pulse 1s infinite;
  }

  &--frozen {
    background: var(--color-danger);
    animation: none;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.anim-track {
  height: 40px;
  background: var(--color-bg);
  border-radius: 20px;
  margin-top: 16px;
  overflow: hidden;
  position: relative;
}

.anim-ball {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary);
  position: absolute;
  top: 6px;
  left: 6px;
  animation: bounce 1.5s ease-in-out infinite alternate;

  &--paused {
    animation-play-state: paused;
  }
}

@keyframes bounce {
  from { left: 6px; }
  to { left: calc(100% - 34px); }
}
</style>
