<template>
  <div ref="rootRef" class="heavy-panel">
    <p class="heavy-panel__meta">挂载次数: {{ mountCount }} | DOM 节点: ≈{{ ITEM_COUNT + 2 }}</p>
    <div v-for="item in items" :key="item.id" class="heavy-panel__row">
      {{ item.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const ITEM_COUNT = 300

const props = defineProps<{ label: string }>()

const emit = defineEmits<{
  mounted: []
  unmounted: []
}>()

const rootRef = ref<HTMLElement | null>(null)
const mountCount = ref(0)

const items = Array.from({ length: ITEM_COUNT }, (_, i) => ({
  id: i,
  label: `${props.label} — Row ${i + 1}`,
}))

onMounted(() => {
  mountCount.value++
  emit('mounted')
})

onUnmounted(() => {
  emit('unmounted')
})

defineExpose({
  getDomCount: () => rootRef.value?.querySelectorAll('*').length ?? 0,
  itemCount: ITEM_COUNT,
})
</script>

<style scoped lang="scss">
.heavy-panel {
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg);
}

.heavy-panel__meta {
  position: sticky;
  top: 0;
  margin: 0;
  padding: 6px 10px;
  font-size: 11px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.heavy-panel__row {
  padding: 4px 10px;
  font-size: 11px;
  border-bottom: 1px solid var(--color-border);
}
</style>
