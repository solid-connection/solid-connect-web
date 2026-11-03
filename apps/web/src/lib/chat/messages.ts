import type { ChatMessage } from "@/types/chat";

export const getMessageKey = (message: ChatMessage): string => {
  if (message.id > 0) return `id:${message.id}`;

  return `message:${JSON.stringify([
    message.senderId,
    message.createdAt,
    message.content,
    message.attachments.map((attachment) => [
      attachment.id,
      attachment.isImage,
      attachment.url,
      attachment.thumbnailUrl,
      attachment.createdAt,
    ]),
  ])}`;
};

export const mergeMessages = (existing: readonly ChatMessage[], incoming: readonly ChatMessage[]): ChatMessage[] => {
  const messagesByKey = new Map<string, ChatMessage>();

  for (const message of existing) messagesByKey.set(getMessageKey(message), message);
  for (const message of incoming) messagesByKey.set(getMessageKey(message), message);

  return [...messagesByKey.values()].sort((first, second) => {
    const timeDifference = Date.parse(first.createdAt) - Date.parse(second.createdAt);
    if (timeDifference !== 0) return timeDifference;

    const idDifference = first.id - second.id;
    if (idDifference !== 0) return idDifference;

    return getMessageKey(first).localeCompare(getMessageKey(second));
  });
};
