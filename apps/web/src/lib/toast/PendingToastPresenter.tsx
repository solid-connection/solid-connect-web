"use client";

import { useEffect } from "react";

import { consumePendingToast } from "./pendingToast";
import { showIconToast } from "./showIconToast";

/**
 * 이전 페이지에서 예약해 둔 토스트를 페이지 진입 시 한 번 띄운다.
 * (하드 내비게이션으로 사라졌을 토스트를 도착 페이지에서 대신 보여주는 역할)
 */
const PendingToastPresenter = () => {
  useEffect(() => {
    const pendingToast = consumePendingToast();
    if (!pendingToast) return;

    showIconToast(pendingToast.icon, pendingToast.message);
  }, []);

  return null;
};

export default PendingToastPresenter;
