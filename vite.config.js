import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Only enable devtools plugin in development mode. Some devtools
  // packages access browser-only globals (localStorage) which break
  // the build on Node environments (CI / Render). Guarding by mode
  // avoids the "Cannot initialize local storage" error during build.
  const plugins = [vue()]
  if (mode === 'development') {
    plugins.push(vueDevTools())
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})
