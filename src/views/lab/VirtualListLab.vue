<template>
  <div>
    <div class="lab-card">
      <h2>📋 实验室 2：虚拟列表</h2>
      <p>渲染 10 万条数据。普通列表直接卡死，虚拟列表始终只渲染可见区域（约 20 条），帧率保持 60fps。</p>
      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        Performance 面板 → 录制 → 滚动列表 → 停止。
        对比两侧 <b>FPS 折线图</b>（绿色条）和 <b>Layout 时间</b>（紫色）。
        普通列表 Layout 时间可达几百 ms，虚拟列表几乎为 0。
      </div>
    </div>

    <div class="compare-grid">
      <!-- 坏的 -->
      <div class="compare-box compare-box--bad">
        <div class="compare-box__header">❌ 普通列表 —— 渲染全部 DOM</div>
        <div class="compare-box__body">
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">DOM 节点数</div>
              <div class="metric-item__value" style="color:var(--color-danger)">{{ TOTAL.toLocaleString() }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-item__label">渲染耗时</div>
              <div class="metric-item__value" style="color:var(--color-danger)">{{ normalRenderMs }}ms</div>
            </div>
          </div>

          <button class="btn btn-primary" @click="showNormal = !showNormal" :disabled="normalRenderMs === 0 && showNormal">
            {{ showNormal ? '隐藏' : '渲染普通列表（危险⚠️）' }}
          </button>
          <p style="font-size:12px;color:var(--color-text-muted);margin-top:6px">
            点击后页面可能卡顿几秒，这正是要观察的现象
          </p>

          <div v-if="showNormal"
               style="height:300px;overflow-y:auto;border:1px solid var(--color-border);border-radius:6px;margin-top:12px">
            <div v-for="item in items" :key="item.id"
                 style="padding:8px 12px;border-bottom:1px solid var(--color-border);font-size:13px">
              #{{ item.id }} — {{ item.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- 好的：虚拟列表 -->
      <div class="compare-box compare-box--good">
        <div class="compare-box__header">✅ 虚拟列表 —— 只渲染可见条目</div>
        <div class="compare-box__body">
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">实际 DOM 节点</div>
              <div class="metric-item__value" style="color:var(--color-success)">≈ {{ visibleCount }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-item__label">渲染耗时</div>
              <div class="metric-item__value" style="color:var(--color-success)">{{ virtualRenderMs }}ms</div>
            </div>
          </div>

          <!-- 虚拟列表容器 -->
          <div
            ref="containerRef"
            @scroll="onScroll"
            style="height:300px;overflow-y:auto;border:1px solid var(--color-border);border-radius:6px;margin-top:12px;position:relative"
          >
            <!-- 撑开总高度，让滚动条正确 -->
            <div :style="{ height: totalHeight + 'px', position: 'relative' }">
              <!-- 只渲染可见区域的条目 -->
              <div
                :style="{ position: 'absolute', top: offsetY + 'px', left: 0, right: 0 }"
              >
                <div
                  v-for="item in visibleItems"
                  :key="item.id"
                  :style="{ height: ITEM_HEIGHT + 'px', lineHeight: ITEM_HEIGHT + 'px' }"
                  style="padding:0 12px;border-bottom:1px solid var(--color-border);font-size:13px;overflow:hidden"
                >
                  #{{ item.id }} — {{ item.name }}
                </div>
              </div>
            </div>
          </div>

          <p style="font-size:12px;color:var(--color-text-muted);margin-top:6px">
            上方已默认渲染，可直接滚动体验
          </p>
        </div>
      </div>
    </div>

    <div class="lab-card" style="margin-top:20px">
      <h2>📖 虚拟列表核心原理</h2>
      <div class="code-snippet"><span class="cmt">// 核心计算：根据 scrollTop 决定渲染哪些条目</span>
<span class="kw">const</span> startIndex = Math.<span class="fn">floor</span>(scrollTop / ITEM_HEIGHT)
<span class="kw">const</span> endIndex   = startIndex + visibleCount + <span class="num">2</span> <span class="cmt">// 缓冲 2 条防闪烁</span>
<span class="kw">const</span> offsetY    = startIndex * ITEM_HEIGHT     <span class="cmt">// 绝对定位偏移</span>
<span class="cmt">// 容器总高度 = 数据总数 × 行高（撑开滚动条）</span>
<span class="kw">const</span> totalHeight = items.length * ITEM_HEIGHT</div>

      <div class="tip-box tip-box--key">
        <strong>生产环境建议</strong>
        自己写虚拟列表细节很多（动态行高、横向、Grid）。推荐用成熟库：
        <b>vue-virtual-scroller</b>、<b>@tanstack/virtual</b>、<b>vueuse/useVirtualList</b>。
        本实验室手写是为了理解原理。
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const TOTAL = 100_000
const ITEM_HEIGHT = 36
const CONTAINER_HEIGHT = 300

// 生成数据
const items = Array.from({ length: TOTAL }, (_, i) => ({
  id: i + 1,
  name: `Item-${(Math.random() * 1e6 | 0).toString(36).toUpperCase()}`,
}))

// ---- 普通列表 ----
const showNormal = ref(false)
const normalRenderMs = ref(0)

// 监听 showNormal 变化，量化渲染时间
import { watch } from 'vue'
watch(showNormal, async (val) => {
  if (!val) { normalRenderMs.value = 0; return }
  const t0 = performance.now()
  await new Promise(r => setTimeout(r, 0)) // 等一帧
  normalRenderMs.value = +(performance.now() - t0).toFixed(0)
})

// ---- 虚拟列表 ----
const containerRef = ref(null)
const scrollTop = ref(0)
const visibleCount = Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT) + 2
const totalHeight = TOTAL * ITEM_HEIGHT

const startIndex = computed(() => Math.max(0, Math.floor(scrollTop.value / ITEM_HEIGHT) - 1))
const endIndex = computed(() => Math.min(TOTAL, startIndex.value + visibleCount + 2))
const visibleItems = computed(() => items.slice(startIndex.value, endIndex.value))
const offsetY = computed(() => startIndex.value * ITEM_HEIGHT)

const virtualRenderMs = ref(0)

function onScroll(e) {
  scrollTop.value = e.target.scrollTop
}

onMounted(() => {
  // 量化虚拟列表初始渲染时间
  const t0 = performance.now()
  requestAnimationFrame(() => {
    virtualRenderMs.value = +(performance.now() - t0).toFixed(1)
  })
})
</script>
