export interface DebouncedFunction<T extends (...args: never[]) => void> {
  (...args: Parameters<T>): void
  cancel: () => void
}

export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number,
): DebouncedFunction<T> {
  let timer: ReturnType<typeof setTimeout> | undefined

  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }

  debounced.cancel = () => {
    clearTimeout(timer)
    timer = undefined
  }

  return debounced
}
