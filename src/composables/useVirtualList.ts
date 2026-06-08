import { ref, computed, type Ref } from 'vue'

export interface VirtualListOptions<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export function useVirtualList<T>(options: VirtualListOptions<T>) {
  const { items, itemHeight, containerHeight, overscan = 2 } = options
  const scrollTop: Ref<number> = ref(0)

  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan
  const totalHeight = computed(() => items.length * itemHeight)

  const startIndex = computed(() => Math.max(0, Math.floor(scrollTop.value / itemHeight) - 1))

  const endIndex = computed(() =>
    Math.min(items.length, startIndex.value + visibleCount + overscan),
  )

  const visibleItems = computed(() => items.slice(startIndex.value, endIndex.value))
  const offsetY = computed(() => startIndex.value * itemHeight)
  const domNodeCount = computed(() => endIndex.value - startIndex.value)

  function onScroll(e: Event) {
    scrollTop.value = (e.target as HTMLElement).scrollTop
  }

  /** rAF 节流版 scroll，减少滚动时重渲染频率 */
  let rafId = 0
  function onScrollRaf(e: Event) {
    const target = e.target as HTMLElement
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      scrollTop.value = target.scrollTop
      rafId = 0
    })
  }

  return {
    scrollTop,
    totalHeight,
    visibleItems,
    offsetY,
    domNodeCount,
    visibleCount,
    onScroll,
    onScrollRaf,
  }
}
