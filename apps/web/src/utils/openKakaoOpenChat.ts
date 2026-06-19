const KAKAO_OPEN_CHAT_HOST = "open.kakao.com";
const KAKAO_OPEN_CHAT_PATH_PATTERN = /^\/o\/([^/?#]+)/;
const KAKAO_OPEN_CHAT_REFERER = "EW";
const OPEN_CHAT_FALLBACK_DELAY_MS = 1200;

export const getKakaoOpenChatJoinScheme = (openChatUrl: string): string | null => {
  try {
    const url = new URL(openChatUrl);

    if (url.hostname !== KAKAO_OPEN_CHAT_HOST) {
      return null;
    }

    const linkId = url.pathname.match(KAKAO_OPEN_CHAT_PATH_PATTERN)?.[1];

    if (!linkId) {
      return null;
    }

    return `kakaoopen://join?l=${encodeURIComponent(linkId)}&r=${KAKAO_OPEN_CHAT_REFERER}`;
  } catch {
    return null;
  }
};

export const openExternalUrl = (url: string) => {
  const openedWindow = window.open(url, "_blank", "noopener,noreferrer");

  if (!openedWindow) {
    window.location.href = url;
  }
};

export const openKakaoOpenChat = (openChatUrl: string) => {
  const joinScheme = getKakaoOpenChatJoinScheme(openChatUrl);

  if (!joinScheme) {
    openExternalUrl(openChatUrl);
    return;
  }

  let fallbackTimer: number | undefined;

  const cleanup = () => {
    if (fallbackTimer) {
      window.clearTimeout(fallbackTimer);
    }

    window.removeEventListener("pagehide", cleanup);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      cleanup();
    }
  };

  fallbackTimer = window.setTimeout(() => {
    cleanup();
    openExternalUrl(openChatUrl);
  }, OPEN_CHAT_FALLBACK_DELAY_MS);

  window.addEventListener("pagehide", cleanup);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  try {
    window.location.href = joinScheme;
  } catch {
    cleanup();
    openExternalUrl(openChatUrl);
  }
};
