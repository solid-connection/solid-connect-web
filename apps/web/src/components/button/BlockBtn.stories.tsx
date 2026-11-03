import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import BlockBtn from "./BlockBtn";

const meta = {
  title: "Common/BlockBtn",
  component: BlockBtn,
  args: { children: "다음으로", onClick: fn() },
} satisfies Meta<typeof BlockBtn>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "다음으로" }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
export const Secondary: Story = { args: { variant: "secondary", children: "저장하기" } };
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole("button");
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
