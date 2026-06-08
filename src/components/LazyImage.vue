<template>
  <img ref="imgRef" :alt="alt" :class="['lazy-image', { 'lazy-image--loaded': loaded }]" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { observeLazy } from '@/composables/useSharedLazyObserver'

const props = defineProps<{
  src: string
  alt?: string
}>()

const emit = defineEmits<{
  loaded: []
}>()

const imgRef = ref<HTMLImageElement | null>(null)
const loaded = ref(false)

onMounted(() => {
  const el = imgRef.value
  if (!el) return

  observeLazy(el, () => {
    el.src = props.src
    el.onload = () => {
      loaded.value = true
      emit('loaded')
    }
  })
})
</script>

<style scoped lang="scss">
.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s;

  &--loaded {
    opacity: 1;
  }
}
</style>
