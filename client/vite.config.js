import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "dist",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve("./src/components"),
      "@scss": path.resolve("./src/scss"),
      "@services": path.resolve("./src/services"),
      "@utils": path.resolve("./src/utils"),
      "@images": "/server/public/images",
    },
  },
});
