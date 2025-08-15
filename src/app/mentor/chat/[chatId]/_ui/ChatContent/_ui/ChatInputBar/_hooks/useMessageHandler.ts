import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

// Zod 스키마 정의
const messageSchema = z.object({
  message: z.string().min(1, "메시지를 입력해주세요").trim(),
});

// 타입 정의
type MessageForm = z.infer<typeof messageSchema>;

type UseMessageHandlerProps = {
  onSendMessage: (data: { message: string }) => void;
};

const useMessageHandler = ({ onSendMessage }: UseMessageHandlerProps) => {
  // 텍스트 메시지용 폼
  const messageForm = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: "" },
  });

  const watchedMessage = messageForm.watch("message", "");
  const isMessageEmpty = !watchedMessage?.trim();

  const onSubmitMessage = (data: MessageForm) => {
    console.log("텍스트 메시지 전송:", data);
    onSendMessage({
      message: data.message,
    });
    messageForm.reset();
  };

  return {
    messageForm,
    onSubmitMessage,
    isMessageEmpty,
  };
};

export default useMessageHandler;
