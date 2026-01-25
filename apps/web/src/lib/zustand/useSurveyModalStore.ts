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
    try {
      localStorage.setItem(SURVEY_MODAL_STORAGE_KEY, weekLater.toString());
    } catch (error) {
      console.warn("Failed to save survey modal hide preference:", error);
      // 로컬스토리지 저장 실패해도 모달은 닫기
    }
    set({ isOpen: false });
  },

  checkAndOpen: () => {
    if (typeof window === "undefined") return;

    // 현재 페이지가 로그인 페이지인지 확인
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes("/login") || currentPath.includes("/sign-up");

    // 로그인 페이지에서는 모달을 표시하지 않음
    if (isLoginPage) return;

    // 10월 31일까지만 모달 표시 (2025년 10월 31일 23:59:59)
    const surveyEndDate = new Date("2025-10-31T23:59:59").getTime();
    if (Date.now() > surveyEndDate) {
      return; // 설문 기간이 지났으면 모달 표시 안 함
    }

    let hideUntil: string | null = null;
    try {
      hideUntil = localStorage.getItem(SURVEY_MODAL_STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to read survey modal hide preference:", error);
      // 로컬스토리지 읽기 실패 시 모달 표시
      set({ isOpen: true });
      return;
    }

    // 저장된 값 검증
    if (hideUntil) {
      const hideTimestamp = Number(hideUntil);
      if (Number.isNaN(hideTimestamp) || hideTimestamp <= 0) {
        // 잘못된 값인 경우 저장된 키 제거
        try {
          localStorage.removeItem(SURVEY_MODAL_STORAGE_KEY);
        } catch (error) {
          console.warn("Failed to remove invalid survey modal preference:", error);
        }
        set({ isOpen: true });
        return;
      }

      // 저장된 시간이 현재 시간보다 이후면 모달 숨김
      if (Date.now() <= hideTimestamp) {
        return; // 모달 표시 안 함
      }
    }

    // 저장된 시간이 없거나, 현재 시간이 저장된 시간보다 이후면 모달 표시
    set({ isOpen: true });
  },
}));
