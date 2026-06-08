<template>
  <div>
    <div class="lab-card">
      <h2>🖼️ 实验室 7：图片懒加载</h2>
      <p>
        视口外的图片不立即加载。对比三种方案：直接 src、IntersectionObserver（共享实例）、浏览器原生
        loading="lazy"。
      </p>
      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        Network → 过滤 Img → 打开页面时观察请求数量 → 滚动后对比新增请求。
      </div>
    </div>

    <div class="compare-grid compare-grid--triple">
      <div class="compare-box compare-box--bad">
        <div class="compare-box__header">❌ 直接 src</div>
        <div class="compare-box__body">
          <p class="lab-hint">页面打开即请求全部 {{ IMAGES.length }} 张</p>
          <div class="img-grid">
            <img
              v-for="img in IMAGES"
              :key="img.id"
              :src="img.url"
              :alt="img.alt"
              class="img-thumb"
            />
          </div>
        </div>
      </div>

      <div class="compare-box compare-box--good">
        <div class="compare-box__header">✅ 共享 Observer</div>
        <div class="compare-box__body">
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">已加载</div>
              <div class="metric-item__value" style="color: var(--color-success)">
                {{ observerLoaded }}
              </div>
            </div>
          </div>
          <div class="img-grid">
            <div v-for="img in IMAGES" :key="img.id" class="img-cell">
              <LazyImage :src="img.url" :alt="img.alt" @loaded="observerLoaded++" />
            </div>
          </div>
        </div>
      </div>

      <div class="compare-box compare-box--good">
        <div class="compare-box__header">✅ loading="lazy"</div>
        <div class="compare-box__body">
          <p class="lab-hint">零 JS，浏览器原生实现</p>
          <div class="img-grid">
            <img
              v-for="img in IMAGES"
              :key="'native-' + img.id"
              :src="img.url"
              :alt="img.alt"
              loading="lazy"
              class="img-thumb"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="lab-card" style="margin-top: 20px">
      <h2>📖 选型建议</h2>
      <div class="tip-box tip-box--key">
        <strong>loading="lazy" vs IntersectionObserver</strong><br />
        • <code>loading="lazy"</code>：首选，零 JS，Chrome 77+ / Safari 15.4+<br />
        • 共享 Observer：精确控制 rootMargin、占位图、加载动画<br />
        • LCP 关键图片必须用 <code>loading="eager"</code>，不要懒加载！
      </div>
      <div class="tip-box tip-box--info">
        <strong>共享 Observer 实现</strong>
        见 <code>src/composables/useSharedLazyObserver.ts</code> — 所有 LazyImage 共用一个
        IntersectionObserver 实例，减少内存开销。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LazyImage from '@/components/LazyImage.vue'

const IMAGES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  url: `https://picsum.photos/seed/perf${i}/200/120`,
  alt: `示例图片 ${i + 1}`,
}))

const observerLoaded = ref(0)
</script>

<style scoped lang="scss">
.img-grid {
  max-height: 280px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.img-thumb {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  background: var(--color-bg);
}

.img-cell {
  position: relative;
  height: 80px;
  background: var(--color-bg);
  border-radius: 4px;
  overflow: hidden;
}

.lab-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0 0 8px;
}
</style>
