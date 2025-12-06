import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: env.FRONT_PORT,
      strictPort: true,

      proxy: {
        "/api": {
          target: env.VITE_BASE_PROXY,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: { "*": "" },
          rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      include: ["exceljs"],
    },
  };
});