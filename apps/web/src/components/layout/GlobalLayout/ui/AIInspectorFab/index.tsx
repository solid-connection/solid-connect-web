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
  const { serverRole, clientRole, setClientRole, isInitialized, accessToken } = useAuthStore();
  const isAdmin = isInitialized && serverRole === UserRole.ADMIN;

  const { isInspecting, setIsInspecting, hoverRect, selection, clearSelection, resetInspector } =
    useAiInspectorSelection({ isEnabled: isAdmin });
  const [instruction, setInstruction] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isAdmin) {
    return null;
  }

  const resetForm = () => {
    setInstruction("");
    resetInspector();
  };

  const handleToggleInspector = () => {
    setIsInspecting((prev) => !prev);
    clearSelection();
    setInstruction("");
  };

  const handleSwitchToMentorView = () => {
    setClientRole(UserRole.MENTOR);
    toast.success("멘토 UI 보기로 전환되었습니다.");
  };

  const handleSwitchToMenteeView = () => {
    setClientRole(UserRole.MENTEE);
    toast.success("멘티 UI 보기로 전환되었습니다.");
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

        {isMenuOpen && (
          <div className="w-56 rounded-xl border border-k-100 bg-white p-3 shadow-2xl">
            <button
              type="button"
              onClick={handleToggleInspector}
              className={`w-full rounded-md px-3 py-2 text-left typo-medium-4 transition ${
                isInspecting ? "bg-secondary-50 text-secondary-800" : "bg-k-50 text-k-700 hover:bg-k-100"
              }`}
            >
              {isInspecting ? "인스펙터 끄기" : "인스펙터 켜기"}
            </button>

            <div className="mt-3 text-k-500 typo-medium-4">뷰 전환</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSwitchToMentorView}
                className={`rounded-md px-2 py-2 typo-medium-4 transition ${
                  clientRole === UserRole.MENTOR
                    ? "bg-primary text-white"
                    : "border border-k-200 bg-white text-k-700 hover:bg-k-50"
                }`}
              >
                멘토 UI
              </button>
              <button
                type="button"
                onClick={handleSwitchToMenteeView}
                className={`rounded-md px-2 py-2 typo-medium-4 transition ${
                  clientRole === UserRole.MENTEE
                    ? "bg-primary text-white"
                    : "border border-k-200 bg-white text-k-700 hover:bg-k-50"
                }`}
              >
                멘티 UI
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setIsMenuOpen((prev) => !prev);
          }}
          className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition ${
            isMenuOpen ? "bg-secondary hover:bg-secondary-800" : "bg-primary hover:bg-primary-1"
          }`}
          aria-label="관리자 메뉴"
        >
          {isMenuOpen ? <X size={20} /> : isInspecting ? <Target size={20} /> : <Bot size={20} />}
        </button>
      </div>
    </>
  );
};

export default AIInspectorFab;
