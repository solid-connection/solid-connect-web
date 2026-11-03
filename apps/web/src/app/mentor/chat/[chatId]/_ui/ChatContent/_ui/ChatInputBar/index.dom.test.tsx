// @vitest-environment jsdom
import { act, createEvent, fireEvent, render, screen } from "@testing-library/react/pure";
import { beforeEach, expect, it, vi } from "vitest";
import ChatInputBar from ".";

vi.mock("@/public/svgs/mentor", () => ({
  IconAlbum: () => <span />,
  IconDirectMessage: () => <span />,
}));

const createObjectURL = vi.fn<(file: Blob) => string>();
const revokeObjectURL = vi.fn<(url: string) => void>();

beforeEach(() => {
  createObjectURL.mockReset().mockImplementation(() => `blob:preview-${createObjectURL.mock.calls.length}`);
  revokeObjectURL.mockReset();
  vi.stubGlobal("URL", Object.assign(class extends URL {}, { createObjectURL, revokeObjectURL }));
});

const getMessage = () => screen.getByRole("textbox", { name: "메시지" }) as HTMLTextAreaElement;
const getForm = () => screen.getByRole("form", { name: "채팅 메시지 작성" });
const chooseImages = (files: File[]) =>
  fireEvent.change(screen.getByLabelText("채팅 이미지 선택"), { target: { files } });

it("does not publish whitespace through Enter or form submission", () => {
  const onSendText = vi.fn().mockResolvedValue(true);
  render(<ChatInputBar onSendText={onSendText} onSendImages={vi.fn().mockResolvedValue(true)} />);
  fireEvent.change(getMessage(), { target: { value: "  \n " } });
  fireEvent.keyDown(getMessage(), { key: "Enter" });
  fireEvent.submit(getForm());
  expect(onSendText).not.toHaveBeenCalled();
  expect(getMessage().value).toBe("  \n ");
});

it("keeps IME confirmation and Shift+Enter separate from sending", async () => {
  const onSendText = vi.fn().mockResolvedValue(true);
  render(<ChatInputBar onSendText={onSendText} onSendImages={vi.fn().mockResolvedValue(true)} />);
  fireEvent.change(getMessage(), { target: { value: "  안녕하세요\n반갑습니다  " } });
  fireEvent.compositionStart(getMessage());
  fireEvent.keyDown(getMessage(), { key: "Enter", isComposing: true });
  fireEvent.compositionEnd(getMessage());
  fireEvent.keyDown(getMessage(), { key: "Enter", keyCode: 229 });
  const lineBreak = createEvent.keyDown(getMessage(), { key: "Enter", shiftKey: true });
  fireEvent(getMessage(), lineBreak);
  expect(lineBreak.defaultPrevented).toBe(false);
  expect(onSendText).not.toHaveBeenCalled();

  await act(async () => {
    fireEvent.keyDown(getMessage(), { key: "Enter" });
  });
  expect(onSendText).toHaveBeenCalledExactlyOnceWith("안녕하세요\n반갑습니다");
  expect(getMessage().value).toBe("");
});

it("locks immediately while sending and preserves text after a refused send", async () => {
  let finishSend: (accepted: boolean) => void = () => {};
  const onSendText = vi.fn().mockImplementation(
    () =>
      new Promise<boolean>((resolve) => {
        finishSend = resolve;
      }),
  );
  render(<ChatInputBar onSendText={onSendText} onSendImages={vi.fn().mockResolvedValue(true)} />);
  fireEvent.change(getMessage(), { target: { value: "원래 메시지" } });

  act(() => {
    fireEvent.submit(getForm());
    fireEvent.submit(getForm());
    fireEvent.change(getMessage(), { target: { value: "요청 중 변경" } });
  });
  expect(onSendText).toHaveBeenCalledTimes(1);
  expect(getMessage().disabled).toBe(true);
  expect(getMessage().value).toBe("원래 메시지");

  await act(async () => {
    finishSend(false);
  });
  expect(getMessage().value).toBe("원래 메시지");
  expect(getMessage().disabled).toBe(false);
  expect(screen.getByRole("alert").textContent).toContain("입력 내용은 유지했어요");
});

it("keeps a thrown send draft and clears only after a later accepted send", async () => {
  const onSendText = vi.fn().mockRejectedValueOnce(new Error("failed")).mockResolvedValueOnce(true);
  render(<ChatInputBar onSendText={onSendText} onSendImages={vi.fn().mockResolvedValue(true)} />);
  fireEvent.change(getMessage(), { target: { value: "다시 보낼 내용" } });

  await act(async () => {
    fireEvent.submit(getForm());
  });
  expect(screen.getByRole("alert").textContent).toContain("입력 내용을 유지");
  expect(getMessage().value).toBe("다시 보낼 내용");

  await act(async () => {
    fireEvent.submit(getForm());
  });
  expect(getMessage().value).toBe("");
  expect(screen.queryByRole("alert")).toBeNull();
});

it("retains images and their stable previews on failure and releases them after success", async () => {
  const onSendImages = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  const onSendText = vi.fn().mockResolvedValue(true);
  const props = { onSendText, onSendImages };
  const { rerender, unmount } = render(<ChatInputBar {...props} />);
  fireEvent.change(getMessage(), { target: { value: "이미지 다음에 보낼 글" } });
  const first = new File(["first"], "first.png", { type: "image/png" });
  const second = new File(["second"], "second.jpg", { type: "image/jpeg" });
  chooseImages([first, second]);
  expect(createObjectURL).toHaveBeenCalledTimes(2);
  const firstPreview = screen.getByRole("img", { name: "first.png" }).getAttribute("src");

  rerender(<ChatInputBar {...props} disabled />);
  rerender(<ChatInputBar {...props} />);
  expect(createObjectURL).toHaveBeenCalledTimes(2);
  expect(screen.getByRole("img", { name: "first.png" }).getAttribute("src")).toBe(firstPreview);

  fireEvent.click(screen.getByRole("button", { name: "second.jpg 제거" }));
  expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith("blob:preview-2");
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "이미지 1장 보내기" }));
  });
  expect(onSendImages).toHaveBeenLastCalledWith([first]);
  expect(screen.getByRole("img", { name: "first.png" })).toBeTruthy();
  expect(revokeObjectURL).toHaveBeenCalledTimes(1);

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "이미지 1장 보내기" }));
  });
  expect(screen.queryByRole("list", { name: "선택한 이미지" })).toBeNull();
  expect(getMessage().value).toBe("이미지 다음에 보낼 글");
  expect(onSendText).not.toHaveBeenCalled();
  expect(revokeObjectURL).toHaveBeenCalledTimes(2);

  chooseImages([first]);
  unmount();
  expect(revokeObjectURL).toHaveBeenCalledTimes(3);
});

it("prevents duplicate image submissions and keeps selection immutable while uploading", async () => {
  let finishSend: (accepted: boolean) => void = () => {};
  const onSendImages = vi.fn().mockImplementation(
    () =>
      new Promise<boolean>((resolve) => {
        finishSend = resolve;
      }),
  );
  render(<ChatInputBar onSendText={vi.fn().mockResolvedValue(true)} onSendImages={onSendImages} />);
  const first = new File(["image"], "image.png", { type: "image/png" });
  chooseImages([first]);
  fireEvent.submit(getForm());
  fireEvent.submit(getForm());
  fireEvent.click(screen.getByRole("button", { name: "image.png 제거" }));
  chooseImages([new File(["other"], "other.png", { type: "image/png" })]);
  expect(onSendImages).toHaveBeenCalledExactlyOnceWith([first]);
  expect(screen.queryByRole("img", { name: "other.png" })).toBeNull();
  expect((screen.getByRole("button", { name: "image.png 제거" }) as HTMLButtonElement).disabled).toBe(true);

  await act(async () => {
    finishSend(false);
  });
  expect(screen.getByRole("img", { name: "image.png" })).toBeTruthy();
});

it("rejects non-image selection and never exposes a file-send action", () => {
  const onSendImages = vi.fn().mockResolvedValue(true);
  render(<ChatInputBar onSendText={vi.fn().mockResolvedValue(true)} onSendImages={onSendImages} />);
  chooseImages([new File(["pdf"], "document.pdf", { type: "application/pdf" })]);
  expect(screen.getByRole("alert").textContent).toBe("이미지만 보낼 수 있어요.");
  expect(screen.queryByRole("list", { name: "선택한 이미지" })).toBeNull();
  expect(onSendImages).not.toHaveBeenCalled();
});

it("keeps composing while disconnected and sends the same draft after reconnect", async () => {
  const props = { onSendText: vi.fn().mockResolvedValue(true), onSendImages: vi.fn().mockResolvedValue(true) };
  const { rerender } = render(<ChatInputBar {...props} canSend={false} />);
  fireEvent.change(getMessage(), { target: { value: "연결 복구 중 작성한 메시지" } });
  expect(getMessage().disabled).toBe(false);
  expect((screen.getByRole("button", { name: "메시지 보내기" }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.submit(getForm());
  expect(props.onSendText).not.toHaveBeenCalled();

  rerender(<ChatInputBar {...props} canSend />);
  expect(getMessage().value).toBe("연결 복구 중 작성한 메시지");
  await act(async () => {
    fireEvent.submit(getForm());
  });
  expect(props.onSendText).toHaveBeenCalledExactlyOnceWith("연결 복구 중 작성한 메시지");
  expect(getMessage().value).toBe("");
});
