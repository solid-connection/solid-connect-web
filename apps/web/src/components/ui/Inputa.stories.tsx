import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { Input } from "./Inputa";

const meta = {
  title: "Common/Input",
  component: Input,
  args: { "aria-label": "닉네임", placeholder: "닉네임을 입력하세요" },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox", { name: "닉네임" });
    await userEvent.type(input, "예비 교환학생");
    await expect(input).toHaveValue("예비 교환학생");
  },
};
export const Gray: Story = { args: { variant: "gray" } };
export const Disabled: Story = { args: { disabled: true, value: "수정할 수 없는 닉네임" } };
