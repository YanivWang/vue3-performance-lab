<template>
  <div>
    <div class="lab-card">
      <h2>🔒 实验室 3：v-memo / v-once</h2>
      <p>
        <code>v-memo</code> 可以跳过子树的 diff，当依赖数组没变化时直接复用上次的 VNode。
        搭配大列表使用效果显著。
      </p>
      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        Performance 面板 → 录制 → 点击「触发无关更新」→ 停止 → 对比两侧 patch 耗时差异。
      </div>
    </div>

    <div class="compare-grid">
      <MemoListPanel
        title="❌ 无 v-memo —— counter 变化时全量 diff"
        variant="bad"
        :use-memo="false"
        :counter="counter"
        :list="bigList"
        :selected-id="selectedId"
        @update-time="noMemoMs = $event"
      />
      <MemoListPanel
        title="✅ v-memo —— counter 变化时跳过列表 diff"
        variant="good"
        :use-memo="true"
        :counter="counter"
        :list="bigList"
        :selected-id="selectedId"
        @update-time="memoMs = $event"
        @select="selectedId = $event"
      />
    </div>

    <div class="lab-card" style="margin-top: 16px">
      <button class="btn btn-primary" @click="triggerUpdate">
        触发无关更新（counter: {{ counter }} → {{ counter + 1 }}）
      </button>
      <div class="metrics-row" style="margin-top: 12px">
        <div class="metric-item">
          <div class="metric-item__label">无 v-memo 更新耗时</div>
          <div class="metric-item__value" style="color: var(--color-danger)">{{ noMemoMs }}ms</div>
        </div>
        <div class="metric-item">
          <div class="metric-item__label">有 v-memo 更新耗时</div>
          <div class="metric-item__value" style="color: var(--color-success)">{{ memoMs }}ms</div>
        </div>
        <div class="metric-item">
          <div class="metric-item__label">触发次数</div>
          <div class="metric-item__value">{{ updateCount }}</div>
        </div>
      </div>
      <p class="lab-hint">
        v-memo 依赖为 <code>[item.id === selectedId, item.score]</code>（不含 counter）— counter
        变化时，有 v-memo 的列表行跳过 diff。
      </p>
    </div>

    <div class="lab-card">
      <h2>📖 v-memo vs v-once</h2>
      <div class="code-snippet" v-pre>
        <span class="cmt">// v-once：只渲染一次</span> &lt;footer v-once&gt;Copyright
        {{ year }}&lt;/footer&gt;

        <span class="cmt">// v-memo：依赖不变则跳过 diff</span>
        &lt;div v-for="item in list" v-memo="[item.selected]"&gt;...&lt;/div&gt;
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MemoListPanel from '@/components/MemoListPanel.vue'

const LIST_SIZE = 500
const bigList = Array.from({ length: LIST_SIZE }, (_, i) => ({
  id: i + 1,
  name: `Item-${i + 1}`,
  score: Math.floor(Math.random() * 100),
}))

const counter = ref(0)
const selectedId = ref(1)
const noMemoMs = ref(0)
const memoMs = ref(0)
const updateCount = ref(0)

function triggerUpdate() {
  updateCount.value++
  counter.value++
}
</script>

<style scoped lang="scss">
.lab-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 8px 0 0;
}
</style>
