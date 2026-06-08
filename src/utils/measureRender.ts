/** 双 rAF：等待浏览器完成 layout / paint */
export function afterPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

/** 测量一次 Vue 更新到绘制完成的耗时（ms） */
export async function measurePaintTime(runUpdate: () => void | Promise<void>): Promise<number> {
  const start = performance.now()
  await runUpdate()
  await afterPaint()
  return +(performance.now() - start).toFixed(1)
}

/** 从 PerformanceResourceTiming 获取 JS 资源体积（KB） */
export function getJsResourceSizes(): { name: string; sizeKb: number }[] {
  return performance
    .getEntriesByType('resource')
    .filter((e): e is PerformanceResourceTiming => {
      return e.initiatorType === 'script' || e.name.endsWith('.js')
    })
    .map((e) => ({
      name: e.name.split('/').pop() ?? e.name,
      sizeKb: +((e.transferSize || e.encodedBodySize || 0) / 1024).toFixed(1),
    }))
    .filter((e) => e.sizeKb > 0)
}
