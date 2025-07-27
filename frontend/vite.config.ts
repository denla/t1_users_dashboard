import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@entities": path.resolve(__dirname, "./entities"),
      "@features": path.resolve(__dirname, "./features"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@pages": path.resolve(__dirname, "./pages"),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
