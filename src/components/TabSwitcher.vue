<template>
  <div class="tab-switcher">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="btn"
      :class="modelValue === tab.id ? 'btn-primary' : 'btn-ghost'"
      @click="$emit('update:modelValue', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  tabs: { id: string; label: string }[]
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped lang="scss">
.tab-switcher {
  display: flex;
  gap: 8px;
  margin: 12px 0;
  flex-wrap: wrap;
}
</style>
