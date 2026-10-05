"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { showIconToast } from "@/lib/toast/showIconToast";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { UserRole } from "@/types/mentor";

const AdminViewSwitcherFab = () => {
  const serverRole = useAuthStore((state) => state.serverRole);
  const clientRole = useAuthStore((state) => state.clientRole);
  const setClientRole = useAuthStore((state) => state.setClientRole);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isInitialized || serverRole !== UserRole.ADMIN) {
    return null;
  }

  const handleSwitchToMentorView = () => {
    setClientRole(UserRole.MENTOR);
    showIconToast("logo", "멘토 UI 보기로 전환되었습니다.");
  };

  const handleSwitchToMenteeView = () => {
    setClientRole(UserRole.MENTEE);
    showIconToast("logo", "멘티 UI 보기로 전환되었습니다.");
  };

  return (
    <div className="fixed bottom-20 left-4 z-[100] flex flex-col gap-2">
      {isMenuOpen && (
        <div id="admin-view-switcher" className="w-56 rounded-xl border border-k-100 bg-white p-3 shadow-2xl">
          <div className="text-k-500 typo-medium-4">뷰 전환</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSwitchToMentorView}
              aria-pressed={clientRole === UserRole.MENTOR}
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
              aria-pressed={clientRole === UserRole.MENTEE}
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
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition ${
          isMenuOpen ? "bg-secondary hover:bg-secondary-800" : "bg-primary hover:bg-primary-1"
        }`}
        aria-label="관리자 메뉴"
        aria-expanded={isMenuOpen}
        aria-controls={isMenuOpen ? "admin-view-switcher" : undefined}
      >
        {isMenuOpen ? <X size={20} /> : <SlidersHorizontal size={20} />}
      </button>
    </div>
  );
};

export default AdminViewSwitcherFab;
