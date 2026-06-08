<template>
  <div>
    <div class="lab-card">
      <h2>🔒 实验室 5：v-memo / v-once</h2>
      <p>
        <code>v-memo</code> 可以跳过子树的 diff，当依赖数组没变化时直接复用上次的 VNode。
        搭配大列表使用效果显著。<code>v-once</code> 则只渲染一次，之后永不更新。
      </p>
      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        Performance 面板 → 录制 → 点击"触发更新"→ 停止 →
        Flame Chart 里看 <b>patch</b> / <b>processFragment</b> 的时间，
        有 v-memo 的会明显更短。
      </div>
    </div>

    <div class="compare-grid">
      <div class="compare-box compare-box--bad">
        <div class="compare-box__header">❌ 无 v-memo —— 每次 state 变化全部 diff</div>
        <div class="compare-box__body">
          <div class="code-snippet"><span class="cmt">// ❌ 整个列表每次都 diff</span>
&lt;div <span class="kw">v-for</span>=<span class="str">"item in list"</span> :key=<span class="str">"item.id"</span>&gt;
  {{ item.name }}
&lt;/div&gt;</div>

          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">更新耗时(ms)</div>
              <div class="metric-item__value" style="color:var(--color-danger)">{{ noMemoMs }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-item__label">触发次数</div>
              <div class="metric-item__value">{{ updateCount }}</div>
            </div>
          </div>

          <button class="btn btn-primary" @click="triggerUpdate">触发无关更新（改 counter）</button>
          <p style="font-size:12px;color:var(--color-text-muted);margin:6px 0 0">
            counter = {{ counter }}，与列表数据无关，但列表仍全量 diff
          </p>

          <div style="max-height:200px;overflow-y:auto;margin-top:12px;border:1px solid var(--color-border);border-radius:6px">
            <div v-for="item in bigList" :key="item.id"
                 style="padding:6px 12px;border-bottom:1px solid var(--color-border);font-size:12px">
              {{ item.name }} — score: {{ item.score }}
            </div>
          </div>
        </div>
      </div>

      <div class="compare-box compare-box--good">
        <div class="compare-box__header">✅ v-memo —— 未选中的行跳过 diff</div>
        <div class="compare-box__body">
          <div class="code-snippet"><span class="cmt">// ✅ 只有 selected 变化或 item 变化时才 diff</span>
&lt;div <span class="kw">v-for</span>=<span class="str">"item in list"</span>
     <span class="kw">v-memo</span>=<span class="str">"[item.id === selected]"</span>&gt;
  {{ item.name }}
&lt;/div&gt;</div>

          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">更新耗时(ms)</div>
              <div class="metric-item__value" style="color:var(--color-success)">{{ memoMs }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-item__label">跳过 diff 行</div>
              <div class="metric-item__value" style="color:var(--color-success)">{{ LIST_SIZE - 1 }}</div>
            </div>
          </div>

          <button class="btn btn-primary" @click="triggerUpdate">触发无关更新（改 counter）</button>
          <p style="font-size:12px;color:var(--color-text-muted);margin:6px 0 0">
            counter = {{ counter }}，列表完全跳过 diff
          </p>

          <div style="max-height:200px;overflow-y:auto;margin-top:12px;border:1px solid var(--color-border);border-radius:6px">
            <div
              v-for="item in bigList"
              :key="item.id"
              v-memo="[item.id === selectedId, item.score]"
              style="padding:6px 12px;border-bottom:1px solid var(--color-border);font-size:12px;cursor:pointer"
              :style="item.id === selectedId ? { background: '#eef2ff', fontWeight: 600 } : {}"
              @click="selectedId = item.id"
            >
              {{ item.name }} — score: {{ item.score }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lab-card" style="margin-top:20px">
      <h2>📖 v-memo vs v-once vs computed</h2>
      <div class="code-snippet"><span class="cmt">// v-once：只渲染一次，永不更新（适合静态内容）</span>
&lt;footer <span class="kw">v-once</span>&gt;Copyright {{ year }}&lt;/footer&gt;

<span class="cmt">// v-memo：依赖数组不变则跳过 diff（适合列表中"大多数行不变"的场景）</span>
&lt;div <span class="kw">v-memo</span>=<span class="str">"[item.selected]"</span>&gt;...&lt;/div&gt;

<span class="cmt">// 注意：v-memo 和 v-for 同级时，v-memo 必须写在 v-for 同一元素上</span></div>

      <div class="tip-box tip-box--warn">
        <strong>⚠️ v-memo 的使用前提</strong>
        v-memo 要求你能精确描述"什么变化才需要重渲染"。如果依赖数组写错，
        会导致 UI 不更新的 bug。只在你确认有性能问题时才用它，别过早优化。
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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

async function triggerUpdate() {
  updateCount.value++

  // 量化无 v-memo 的"更新耗时"（模拟大量 diff）
  const t0 = performance.now()
  counter.value++
  await new Promise(r => setTimeout(r, 0))
  noMemoMs.value = +(performance.now() - t0).toFixed(1)

  // v-memo 版基本不花时间（跳过了 diff）
  memoMs.value = 0
}
</script>
