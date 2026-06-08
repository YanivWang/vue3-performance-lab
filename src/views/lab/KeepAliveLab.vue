<template>
  <div>
    <div class="lab-card">
      <h2>♻️ 实验室 5：KeepAlive 缓存</h2>
      <p>
        <code>&lt;KeepAlive&gt;</code> 缓存组件实例，切换 Tab 时不销毁、不重建，
        保留用户输入状态，避免重复请求。
      </p>
      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        Vue DevTools → Component 树 → 切换 Tab → 观察组件是否销毁。 无
        KeepAlive：组件从树中消失再出现。有 KeepAlive：组件始终在树中。
      </div>
    </div>

    <div class="compare-grid">
      <div class="compare-box compare-box--bad">
        <div class="compare-box__header">❌ 无 KeepAlive —— 每次切换重建</div>
        <div class="compare-box__body">
          <TabSwitcher v-model="noKaTab" :tabs="tabs" />
          <component :is="noKaComponents[noKaTab]" />
          <div class="perf-badge perf-badge--slow">
            切换: {{ noKaSwitches }} | 总挂载: {{ noKaMounts }}
          </div>
        </div>
      </div>

      <div class="compare-box compare-box--good">
        <div class="compare-box__header">✅ KeepAlive —— 缓存实例，状态不丢</div>
        <div class="compare-box__body">
          <TabSwitcher v-model="kaTab" :tabs="tabs" />
          <KeepAlive :max="2">
            <component :is="kaComponents[kaTab]" :key="kaTab" />
          </KeepAlive>
          <div class="perf-badge perf-badge--fast">
            切换: {{ kaSwitches }} | 总挂载: {{ kaMounts }}（每 Tab 最多 1 次）
          </div>
          <p class="lab-hint">max=2：最多缓存 2 个 Tab，超出按 LRU 淘汰</p>
        </div>
      </div>
    </div>

    <div class="lab-card" style="margin-top: 20px">
      <h2>📖 生命周期：activated / deactivated</h2>
      <div class="event-log">
        <div v-for="(log, i) in lifecycleLogs.slice(-6)" :key="i">{{ log }}</div>
        <div v-if="!lifecycleLogs.length" style="color: var(--color-text-muted)">
          切换 KeepAlive Tab 查看日志…
        </div>
      </div>
      <TabSwitcher v-model="logTab" :tabs="tabs" />
      <KeepAlive include="Tab-A,Tab-B,Tab-C">
        <component :is="logComponents[logTab]" :key="logTab" />
      </KeepAlive>

      <div class="code-snippet" style="margin-top: 16px">
        <span class="cmt">// include / exclude / max</span> &lt;<span class="fn">KeepAlive</span>
        include=<span class="str">"TabA,TabB"</span> :max=<span class="num">2</span>&gt; &lt;<span
          class="fn"
          >component</span
        >
        :is=<span class="str">"current"</span> /&gt; &lt;/<span class="fn">KeepAlive</span>&gt;
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  defineComponent,
  h,
  onMounted,
  watch,
  onActivated,
  onDeactivated,
  type Component,
  type Ref,
} from 'vue'
import TabSwitcher from '@/components/TabSwitcher.vue'

type TabId = 'a' | 'b' | 'c'

const noKaMounts = ref(0)
const kaMounts = ref(0)
const noKaSwitches = ref(0)
const kaSwitches = ref(0)
const lifecycleLogs = ref<string[]>([])

function logLifecycle(event: string, label: string) {
  lifecycleLogs.value.push(`[${new Date().toLocaleTimeString()}] ${label} → ${event}`)
}

function makeTab(label: string, mountCounter: Ref<number>, withLifecycle = false) {
  return defineComponent({
    name: label,
    setup() {
      const inputVal = ref('')
      const mounts = ref(0)
      onMounted(() => {
        mounts.value++
        mountCounter.value++
      })
      if (withLifecycle) {
        onActivated(() => logLifecycle('activated', label))
        onDeactivated(() => logLifecycle('deactivated', label))
      }
      return () =>
        h('div', { style: 'padding:8px 0' }, [
          h(
            'p',
            { style: 'font-size:13px;color:var(--color-text-muted);margin:0 0 8px' },
            `挂载次数: ${mounts.value}${withLifecycle ? '' : '（KeepAlive 时每 Tab 为 1）'}`,
          ),
          h('input', {
            value: inputVal.value,
            onInput: (e: Event) => {
              inputVal.value = (e.target as HTMLInputElement).value
            },
            placeholder: `在 ${label} 输入，切换 Tab 看是否保留`,
            style:
              'width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px',
          }),
          inputVal.value &&
            h(
              'p',
              { style: 'margin-top:8px;font-size:13px;color:var(--color-success)' },
              `已输入: "${inputVal.value}"`,
            ),
        ])
    },
  })
}

const tabs = [
  { id: 'a' as TabId, label: 'Tab A' },
  { id: 'b' as TabId, label: 'Tab B' },
  { id: 'c' as TabId, label: 'Tab C' },
]

const noKaComponents: Record<TabId, Component> = {
  a: makeTab('Tab-A', noKaMounts),
  b: makeTab('Tab-B', noKaMounts),
  c: makeTab('Tab-C', noKaMounts),
}

const kaComponents: Record<TabId, Component> = {
  a: makeTab('Tab-A', kaMounts),
  b: makeTab('Tab-B', kaMounts),
  c: makeTab('Tab-C', kaMounts),
}

const logComponents: Record<TabId, Component> = {
  a: makeTab('Tab-A', ref(0), true),
  b: makeTab('Tab-B', ref(0), true),
  c: makeTab('Tab-C', ref(0), true),
}

const noKaTab = ref<TabId>('a')
const kaTab = ref<TabId>('a')
const logTab = ref<TabId>('a')

watch(noKaTab, () => {
  noKaSwitches.value++
})
watch(kaTab, () => {
  kaSwitches.value++
})
</script>

<style scoped lang="scss">
.lab-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 6px;
}

.event-log {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 12px;
  font-family: $font-mono;
  max-height: 120px;
  overflow-y: auto;
  margin-bottom: 12px;
}
</style>
