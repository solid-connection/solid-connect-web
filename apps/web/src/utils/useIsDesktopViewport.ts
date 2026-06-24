"use client";

import { useEffect, useState } from "react";

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

const useIsDesktopViewport = (initialValue: boolean | null = null) => {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(initialValue);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const updateIsDesktop = () => setIsDesktop(mediaQuery.matches);

    updateIsDesktop();
    mediaQuery.addEventListener("change", updateIsDesktop);

    return () => mediaQuery.removeEventListener("change", updateIsDesktop);
  }, []);

  return isDesktop;
};

export default useIsDesktopViewport;
