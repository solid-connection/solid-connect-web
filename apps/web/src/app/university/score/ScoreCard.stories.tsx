import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScoreSubmitStatus } from "@/types/score";
import ScoreCard from "./ScoreCard";

const meta = {
  title: "Scores/ScoreCard",
  component: ScoreCard,
  args: { name: "TOEFL iBT", score: "100", date: "2026-10-01T00:00:00Z", status: ScoreSubmitStatus.APPROVED },
} satisfies Meta<typeof ScoreCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Approved: Story = { args: { isFocused: true } };
export const Pending: Story = { args: { status: ScoreSubmitStatus.PENDING } };
export const Rejected: Story = { args: { status: ScoreSubmitStatus.REJECTED } };
export const Gpa: Story = { args: { name: "인하대학교", score: "4.00/4.5" } };
