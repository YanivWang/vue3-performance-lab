<template>
  <div>
    <div class="lab-card">
      <h2>🧵 实验室 9：Web Worker</h2>
      <p>CPU 密集型任务在主线程执行会阻塞 UI。Web Worker 将任务移到独立线程，主线程保持 60fps。</p>
      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        Performance → 录制 → 分别点击两个按钮 → Main 线程版有大块 Long Task，Worker 版 Main
        几乎空闲，计算在 Worker 线程。
      </div>
    </div>

    <div class="compare-grid">
      <div class="compare-box compare-box--bad">
        <div class="compare-box__header">❌ 主线程计算 —— UI 冻结</div>
        <div class="compare-box__body">
          <div class="fps-indicator">
            <div class="fps-dot" :class="{ 'fps-dot--frozen': isMainRunning }" />
            {{ isMainRunning ? '⚠️ UI 已冻结' : '✅ UI 正常' }}
          </div>

          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">计算耗时</div>
              <div
                class="metric-item__value"
                :style="{ color: mainMs > 0 ? 'var(--color-danger)' : 'inherit' }"
              >
                {{ mainMs > 0 ? mainMs + 'ms' : '–' }}
              </div>
            </div>
          </div>

          <button class="btn btn-primary" :disabled="isMainRunning" @click="runOnMain">
            {{ isMainRunning ? '⏳ 计算中（UI 已冻结）' : '▶️ 主线程 fib(42)' }}
          </button>

          <div class="anim-track">
            <div class="anim-ball" :class="{ 'anim-ball--paused': isMainRunning }" />
          </div>
        </div>
      </div>

      <div class="compare-box compare-box--good">
        <div class="compare-box__header">✅ Vite Worker —— UI 保持流畅</div>
        <div class="compare-box__body">
          <div class="fps-indicator">
            <div class="fps-dot fps-dot--active" />
            ✅ UI 始终流畅
          </div>

          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">Worker 耗时</div>
              <div class="metric-item__value" style="color: var(--color-success)">
                {{ workerMs > 0 ? workerMs + 'ms' : '–' }}
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-item__label">结果</div>
              <div class="metric-item__value metric-item__value--sm">
                {{ workerResult ?? '–' }}
              </div>
            </div>
          </div>

          <button class="btn btn-primary" :disabled="isWorkerRunning" @click="runOnWorker">
            {{ isWorkerRunning ? '⏳ Worker 计算中' : '▶️ Worker 线程 fib(42)' }}
          </button>

          <div class="anim-track">
            <div class="anim-ball" />
          </div>
        </div>
      </div>
    </div>

    <div class="lab-card" style="margin-top: 20px">
      <h2>📖 Vite Worker 用法</h2>
      <div class="code-snippet">
        <span class="cmt">// src/workers/fib.worker.ts</span>
        <span class="kw">import</span> FibWorker <span class="kw">from</span>
        <span class="str">'@/workers/fib.worker.ts?worker'</span>
        <span class="kw">const</span> worker = <span class="kw">new</span>
        <span class="fn">FibWorker</span>() worker.<span class="fn">postMessage</span>({ n:
        <span class="num">42</span> }) worker.onmessage = (e) => console.<span class="fn">log</span
        >(e.data)
      </div>
      <div class="tip-box tip-box--warn">
        <strong>⚠️ Worker 不能访问 DOM</strong>
        只能通过 postMessage 传递可序列化数据（JSON、ArrayBuffer、Transferable）。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { fibonacci } from '@/utils/fibonacci'
import FibWorker from '@/workers/fib.worker.ts?worker'
import type { FibWorkerResult } from '@/workers/fib.worker.ts'

const isMainRunning = ref(false)
const isWorkerRunning = ref(false)
const mainMs = ref(0)
const workerMs = ref(0)
const workerResult = ref<number | null>(null)

function runOnMain() {
  isMainRunning.value = true
  mainMs.value = 0
  setTimeout(() => {
    const t0 = performance.now()
    fibonacci(42)
    mainMs.value = +(performance.now() - t0).toFixed(0)
    isMainRunning.value = false
  }, 0)
}

function runOnWorker() {
  isWorkerRunning.value = true
  workerMs.value = 0
  workerResult.value = null

  const worker = new FibWorker()
  worker.postMessage({ n: 42 })
  worker.onmessage = ({ data }: MessageEvent<FibWorkerResult>) => {
    workerMs.value = data.ms
    workerResult.value = data.result
    isWorkerRunning.value = false
    worker.terminate()
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
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
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
  animation: bounce 1.5s ease-in-out infinite alternate;

  &--paused {
    animation-play-state: paused;
  }
}

@keyframes bounce {
  from {
    left: 6px;
  }

  to {
    left: calc(100% - 34px);
  }
}

.metric-item__value--sm {
  font-size: 16px;
}
</style>
