import { create } from "zustand";

const SURVEY_MODAL_STORAGE_KEY = "surveyModal_hideUntil";

interface SurveyModalState {
  /** 모달 표시 여부 */
  isOpen: boolean;

  /* -------- actions -------- */
  /** 모달 열기 (로컬스토리지 확인 후) */
  open: () => void;
  /** 모달 닫기 */
  close: () => void;
  /** 일주일간 보지 않기 */
  closeForWeek: () => void;
  /** 초기화 시 자동으로 모달 표시 여부 확인 */
  checkAndOpen: () => void;
}

export const useSurveyModalStore = create<SurveyModalState>((set) => ({
  isOpen: false,

  open: () => {
    set({ isOpen: true });
  },

  close: () => {
    set({ isOpen: false });
  },

  closeForWeek: () => {
    // 7일 후 타임스탬프 저장
    const weekLater = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(SURVEY_MODAL_STORAGE_KEY, weekLater.toString());
    set({ isOpen: false });
  },

  checkAndOpen: () => {
    if (typeof window === "undefined") return;

    // 현재 페이지가 로그인 페이지인지 확인
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes("/login") || currentPath.includes("/sign-up");

    // 로그인 페이지에서는 모달을 표시하지 않음
    if (isLoginPage) return;

    const hideUntil = localStorage.getItem(SURVEY_MODAL_STORAGE_KEY);

    // 저장된 시간이 없거나, 현재 시간이 저장된 시간보다 이후면 모달 표시
    if (!hideUntil || Date.now() > parseInt(hideUntil, 10)) {
      set({ isOpen: true });
    }
  },
}));
