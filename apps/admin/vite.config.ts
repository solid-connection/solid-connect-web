import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import vinext from "vinext";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const isVinext = process.env.VINEXT === "true";

const config = defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	plugins: [
		isVinext && vinext(),
		!isVinext && devtools(),
		!isVinext && nitro(),
		// this is the plugin that enables path aliases
		viteTsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tailwindcss(),
		!isVinext && tanstackStart(),
		!isVinext && viteReact(),
	].filter(Boolean),
});

export default config;
