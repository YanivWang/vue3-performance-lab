type LazyCallback = (entry: IntersectionObserverEntry) => void

let sharedObserver: IntersectionObserver | null = null
const callbackMap = new WeakMap<Element, LazyCallback>()

function getSharedObserver(rootMargin = '50px') {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const cb = callbackMap.get(entry.target)
          if (cb) {
            cb(entry)
            sharedObserver?.unobserve(entry.target)
            callbackMap.delete(entry.target)
          }
        })
      },
      { rootMargin },
    )
  }
  return sharedObserver
}

export function observeLazy(el: Element, callback: LazyCallback, rootMargin = '50px') {
  callbackMap.set(el, callback)
  getSharedObserver(rootMargin).observe(el)
}

export function disconnectSharedObserver() {
  sharedObserver?.disconnect()
  sharedObserver = null
}
