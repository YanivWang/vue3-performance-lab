import { fibonacci } from '@/utils/fibonacci'

export interface FibWorkerResult {
  result: number
  ms: number
}

self.onmessage = (e: MessageEvent<{ n: number }>) => {
  const t0 = performance.now()
  const result = fibonacci(e.data.n)
  const ms = +(performance.now() - t0).toFixed(0)
  self.postMessage({ result, ms } satisfies FibWorkerResult)
}
