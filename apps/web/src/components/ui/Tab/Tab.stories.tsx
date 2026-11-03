import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import Tab from "./index";

const meta = {
  title: "Common/Tab",
  component: Tab,
  args: { choices: ["공인어학", "학점"], choice: "공인어학", setChoice: fn() },
} satisfies Meta<typeof Tab>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = {
  render: function InteractiveTab(args) {
    const [choice, setChoice] = useState(args.choice);
    return (
      <>
        <Tab {...args} choice={choice} setChoice={setChoice} />
        <p role="status">선택한 탭: {choice}</p>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "학점" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("선택한 탭: 학점");
  },
};
