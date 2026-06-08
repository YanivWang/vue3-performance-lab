// vite.config.js
import { defineConfig } from "file:///sessions/cool-jolly-fermi/mnt/performance-optimization/node_modules/vite/dist/node/index.js";
import vue from "file:///sessions/cool-jolly-fermi/mnt/performance-optimization/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { visualizer } from "file:///sessions/cool-jolly-fermi/mnt/performance-optimization/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    // 运行 npm run build:analyze 时生成 bundle 体积分析报告
    process.env.ANALYZE && visualizer({
      open: true,
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  build: {
    // 手动分包：让 Lighthouse / Network 面板能看出懒加载效果
    rollupOptions: {
      output: {
        manualChunks: {
          "vue-vendor": ["vue", "vue-router"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvY29vbC1qb2xseS1mZXJtaS9tbnQvcGVyZm9ybWFuY2Utb3B0aW1pemF0aW9uXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvc2Vzc2lvbnMvY29vbC1qb2xseS1mZXJtaS9tbnQvcGVyZm9ybWFuY2Utb3B0aW1pemF0aW9uL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9zZXNzaW9ucy9jb29sLWpvbGx5LWZlcm1pL21udC9wZXJmb3JtYW5jZS1vcHRpbWl6YXRpb24vdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgLy8gXHU4RkQwXHU4ODRDIG5wbSBydW4gYnVpbGQ6YW5hbHl6ZSBcdTY1RjZcdTc1MUZcdTYyMTAgYnVuZGxlIFx1NEY1M1x1NzlFRlx1NTIwNlx1Njc5MFx1NjJBNVx1NTQ0QVxuICAgIHByb2Nlc3MuZW52LkFOQUxZWkUgJiYgdmlzdWFsaXplcih7XG4gICAgICBvcGVuOiB0cnVlLFxuICAgICAgZmlsZW5hbWU6ICdkaXN0L3N0YXRzLmh0bWwnLFxuICAgICAgZ3ppcFNpemU6IHRydWUsXG4gICAgICBicm90bGlTaXplOiB0cnVlLFxuICAgIH0pLFxuICBdLmZpbHRlcihCb29sZWFuKSxcblxuICBidWlsZDoge1xuICAgIC8vIFx1NjI0Qlx1NTJBOFx1NTIwNlx1NTMwNVx1RkYxQVx1OEJBOSBMaWdodGhvdXNlIC8gTmV0d29yayBcdTk3NjJcdTY3N0ZcdTgwRkRcdTc3MEJcdTUxRkFcdTYxRDJcdTUyQTBcdThGN0RcdTY1NDhcdTY3OUNcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgJ3Z1ZS12ZW5kb3InOiBbJ3Z1ZScsICd2dWUtcm91dGVyJ10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1VixTQUFTLG9CQUFvQjtBQUNwWCxPQUFPLFNBQVM7QUFDaEIsU0FBUyxrQkFBa0I7QUFFM0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBO0FBQUEsSUFFSixRQUFRLElBQUksV0FBVyxXQUFXO0FBQUEsTUFDaEMsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLE1BQ1YsVUFBVTtBQUFBLE1BQ1YsWUFBWTtBQUFBLElBQ2QsQ0FBQztBQUFBLEVBQ0gsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUVoQixPQUFPO0FBQUE7QUFBQSxJQUVMLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLGNBQWMsQ0FBQyxPQUFPLFlBQVk7QUFBQSxRQUNwQztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
