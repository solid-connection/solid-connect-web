import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import vinext from "vinext";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
		tsconfigPaths: true,
	},
	plugins: [vinext(), tailwindcss()],
});

export default config;
