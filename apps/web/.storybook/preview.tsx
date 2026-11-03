import type { Preview } from "@storybook/nextjs-vite";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: { nextjs: { appDirectory: true }, layout: "padded" },
  decorators: [
    (Story, context) =>
      context.parameters.layout === "fullscreen" ? (
        <Story />
      ) : (
        <div className="mx-auto w-full max-w-screen-sm">
          <Story />
        </div>
      ),
  ],
  tags: ["autodocs"],
};
export default preview;
