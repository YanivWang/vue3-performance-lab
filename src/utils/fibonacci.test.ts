import { describe, it, expect } from 'vitest'
import { fibonacci } from './fibonacci'

describe('fibonacci', () => {
  it('returns correct values for small n', () => {
    expect(fibonacci(0)).toBe(0)
    expect(fibonacci(1)).toBe(1)
    expect(fibonacci(10)).toBe(55)
  })
})
