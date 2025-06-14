import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const API_URL = "http://196.188.182.83:1213";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": {
				target: API_URL,
				changeOrigin: true,
				secure: false,
				configure: (proxy) => {
					proxy.on("proxyReq", (proxyReq) => {
						proxyReq.setHeader("origin", API_URL);
					});
				},
			},
		},
	},
	esbuild: {
		jsxFactory: "h",
		jsxFragment: "Fragment",
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
