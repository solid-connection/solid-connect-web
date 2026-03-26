"use client";

import {
  AiInspectorRequestError,
  createAiInspectorRequest,
  useAiInspectorSelection,
} from "@solid-connect/ai-inspector";
import { Bot, Target, X } from "lucide-react";
import { useState } from "react";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";
import { UserRole } from "@/types/mentor";

const AIInspectorFab = () => {
  const { userRole, isInitialized, accessToken } = useAuthStore();
  const isAdmin = isInitialized && userRole === UserRole.ADMIN;

  const { isInspecting, setIsInspecting, hoverRect, selection, clearSelection, resetInspector } =
    useAiInspectorSelection({ isEnabled: isAdmin });
  const [instruction, setInstruction] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!isAdmin) {
    return null;
  }

  const resetForm = () => {
    setInstruction("");
    resetInspector();
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
      const result = await createAiInspectorRequest({
        accessToken,
        payload: {
          instruction: instruction.trim(),
          pageUrl: window.location.href,
          selection,
        },
      });

      toast.success(`요청이 저장되었습니다. (${result.taskId.slice(0, 8)})`);
      resetForm();
    } catch (error) {
      if (error instanceof AiInspectorRequestError) {
        toast.error(error.message);
      } else {
        toast.error("요청 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
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
            clearSelection();
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
