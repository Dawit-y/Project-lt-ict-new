import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());

	return {
		plugins: [react()],
		server: {
			proxy: {
				"/api": {
					target: env.VITE_BASE_API_FILE,
					changeOrigin: true,
					secure: false,
					configure: (proxy) => {
						proxy.on("proxyReq", (proxyReq) => {
							proxyReq.setHeader("origin", env.VITE_BASE_API_FILE);
						});
					},
				},
			},
		},
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	};
});
