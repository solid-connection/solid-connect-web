import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import ProfileWithBadge from "./ProfileWithBadge";

const meta = { title: "Common/Profile", component: ProfileWithBadge, args: { profileImageUrl: null } } satisfies Meta<
  typeof ProfileWithBadge
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Mentee: Story = {
  play: async ({ canvasElement }) => {
    const image = within(canvasElement).getByRole("img", { name: "프로필 이미지" }) as HTMLImageElement;
    await waitFor(() => expect(image.naturalWidth).toBeGreaterThan(0));
  },
};
export const Mentor: Story = { args: { isMentor: true } };
export const ChatSize: Story = { args: { isMentor: true, width: 32, height: 32 } };
