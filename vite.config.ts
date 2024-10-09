// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // base: "/GamtiWatch/",
  server: {
    open: true,
    port: 3000,
  },
  plugins: [react()],
  build: {
    target: "esnext", // ESNext로 설정
  },
});
