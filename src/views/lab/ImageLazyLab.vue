<template>
  <div>
    <div class="lab-card">
      <h2>🖼️ 实验室 7：图片懒加载</h2>
      <p>
        视口外的图片不立即加载，用 <code>IntersectionObserver</code> 监听元素进入视口再赋值 <code>src</code>。
        减少首屏请求数，提升 LCP。
      </p>
      <div class="tip-box tip-box--info">
        <strong>👀 DevTools 怎么看</strong>
        Network 面板 → 过滤 Img → 打开页面时只有前几张发请求 →
        滚动页面 → 进入视口时才发新的图片请求（可看到 Waterfall 时间分布）。
      </div>
    </div>

    <div class="compare-grid">
      <div class="compare-box compare-box--bad">
        <div class="compare-box__header">❌ 直接 src —— 页面加载时全部请求</div>
        <div class="compare-box__body">
          <div class="code-snippet"><span class="cmt">// ❌ 全部图片立即请求（哪怕在屏幕外）</span>
&lt;img :src=<span class="str">"item.url"</span> /&gt;</div>
          <p style="font-size:13px;color:var(--color-text-muted)">
            下方 {{ IMAGES.length }} 张图，页面一打开全部发请求（请看 Network 面板）
          </p>
          <div style="max-height:300px;overflow-y:auto;display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:8px;border:1px solid var(--color-border);border-radius:6px">
            <img
              v-for="img in IMAGES"
              :key="img.id"
              :src="img.url"
              :alt="img.alt"
              style="width:100%;height:80px;object-fit:cover;border-radius:4px;background:var(--color-bg)"
            />
          </div>
        </div>
      </div>

      <div class="compare-box compare-box--good">
        <div class="compare-box__header">✅ IntersectionObserver 懒加载</div>
        <div class="compare-box__body">
          <div class="code-snippet"><span class="cmt">// ✅ 进入视口时才赋值 src</span>
<span class="kw">const</span> observer = <span class="kw">new</span> <span class="fn">IntersectionObserver</span>((entries) => {
  entries.<span class="fn">forEach</span>(entry => {
    <span class="kw">if</span> (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src
      observer.<span class="fn">unobserve</span>(entry.target)
    }
  })
})</div>
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-item__label">已加载图片</div>
              <div class="metric-item__value" style="color:var(--color-success)">{{ loadedCount }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-item__label">未加载</div>
              <div class="metric-item__value">{{ IMAGES.length - loadedCount }}</div>
            </div>
          </div>
          <div style="max-height:300px;overflow-y:auto;display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:8px;border:1px solid var(--color-border);border-radius:6px">
            <div
              v-for="img in IMAGES"
              :key="img.id"
              style="position:relative;height:80px;background:var(--color-bg);border-radius:4px;overflow:hidden"
            >
              <LazyImage :src="img.url" :alt="img.alt" @loaded="loadedCount++" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 原生 loading="lazy" -->
    <div class="lab-card" style="margin-top:20px">
      <h2>🆕 现代浏览器原生懒加载</h2>
      <div class="code-snippet"><span class="cmt">// 浏览器原生支持，一个属性搞定</span>
&lt;img src=<span class="str">"..."</span> loading=<span class="str">"lazy"</span> /&gt;</div>
      <div class="tip-box tip-box--key">
        <strong>loading="lazy" vs IntersectionObserver</strong>
        <br>• <code>loading="lazy"</code>：浏览器原生，零 JS，推荐首选。兼容 Chrome 77+、Firefox 75+、Safari 15.4+。
        <br>• IntersectionObserver：需要 JS，但可以精确控制触发时机、添加过渡动画、做占位图。
        <br>• 首屏关键图片（LCP 元素）必须用 <code>loading="eager"</code>（默认值），不要懒加载！
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineComponent, h, onMounted, onUnmounted } from 'vue'

// 用 picsum 生成不同尺寸图片（每张 id 不同保证不走缓存）
const IMAGES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  url: `https://picsum.photos/seed/perf${i}/200/120`,
  alt: `示例图片 ${i + 1}`,
}))

const loadedCount = ref(0)

// 懒加载图片组件
const LazyImage = defineComponent({
  props: { src: String, alt: String },
  emits: ['loaded'],
  setup(props, { emit }) {
    const imgRef = ref(null)
    const loaded = ref(false)

    onMounted(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && imgRef.value) {
            imgRef.value.src = props.src
            imgRef.value.onload = () => {
              loaded.value = true
              emit('loaded')
            }
            observer.unobserve(entry.target)
          }
        })
      }, { rootMargin: '50px' })

      if (imgRef.value) observer.observe(imgRef.value)

      onUnmounted(() => observer.disconnect())
    })

    return () => h('div', { style: 'width:100%;height:100%;position:relative' }, [
      !loaded.value && h('div', {
        style: 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--color-text-muted)'
      }, '等待加载…'),
      h('img', {
        ref: imgRef,
        alt: props.alt,
        style: `width:100%;height:100%;object-fit:cover;transition:opacity .3s;opacity:${loaded.value ? 1 : 0}`,
      })
    ])
  }
})
</script>
