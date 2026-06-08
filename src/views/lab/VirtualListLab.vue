<template>
  <div>
    <div class="lab-card">
      <h2>📋 实验室 2：虚拟列表</h2>
      <p>
        渲染 10 万条数据。普通列表直接卡死，虚拟列表始终只渲染可见区域（约 20 条），帧率保持 60fps。
      </p>
      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        Performance 面板 → 录制 → 滚动列表 → 停止。 对比两侧 <b>FPS 折线图</b> 和
        <b>Layout 时间</b>。 普通列表 Layout 时间可达几百 ms，虚拟列表几乎为 0。
      </div>
    </div>

    <div class="compare-grid">
      <div class="compare-box compare-box--bad">
        <div class="compare-box__header">❌ 普通列表 —— 渲染全部 DOM</div>
        <div class="compare-box__body">
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">DOM 节点数</div>
              <div class="metric-item__value" style="color: var(--color-danger)">
                {{ TOTAL.toLocaleString() }}
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-item__label">渲染耗时</div>
              <div class="metric-item__value" style="color: var(--color-danger)">
                {{ normalRenderMs }}ms
              </div>
            </div>
          </div>

          <button class="btn btn-primary" @click="toggleNormal" :disabled="normalLoading">
            {{ showNormal ? '隐藏' : '渲染普通列表（危险⚠️）' }}
          </button>
          <p class="lab-hint">点击后页面可能卡顿几秒，这正是要观察的现象</p>

          <div v-if="showNormal" class="list-container">
            <div v-for="item in items" :key="item.id" class="list-row">
              #{{ item.id }} — {{ item.name }}
            </div>
          </div>
        </div>
      </div>

      <div class="compare-box compare-box--good">
        <div class="compare-box__header">✅ 虚拟列表 —— 只渲染可见条目</div>
        <div class="compare-box__body">
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">实际 DOM 节点</div>
              <div class="metric-item__value" style="color: var(--color-success)">
                ≈ {{ domNodeCount }}
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-item__label">初始渲染耗时</div>
              <div class="metric-item__value" style="color: var(--color-success)">
                {{ virtualRenderMs }}ms
              </div>
            </div>
          </div>

          <div class="list-container" @scroll="onScrollRaf">
            <div :style="{ height: totalHeight + 'px', position: 'relative' }">
              <div :style="{ position: 'absolute', top: offsetY + 'px', left: 0, right: 0 }">
                <div
                  v-for="item in visibleItems"
                  :key="item.id"
                  class="list-row"
                  :style="{ height: ITEM_HEIGHT + 'px', lineHeight: ITEM_HEIGHT + 'px' }"
                >
                  #{{ item.id }} — {{ item.name }}
                </div>
              </div>
            </div>
          </div>
          <p class="lab-hint">滚动使用 rAF 节流，上方已默认渲染，可直接滚动体验</p>
        </div>
      </div>
    </div>

    <div class="lab-card" style="margin-top: 20px">
      <h2>📖 虚拟列表核心原理</h2>
      <div class="code-snippet">
        <span class="cmt">// 核心：useVirtualList composable（src/composables/）</span>
        <span class="kw">const</span> startIndex = Math.<span class="fn">floor</span>(scrollTop /
        ITEM_HEIGHT) <span class="kw">const</span> visibleItems = items.<span class="fn">slice</span
        >(startIndex, endIndex) <span class="kw">const</span> offsetY = startIndex * ITEM_HEIGHT
      </div>
      <div class="tip-box tip-box--key">
        <strong>生产环境建议</strong>
        自己写虚拟列表细节很多（动态行高、横向、Grid）。推荐
        <b>@tanstack/vue-virtual</b>、<b>vue-virtual-scroller</b>。 本实验室手写 + composable
        是为了理解原理。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ListItem } from '@/types'
import { useVirtualList } from '@/composables/useVirtualList'
import { measurePaintTime } from '@/utils/measureRender'

const TOTAL = 100_000
const ITEM_HEIGHT = 36
const CONTAINER_HEIGHT = 300

const items: ListItem[] = Array.from({ length: TOTAL }, (_, i) => ({
  id: i + 1,
  name: `Item-${((Math.random() * 1e6) | 0).toString(36).toUpperCase()}`,
}))

const showNormal = ref(false)
const normalRenderMs = ref(0)
const normalLoading = ref(false)
const virtualRenderMs = ref(0)

const { totalHeight, visibleItems, offsetY, domNodeCount, onScrollRaf } = useVirtualList({
  items,
  itemHeight: ITEM_HEIGHT,
  containerHeight: CONTAINER_HEIGHT,
})

async function toggleNormal() {
  if (showNormal.value) {
    showNormal.value = false
    normalRenderMs.value = 0
    return
  }
  normalLoading.value = true
  showNormal.value = true
  normalRenderMs.value = await measurePaintTime(async () => {})
  normalLoading.value = false
}

onMounted(async () => {
  virtualRenderMs.value = await measurePaintTime(async () => {})
})
</script>

<style scoped lang="scss">
.list-container {
  height: 300px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  margin-top: 12px;
}

.list-row {
  padding: 0 12px;
  border-bottom: 1px solid var(--color-border);
  font-size: 13px;
  overflow: hidden;
}

.lab-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 6px;
}
</style>
