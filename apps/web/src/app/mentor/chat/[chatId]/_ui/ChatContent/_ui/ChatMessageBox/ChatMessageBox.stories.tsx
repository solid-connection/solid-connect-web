import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ChatMessageBox from "./index";

const message = {
  id: 1,
  senderId: 202,
  content: "지원 서류는 미리 준비해두면 좋아요.\n궁금한 점을 알려주세요!",
  createdAt: "2026-10-01T12:00:00Z",
  attachments: [],
};
const meta = {
  title: "Chat/Message",
  component: ChatMessageBox,
  args: { message, currentUserId: 101, partnerNickname: "교환학생 멘토", isPartnerMentor: true },
} satisfies Meta<typeof ChatMessageBox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Received: Story = {};
export const Sent: Story = { args: { message: { ...message, senderId: 101 } } };
export const LongText: Story = {
  args: { message: { ...message, content: `https://example.test/${"longpath".repeat(40)}` } },
};
export const Image: Story = {
  args: {
    message: {
      ...message,
      content: "",
      attachments: [
        {
          id: 1,
          isImage: true,
          url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect width='200' height='150' fill='%23e2e8f0'/%3E%3C/svg%3E",
          thumbnailUrl: null,
          createdAt: message.createdAt,
        },
      ],
    },
  },
};
export const File: Story = {
  args: {
    message: {
      ...message,
      content: "준비 서류를 확인해주세요.",
      attachments: [
        { id: 2, isImage: false, url: "/preparation-guide.pdf", thumbnailUrl: null, createdAt: message.createdAt },
      ],
    },
  },
};
