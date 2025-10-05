import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("jspdf")) return "vendor_jspdf";
            if (id.includes("jspdf-autotable")) return "vendor_jspdf_autotable";
            if (id.includes("html2canvas")) return "vendor_html2canvas";
            if (id.includes("dayjs")) return "vendor_dayjs";
            // fallback: place other node_modules into vendor
            return "vendor";
          }
        },
      },
    },
  },
});
