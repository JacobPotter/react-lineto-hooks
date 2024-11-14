import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css"; // https://vite.dev/config/
import tailwindcss from "tailwindcss"; // https://vite.dev/config/

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      include: ["lib"],
      rollupTypes: true,
      tsconfigPath: "./tsconfig.lib.json",
    }),
  ],

  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/main.tsx"),
      fileName: "main",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
});
