export function throttle<T extends (...args: never[]) => void>(fn: T, interval: number) {
  let last = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn(...args)
    }
  }
}
