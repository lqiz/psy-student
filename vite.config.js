import {
  fileURLToPath,
  URL
} from 'node:url'

import {
  defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import postCssPxToRem from 'postcss-pxtorem'


const px2remOptions = {
  // unitPrecision: 5,
  rootValue: 16,
  propList: ['*']
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  base: '/student/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src',
        import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [
        postCssPxToRem(px2remOptions)
      ]
    }
  },
  server: {
    host: "0.0.0.0",
    port: "9090",
    proxy: {
      "/api": {
        target: "http://101.42.5.118:8900/",
        secure: false,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: './student',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
        // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
        // entryFileNames: "js/[name].[hash].js",
        // 用于命名代码拆分时创建的共享块的输出命名
        // chunkFileNames: "js/[name].[hash].js",
        // 用于输出静态资源的命名，[ext]表示文件扩展名
        // assetFileNames: "[ext]/[name].[hash].[ext]",
      }
    }
  }
})