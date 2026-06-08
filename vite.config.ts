import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: `@use "@/styles/variables" as *;`,
      },
    },
  },

  plugins: [
    vue(),
    // 运行 npm run build:analyze 时生成 bundle 体积分析报告
    ...(process.env.ANALYZE
      ? [
          visualizer({
            open: true,
            filename: 'dist/stats.html',
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          echarts: ['echarts'],
        },
      },
    },
  },
})
