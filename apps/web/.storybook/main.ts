import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";
import svgr from "vite-plugin-svgr";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-vitest"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {
      nextConfigPath: fileURLToPath(new URL("./next.config.mjs", import.meta.url)),
      image: { excludeFiles: ["**/*.svg"] },
    },
  },
  viteFinal: async (config) => ({
    ...config,
    // Static files are served by staticDirs. Icon source modules must remain importable.
    publicDir: false,
    plugins: [...(config.plugins ?? []), svgr({ include: "**/*.svg", svgrOptions: { exportType: "default" } })],
  }),
  staticDirs: ["../public"],
};
export default config;
