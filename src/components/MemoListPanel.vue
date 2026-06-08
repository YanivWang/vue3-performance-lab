<template>
  <div :class="['compare-box', variant === 'bad' ? 'compare-box--bad' : 'compare-box--good']">
    <div class="compare-box__header">{{ title }}</div>
    <div class="compare-box__body">
      <div class="list-scroll">
        <template v-if="useMemo">
          <div
            v-for="item in list"
            :key="item.id"
            v-memo="[item.id === selectedId, item.score]"
            class="list-row"
            :class="{ 'list-row--selected': item.id === selectedId }"
            @click="$emit('select', item.id)"
          >
            {{ item.name }} — score: {{ item.score }}
          </div>
        </template>
        <template v-else>
          <div v-for="item in list" :key="item.id" class="list-row">
            {{ item.name }} — score: {{ item.score }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { measurePaintTime } from '@/utils/measureRender'

interface ListRow {
  id: number
  name: string
  score: number
}

const props = defineProps<{
  title: string
  variant: 'bad' | 'good'
  useMemo: boolean
  counter: number
  list: ListRow[]
  selectedId: number
}>()

const emit = defineEmits<{
  'update-time': [ms: number]
  select: [id: number]
}>()

watch(
  () => props.counter,
  async () => {
    const ms = await measurePaintTime(async () => {})
    emit('update-time', ms)
  },
)
</script>

<style scoped lang="scss">
.list-scroll {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.list-row {
  padding: 6px 12px;
  border-bottom: 1px solid var(--color-border);
  font-size: 12px;
  cursor: default;

  &--selected {
    background: #eef2ff;
    font-weight: 600;
    cursor: pointer;
  }
}
</style>
