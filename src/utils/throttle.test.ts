import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { throttle } from './throttle'

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('executes at most once per interval', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 200)

    throttled()
    throttled()
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(200)
    throttled()
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
