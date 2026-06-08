<template>
  <div>
    <div class="lab-card">
      <h2>♻️ 实验室 4：KeepAlive 缓存</h2>
      <p>
        <code>&lt;KeepAlive&gt;</code> 缓存组件实例，切换 Tab 时不销毁、不重建，
        保留用户输入状态，避免重复请求。
      </p>
      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        安装 Vue DevTools → Component 树 → 切换 Tab → 观察组件是否销毁。
        无 KeepAlive：每次切换都会看到组件从树中消失再出现。
        有 KeepAlive：组件始终在树中，状态保留。
      </div>
    </div>

    <div class="compare-grid">
      <!-- 无 KeepAlive -->
      <div class="compare-box compare-box--bad">
        <div class="compare-box__header">❌ 无 KeepAlive —— 每次切换重建组件</div>
        <div class="compare-box__body">
          <div class="code-snippet"><span class="cmt">// ❌ 切换时销毁重建</span>
&lt;<span class="fn">component</span> :is=<span class="str">"current"</span> /&gt;</div>

          <div style="display:flex;gap:8px;margin:12px 0">
            <button
              v-for="tab in tabs" :key="tab.id"
              class="btn"
              :class="noKaTab === tab.id ? 'btn-primary' : 'btn-ghost'"
              @click="noKaTab = tab.id"
            >{{ tab.label }}</button>
          </div>

          <component :is="noKaComponents[noKaTab]" />

          <div class="perf-badge perf-badge--slow" style="margin-top:8px">
            切换次数: {{ noKaSwitches }} | 总挂载次数: {{ noKaMounts }}
          </div>
        </div>
      </div>

      <!-- 有 KeepAlive -->
      <div class="compare-box compare-box--good">
        <div class="compare-box__header">✅ KeepAlive —— 缓存实例，状态不丢</div>
        <div class="compare-box__body">
          <div class="code-snippet"><span class="cmt">// ✅ 缓存组件实例</span>
&lt;<span class="fn">KeepAlive</span>&gt;
  &lt;<span class="fn">component</span> :is=<span class="str">"current"</span> /&gt;
&lt;/<span class="fn">KeepAlive</span>&gt;</div>

          <div style="display:flex;gap:8px;margin:12px 0">
            <button
              v-for="tab in tabs" :key="tab.id"
              class="btn"
              :class="kaTab === tab.id ? 'btn-primary' : 'btn-ghost'"
              @click="kaTab = tab.id"
            >{{ tab.label }}</button>
          </div>

          <KeepAlive>
            <component :is="kaComponents[kaTab]" />
          </KeepAlive>

          <div class="perf-badge perf-badge--fast" style="margin-top:8px">
            切换次数: {{ kaSwitches }} | 总挂载次数: {{ kaMounts }}
          </div>
        </div>
      </div>
    </div>

    <div class="lab-card" style="margin-top:20px">
      <h2>📖 KeepAlive 关键细节</h2>
      <div class="code-snippet"><span class="cmt">// include / exclude：按组件名控制哪些缓存</span>
&lt;<span class="fn">KeepAlive</span> include=<span class="str">"TabA,TabB"</span> :max=<span class="num">5</span>&gt;
  &lt;<span class="fn">component</span> :is=<span class="str">"current"</span> /&gt;
&lt;/<span class="fn">KeepAlive</span>&gt;
<span class="cmt">// max：最多缓存 5 个实例，超出按 LRU 淘汰</span></div>

      <div class="tip-box tip-box--key">
        <strong>activated / deactivated 生命周期</strong>
        被 KeepAlive 缓存的组件不再触发 mounted/unmounted，
        改用 <code>onActivated</code>（显示时）和 <code>onDeactivated</code>（隐藏时）。
        在 onActivated 里做数据刷新，比每次重建更高效。
      </div>
      <div class="tip-box tip-box--warn">
        <strong>⚠️ 什么时候不该用 KeepAlive</strong>
        组件持有大量 DOM 或内存（如 canvas、视频流）时，缓存会让内存持续增长。
        用 max 限制缓存数量，或手动 exclude 这类组件。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent, h, onMounted, watch, type Component, type Ref } from 'vue'

type TabId = 'a' | 'b' | 'c'

// 用于统计挂载次数的简单状态
const noKaMounts = ref(0)
const kaMounts = ref(0)
const noKaSwitches = ref(0)
const kaSwitches = ref(0)

// 创建可复用的 Tab 内容组件
function makeTab(label: string, mountCounter: Ref<number>) {
  return defineComponent({
    name: label,
    setup() {
      const inputVal = ref('')
      const mounts = ref(0)
      onMounted(() => { mounts.value++; mountCounter.value++ })
      return () => h('div', { style: 'padding:8px 0' }, [
        h('p', { style: 'font-size:13px;color:var(--color-text-muted);margin:0 0 8px' },
          `组件挂载次数: ${mounts.value}（KeepAlive 时始终为 1）`),
        h('input', {
          value: inputVal.value,
          onInput: (e: Event) => { inputVal.value = (e.target as HTMLInputElement).value },
          placeholder: `在 ${label} 里输入内容，切换 Tab 看是否保留`,
          style: 'width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px'
        }),
        inputVal.value && h('p', { style: 'margin-top:8px;font-size:13px;color:var(--color-success)' },
          `已输入: "${inputVal.value}"`)
      ])
    }
  })
}

const tabs: { id: TabId; label: string }[] = [
  { id: 'a', label: 'Tab A' },
  { id: 'b', label: 'Tab B' },
  { id: 'c', label: 'Tab C' },
]

// 无 KeepAlive 的组件（每次切换重建，计数器复位）
const noKaComponents: Record<TabId, Component> = {
  a: makeTab('Tab-A', noKaMounts),
  b: makeTab('Tab-B', noKaMounts),
  c: makeTab('Tab-C', noKaMounts),
}

// 有 KeepAlive 的组件（挂载一次后缓存）
const kaComponents: Record<TabId, Component> = {
  a: makeTab('Tab-A', kaMounts),
  b: makeTab('Tab-B', kaMounts),
  c: makeTab('Tab-C', kaMounts),
}

const noKaTab = ref<TabId>('a')
const kaTab = ref<TabId>('a')

watch(noKaTab, () => { noKaSwitches.value++ })
watch(kaTab, () => { kaSwitches.value++ })
</script>
