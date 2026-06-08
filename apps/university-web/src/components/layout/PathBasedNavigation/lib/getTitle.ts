const getTitle = ({
  pathname,
  customTitles = {},
  dynamicRoutePatterns = [],
}: {
  pathname?: string | null;
  customTitles?: Record<string, string>;
  dynamicRoutePatterns?: Array<{ pattern: RegExp; titleKey: string }>;
}): string => {
  if (!pathname) return "";

  // 1. 정확한 매칭만 확인
  if (pathname in customTitles) {
    return customTitles[pathname];
  }

  // 2. 부분 매칭 확인 (예: /mento/chat/123 -> /mento/chat/) - 키가 /로 끝나는 경우만
  const matchingKeys = Object.keys(customTitles)
    .filter((key) => key.endsWith("/") && pathname.startsWith(key))
    .sort((a, b) => b.length - a.length); // 가장 긴 매칭 우선

  if (matchingKeys.length > 0) {
    return customTitles[matchingKeys[0]];
  }

  // 3. 커스텀 동적 라우트 패턴 매칭
  for (const { pattern, titleKey } of dynamicRoutePatterns) {
    if (pattern.test(pathname) && titleKey in customTitles) {
      return customTitles[titleKey];
    }
  }

  // 4. customTitles에 없으면 빈 문자열 반환
  return "";
};
export default getTitle;
