import { defineConfig } from "electron-vite";
import { resolve } from "path";
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  main: {
    root: ".",
    resolve: {
      alias: [
        { find: "@components", replacement: resolve(__dirname, "src/ui/components") },
        { find: "@styles", replacement: resolve(__dirname, "src/ui/styles") },
        { find: "@utils", replacement: resolve(__dirname, "src/utils") },
        { find: "@jizo", replacement: resolve(__dirname, "src/electron/api") },
      ],
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "./src/electron/main/index.ts"),
        },
      },
    },
  },
  preload: {
    root: ".",
    resolve: {
      alias: [
        { find: "@components", replacement: resolve(__dirname, "src/ui/components") },
        { find: "@styles", replacement: resolve(__dirname, "src/ui/styles") },
        { find: "@utils", replacement: resolve(__dirname, "src/utils") },
        { find: "@jizo", replacement: resolve(__dirname, "src/electron/api") },
      ],
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "./src/electron/preload/index.ts"),
        },
      },
    },
  },
  renderer: {
    root: ".",
    resolve: {
      alias: [
        { find: "@components", replacement: resolve(__dirname, "src/ui/components") },
        { find: "@styles", replacement: resolve(__dirname, "src/ui/styles") },
        { find: "@utils", replacement: resolve(__dirname, "src/utils") },
        { find: "@jizo", replacement: resolve(__dirname, "src/electron/api") },
      ],
    },
    build: {
      emptyOutDir: true,
      manifest: true,
      rollupOptions: {
        input: {
          index: resolve(__dirname, "./index.html")
        },
      },
    },
    css: {
      devSourcemap: true,
    }
  },
});
