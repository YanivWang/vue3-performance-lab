import { describe, it, expect } from 'vitest'
import { useVirtualList } from './useVirtualList'

describe('useVirtualList', () => {
  const items = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }))

  it('computes visible slice based on scroll position', () => {
    const { visibleItems, domNodeCount, scrollTop } = useVirtualList({
      items,
      itemHeight: 36,
      containerHeight: 300,
    })

    expect(visibleItems.value.length).toBeGreaterThan(0)
    expect(visibleItems.value.length).toBeLessThan(20)
    expect(domNodeCount.value).toBe(visibleItems.value.length)

    scrollTop.value = 360
    expect(visibleItems.value[0]?.id).toBeGreaterThan(0)
  })
})
