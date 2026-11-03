import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import ChatInputBar from "./index";

const meta = {
  title: "Chat/Composer",
  component: ChatInputBar,
  args: { onSendText: fn(async () => true), onSendImages: fn(async () => true) },
} satisfies Meta<typeof ChatInputBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Ready: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "메시지 보내기" })).toBeDisabled();
    await userEvent.type(canvas.getByRole("textbox", { name: "메시지" }), "교환학생 준비가 궁금해요");
    await userEvent.click(canvas.getByRole("button", { name: "메시지 보내기" }));
    await expect(args.onSendText).toHaveBeenCalledWith("교환학생 준비가 궁금해요");
    await expect(canvas.getByRole("textbox")).toHaveValue("");
  },
};
export const Offline: Story = {
  args: { canSend: false },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox"), "연결되면 보낼 초안");
    await expect(canvas.getByRole("textbox")).toHaveValue("연결되면 보낼 초안");
    await expect(canvas.getByRole("button", { name: "메시지 보내기" })).toBeDisabled();
    await expect(args.onSendText).not.toHaveBeenCalled();
  },
};
export const AccessDenied: Story = { args: { disabled: true, canSend: false } };
export const SendFailure: Story = {
  args: { onSendText: fn(async () => false) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox"), "다시 보낼 메시지");
    await userEvent.click(canvas.getByRole("button", { name: "메시지 보내기" }));
    await expect(canvas.getByRole("alert")).toBeVisible();
    await expect(canvas.getByRole("textbox")).toHaveValue("다시 보낼 메시지");
  },
};
export const ImageSelection: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox"), "이미지와 별도로 남길 초안");
    const file = new File(["image"], "campus.png", { type: "image/png" });
    await userEvent.upload(canvas.getByLabelText("채팅 이미지 선택"), file);
    await expect(canvas.getByRole("list", { name: "선택한 이미지" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "이미지 1장 보내기" }));
    await expect(args.onSendImages).toHaveBeenCalledWith([file]);
    await expect(canvas.getByRole("textbox")).toHaveValue("이미지와 별도로 남길 초안");
    await expect(canvas.queryByRole("list", { name: "선택한 이미지" })).not.toBeInTheDocument();
  },
};

export const ImageUploadFailure: Story = {
  args: { onSendImages: fn(async () => false) },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox"), "업로드 실패에도 남길 초안");
    const file = new File(['<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>'], "campus.svg", {
      type: "image/svg+xml",
    });
    await userEvent.upload(canvas.getByLabelText("채팅 이미지 선택"), file);
    await userEvent.click(canvas.getByRole("button", { name: "이미지 1장 보내기" }));
    await expect(args.onSendImages).toHaveBeenCalledWith([file]);
    await expect(canvas.getByRole("alert")).toBeVisible();
    await expect(canvas.getByRole("list", { name: "선택한 이미지" })).toBeVisible();
    await expect(canvas.getByRole("textbox")).toHaveValue("업로드 실패에도 남길 초안");
  },
};

export const Uploading: Story = {
  args: { onSendText: fn(() => new Promise<boolean>(() => {})) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox"), "전송 중에는 중복 입력을 막아요");
    await userEvent.click(canvas.getByRole("button", { name: "메시지 보내기" }));
    await expect(canvas.getByRole("form")).toHaveAttribute("aria-busy", "true");
    await expect(canvas.getByRole("textbox")).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "메시지 보내기" })).toBeDisabled();
  },
};
