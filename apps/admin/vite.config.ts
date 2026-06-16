import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import vinext from "vinext";
import { defineConfig } from "vite";

const vinextNavShim = fileURLToPath(new URL("node_modules/vinext/dist/shims/navigation.js", import.meta.url));

const config = defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"next/navigation": vinextNavShim,
			"next/navigation.js": vinextNavShim,
		},
		tsconfigPaths: true,
	},
	plugins: [vinext(), tailwindcss(), nitro({ preset: "vercel", vercel: { functions: { runtime: "nodejs22.x" } } })],
});

export default config;
