"use client";

import { Bot, Target, X } from "lucide-react";
import { useEffect, useState } from "react";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";
import { UserRole } from "@/types/mentor";

interface HoverRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ElementSelection {
  selector: string;
  tagName: string;
  className: string;
  textSnippet: string;
  rect: HoverRect;
}

const toTextSnippet = (target: HTMLElement): string => {
  const text = (target.innerText || target.textContent || "").replace(/\s+/g, " ").trim();
  return text.slice(0, 140);
};

const toClassName = (target: HTMLElement): string => {
  if (typeof target.className === "string") {
    return target.className;
  }

  return target.getAttribute("class") ?? "";
};

const toSelector = (target: HTMLElement): string => {
  if (target.id) {
    return `#${target.id}`;
  }

  const segments: string[] = [];
  let current: HTMLElement | null = target;
  let depth = 0;

  while (current && depth < 6) {
    const parent = current.parentElement;
    const tag = current.tagName.toLowerCase();

    if (!parent) {
      segments.unshift(tag);
      break;
    }

    const sameTagSiblings = Array.from(parent.children).filter(
      (child) => (child as Element).tagName.toLowerCase() === tag,
    );
    const index = sameTagSiblings.indexOf(current) + 1;
    segments.unshift(`${tag}:nth-of-type(${index})`);

    current = parent;
    depth += 1;
  }

  return segments.join(" > ");
};

const AIInspectorFab = () => {
  const { userRole, isInitialized, accessToken } = useAuthStore();
  const isAdmin = isInitialized && userRole === UserRole.ADMIN;

  const [isInspecting, setIsInspecting] = useState(false);
  const [hoverRect, setHoverRect] = useState<HoverRect | null>(null);
  const [selection, setSelection] = useState<ElementSelection | null>(null);
  const [instruction, setInstruction] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isInspecting) {
      setHoverRect(null);
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (target.closest("[data-ai-inspector-ui='true']")) {
        setHoverRect(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      setHoverRect({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (target.closest("[data-ai-inspector-ui='true']")) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const rect = target.getBoundingClientRect();
      setSelection({
        selector: toSelector(target),
        tagName: target.tagName.toLowerCase(),
        className: toClassName(target),
        textSnippet: toTextSnippet(target),
        rect: {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        },
      });
      setIsInspecting(false);
      setHoverRect(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsInspecting(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove, true);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove, true);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isInspecting]);

  if (!isAdmin) {
    return null;
  }

  const resetForm = () => {
    setSelection(null);
    setInstruction("");
    setHoverRect(null);
    setIsInspecting(false);
  };

  const handleSave = async () => {
    if (!selection) {
      toast.error("먼저 수정할 요소를 선택해주세요.");
      return;
    }

    if (!instruction.trim()) {
      toast.error("수정 요청 문구를 입력해주세요.");
      return;
    }

    if (!accessToken) {
      toast.error("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/ai-inspector-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          instruction: instruction.trim(),
          pageUrl: window.location.href,
          selection,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { message?: string; taskId?: string } | null;
      if (!response.ok) {
        toast.error(payload?.message ?? "요청 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      const taskId = payload?.taskId ?? "";
      toast.success(`요청이 저장되었습니다. (${taskId.slice(0, 8)})`);
      resetForm();
    } catch {
      toast.error("요청 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {isInspecting && hoverRect && (
        <div
          className="pointer-events-none fixed z-[90] rounded border-2 border-secondary bg-secondary/10"
          style={{
            left: hoverRect.x,
            top: hoverRect.y,
            width: hoverRect.width,
            height: hoverRect.height,
          }}
        />
      )}

      <div data-ai-inspector-ui="true" className="fixed bottom-20 left-4 z-[100] flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            setIsInspecting((prev) => !prev);
            setSelection(null);
            setInstruction("");
          }}
          className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition ${
            isInspecting ? "bg-secondary hover:bg-secondary-800" : "bg-primary hover:bg-primary-1"
          }`}
          aria-label="AI 인스펙터"
        >
          {isInspecting ? <Target size={20} /> : <Bot size={20} />}
        </button>

        {selection && (
          <div className="w-80 rounded-xl border border-k-100 bg-white p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-k-900 typo-sb-9">AI 인스펙터 요청</p>
              <button type="button" onClick={resetForm} className="text-k-400 hover:text-k-700" aria-label="닫기">
                <X size={16} />
              </button>
            </div>

            <div className="mb-2 rounded bg-k-50 p-2 text-k-600 typo-regular-4">
              <div>selector: {selection.selector}</div>
              <div>tag: {selection.tagName}</div>
              {selection.textSnippet && <div>text: {selection.textSnippet}</div>}
            </div>

            <textarea
              value={instruction}
              onChange={(event) => setInstruction(event.target.value)}
              rows={3}
              placeholder="예: padding을 2px에서 4px로 수정해주세요."
              className="w-full rounded border border-k-100 p-2 text-k-700 typo-regular-4 focus:border-primary focus:outline-none"
            />

            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="rounded border border-k-200 px-3 py-1.5 text-k-600 typo-medium-3"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="rounded bg-primary px-3 py-1.5 text-white typo-medium-3 disabled:opacity-60"
              >
                {isSaving ? "저장 중..." : "요청 저장"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AIInspectorFab;
