/** 递归斐波那契 — 故意 O(2^n)，用于性能演示 */
export function fibonacci(n: number): number {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}
