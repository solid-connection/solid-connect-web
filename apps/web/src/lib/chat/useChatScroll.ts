"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types/chat";
import { getMessageKey } from "./messages";

interface ScrollOptions {
  messages: ChatMessage[];
  outgoingCount: number;
  isLoadingOlder: boolean;
  setReading(reading: boolean): void;
}

const BOTTOM_THRESHOLD_PX = 80;

export const useChatScroll = ({ messages, outgoingCount, isLoadingOlder, setReading }: ScrollOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);
  const initializedRef = useRef(false);
  const previousLastKeyRef = useRef<string | null>(null);
  const previousOutgoingCountRef = useRef(outgoingCount);
  const anchorRef = useRef<{ key: string; offset: number } | null>(null);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  const updateReading = useCallback(() => {
    setReading(document.visibilityState === "visible" && atBottomRef.current);
  }, [setReading]);

  const scrollToBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
    atBottomRef.current = true;
    setHasNewMessages(false);
    updateReading();
  }, [updateReading]);

  const onScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    atBottomRef.current = container.scrollHeight - container.scrollTop - container.clientHeight < BOTTOM_THRESHOLD_PX;
    if (atBottomRef.current) setHasNewMessages(false);
    updateReading();
  }, [updateReading]);

  const captureAnchor = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const top = container.getBoundingClientRect().top;
    const visible = Array.from(container.querySelectorAll<HTMLElement>("[data-message-key]")).find(
      (element) => element.getBoundingClientRect().bottom > top,
    );
    if (visible?.dataset.messageKey) {
      anchorRef.current = { key: visible.dataset.messageKey, offset: visible.getBoundingClientRect().top - top };
    }
  }, []);

  useLayoutEffect(
    function maintainMessagePosition() {
      const container = containerRef.current;
      if (!container) return;
      const lastKey = messages.length > 0 ? getMessageKey(messages[messages.length - 1]) : null;
      const newLastMessage = lastKey !== previousLastKeyRef.current;
      const hasNewOutgoing = outgoingCount > previousOutgoingCountRef.current;

      if (anchorRef.current) {
        const anchor = anchorRef.current;
        const element = Array.from(container.querySelectorAll<HTMLElement>("[data-message-key]")).find(
          (item) => item.dataset.messageKey === anchor.key,
        );
        if (element)
          container.scrollTop +=
            element.getBoundingClientRect().top - container.getBoundingClientRect().top - anchor.offset;
        if (!isLoadingOlder) anchorRef.current = null;
      } else if ((!initializedRef.current && messages.length > 0) || hasNewOutgoing || atBottomRef.current) {
        scrollToBottom();
      } else if (newLastMessage) {
        setHasNewMessages(true);
      }

      if (messages.length > 0) initializedRef.current = true;
      previousLastKeyRef.current = lastKey;
      previousOutgoingCountRef.current = outgoingCount;
    },
    [isLoadingOlder, messages, outgoingCount, scrollToBottom],
  );

  useEffect(
    function observeMessageSize() {
      const content = contentRef.current;
      if (!content) return;
      // Image layout changes should keep the bottom pinned only while the reader is already there.
      const observer = new ResizeObserver(() => {
        if (atBottomRef.current && !anchorRef.current) scrollToBottom();
      });
      observer.observe(content);
      document.addEventListener("visibilitychange", updateReading);
      updateReading();
      return function disconnectMessageSizeObserver() {
        observer.disconnect();
        document.removeEventListener("visibilitychange", updateReading);
        setReading(false);
      };
    },
    [scrollToBottom, setReading, updateReading],
  );

  return { containerRef, contentRef, onScroll, captureAnchor, scrollToBottom, hasNewMessages };
};
