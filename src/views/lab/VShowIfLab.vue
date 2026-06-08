<template>
  <div>
    <div class="lab-card">
      <h2>👁️ 实验室：v-show vs v-if</h2>
      <p>
        <code>v-if</code> 是「条件渲染」—— false 时不创建 DOM，切换会销毁/重建子树。
        <code>v-show</code> 是「条件展示」—— 始终渲染 DOM，仅切换 <code>display: none</code>。
      </p>
      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        Elements 面板 → 切换显示/隐藏 → 观察 DOM 节点是否增删。 Performance 面板 → 录制 → 点击「连切
        20 次」→ 对比两侧 Scripting / Layout 耗时。
      </div>
    </div>

    <!-- 场景 1：初始隐藏时的 DOM 开销 -->
    <div class="lab-card">
      <h2>场景 1：初始隐藏 —— 谁占了 DOM？</h2>
      <p>两侧默认都是「隐藏」。注意 v-show 在首次渲染时就已经创建了 {{ itemCount }} 行 DOM。</p>

      <div class="compare-grid">
        <div class="compare-box compare-box--good">
          <div class="compare-box__header">✅ v-if —— 隐藏 = 零 DOM</div>
          <div class="compare-box__body">
            <div class="code-snippet">
              <span class="cmt">// false 时不渲染，零 DOM 开销</span> &lt;HeavyPanel
              <span class="kw">v-if</span>=<span class="str">"visible"</span> /&gt;
            </div>
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-item__label">当前 DOM 节点</div>
                <div class="metric-item__value" style="color: var(--color-success)">
                  {{ ifDomCount }}
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-item__label">挂载次数</div>
                <div class="metric-item__value">{{ ifMountCount }}</div>
              </div>
            </div>
            <HeavyTogglePanel
              v-if="visibleIf"
              ref="ifPanelRef"
              label="v-if"
              @mounted="onIfMounted"
            />
            <p v-else class="lab-hint">（组件未挂载，DOM 不存在）</p>
          </div>
        </div>

        <div class="compare-box compare-box--bad">
          <div class="compare-box__header">❌ v-show —— 隐藏仍有 DOM</div>
          <div class="compare-box__body">
            <div class="code-snippet">
              <span class="cmt">// 首次渲染即创建 DOM，仅 display:none</span> &lt;HeavyPanel
              <span class="kw">v-show</span>=<span class="str">"visible"</span> /&gt;
            </div>
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-item__label">当前 DOM 节点</div>
                <div class="metric-item__value" style="color: var(--color-danger)">
                  {{ showDomCount }}
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-item__label">挂载次数</div>
                <div class="metric-item__value">{{ showMountCount }}</div>
              </div>
            </div>
            <HeavyTogglePanel
              v-show="visibleShow"
              ref="showPanelRef"
              label="v-show"
              @mounted="onShowMounted"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 场景 2：频繁切换 -->
    <div class="lab-card">
      <h2>场景 2：频繁切换 —— 谁更快？</h2>
      <p>Tab 切换、下拉面板等<strong>高频</strong>显隐场景，v-show 通常更快（无销毁/重建）。</p>

      <div class="compare-grid">
        <div class="compare-box compare-box--bad">
          <div class="compare-box__header">❌ v-if 连切 —— 每次重建 {{ itemCount }} 行</div>
          <div class="compare-box__body">
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-item__label">20 次切换耗时</div>
                <div class="metric-item__value" style="color: var(--color-danger)">
                  {{ ifToggleMs }}ms
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-item__label">累计挂载</div>
                <div class="metric-item__value">{{ ifMountCount }}</div>
              </div>
            </div>
            <div class="btn-row">
              <button class="btn btn-primary" @click="visibleIf = !visibleIf">
                {{ visibleIf ? '隐藏' : '显示' }}
              </button>
              <button class="btn btn-ghost" :disabled="ifBenchmarking" @click="benchmarkIf">
                {{ ifBenchmarking ? '测试中…' : '连切 20 次' }}
              </button>
            </div>
          </div>
        </div>

        <div class="compare-box compare-box--good">
          <div class="compare-box__header">✅ v-show 连切 —— 只改 CSS</div>
          <div class="compare-box__body">
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-item__label">20 次切换耗时</div>
                <div class="metric-item__value" style="color: var(--color-success)">
                  {{ showToggleMs }}ms
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-item__label">累计挂载</div>
                <div class="metric-item__value">{{ showMountCount }}</div>
              </div>
            </div>
            <div class="btn-row">
              <button class="btn btn-primary" @click="visibleShow = !visibleShow">
                {{ visibleShow ? '隐藏' : '显示' }}
              </button>
              <button class="btn btn-ghost" :disabled="showBenchmarking" @click="benchmarkShow">
                {{ showBenchmarking ? '测试中…' : '连切 20 次' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 选型指南 -->
    <div class="lab-card">
      <h2>📖 选型决策树</h2>
      <table class="guide-table">
        <thead>
          <tr>
            <th>场景</th>
            <th>推荐</th>
            <th>原因</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>初始大概率隐藏（弹窗、折叠面板）</td>
            <td><code>v-if</code></td>
            <td>不创建 DOM，减少首屏节点数</td>
          </tr>
          <tr>
            <td>高频切换（Tab、Tooltip）</td>
            <td><code>v-show</code></td>
            <td>避免反复 mount/unmount</td>
          </tr>
          <tr>
            <td>子组件有昂贵初始化（请求、图表）</td>
            <td><code>v-if</code></td>
            <td>隐藏时销毁，释放内存与监听</td>
          </tr>
          <tr>
            <td>需要保留输入状态</td>
            <td><code>v-show</code> 或 KeepAlive</td>
            <td>DOM 实例不被销毁</td>
          </tr>
          <tr>
            <td>配合 <code>&lt;transition&gt;</code></td>
            <td><code>v-if</code></td>
            <td>进入/离开过渡需要挂载/卸载钩子</td>
          </tr>
        </tbody>
      </table>

      <div class="tip-box tip-box--warn" style="margin-top: 16px">
        <strong>⚠️ 常见误区</strong>
        认为 v-show 「比 v-if 性能总是更好」—— 错。 v-show 在隐藏时仍占用 DOM
        和内存；大量隐藏内容应使用 v-if 或懒加载。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import HeavyTogglePanel from '@/components/HeavyTogglePanel.vue'
import { afterPaint } from '@/utils/measureRender'

const itemCount = 300

const visibleIf = ref(false)
const visibleShow = ref(false)

const ifPanelRef = ref<InstanceType<typeof HeavyTogglePanel> | null>(null)
const showPanelRef = ref<InstanceType<typeof HeavyTogglePanel> | null>(null)

const ifMountCount = ref(0)
const showMountCount = ref(0)
const ifToggleMs = ref(0)
const showToggleMs = ref(0)
const ifBenchmarking = ref(false)
const showBenchmarking = ref(false)

const ifDomCount = computed(() =>
  visibleIf.value ? (ifPanelRef.value?.getDomCount() ?? itemCount) : 0,
)

const showDomCount = computed(() => showPanelRef.value?.getDomCount() ?? itemCount)

function onIfMounted() {
  ifMountCount.value++
}

function onShowMounted() {
  showMountCount.value++
}

watch(visibleIf, () => nextTick())
watch(visibleShow, () => nextTick())

async function benchmarkIf() {
  ifBenchmarking.value = true
  const t0 = performance.now()
  for (let i = 0; i < 20; i++) {
    visibleIf.value = !visibleIf.value
    await nextTick()
    await afterPaint()
  }
  ifToggleMs.value = +(performance.now() - t0).toFixed(1)
  ifBenchmarking.value = false
}

async function benchmarkShow() {
  showBenchmarking.value = true
  const t0 = performance.now()
  for (let i = 0; i < 20; i++) {
    visibleShow.value = !visibleShow.value
    await nextTick()
    await afterPaint()
  }
  showToggleMs.value = +(performance.now() - t0).toFixed(1)
  showBenchmarking.value = false
}
</script>

<style scoped lang="scss">
.lab-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 8px 0 0;
}

.btn-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.guide-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    text-align: left;
    padding: 10px 12px 10px 0;
    border-bottom: 1px solid var(--color-border);
    vertical-align: top;
  }

  th {
    color: var(--color-text-muted);
    font-weight: 500;
  }

  td:nth-child(2) {
    color: var(--color-primary);
    white-space: nowrap;
  }

  td:nth-child(3) {
    color: var(--color-text-muted);
  }
}
</style>
