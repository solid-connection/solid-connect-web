const SiteFooter = () => {
  return (
    <footer className="mt-6 border-t-[5px] border-k-50 bg-background-2 px-5 py-6">
      <p className="mb-2 font-serif text-k-600 typo-sb-11">사업자 정보</p>
      <ul className="space-y-1">
        <li className="flex gap-2 typo-regular-5">
          <span className="w-20 shrink-0 text-k-400">상호</span>
          <span className="flex-1 text-k-600">바삭크리스피</span>
        </li>
        <li className="flex gap-2 typo-regular-5">
          <span className="w-20 shrink-0 text-k-400">대표</span>
          <span className="flex-1 text-k-600">박위백</span>
        </li>
        <li className="flex gap-2 typo-regular-5">
          <span className="w-20 shrink-0 text-k-400">사업자등록번호</span>
          <span className="flex-1 text-k-600">671-38-01352</span>
        </li>
        <li className="flex gap-2 typo-regular-5">
          <span className="w-20 shrink-0 text-k-400">주소</span>
          <span className="flex-1 text-k-600">인천광역시 미추홀구 인하로 100, 인하드림센터동 2층 213A호</span>
        </li>
      </ul>
      <p className="mt-4 text-k-400 typo-regular-6">© {new Date().getFullYear()} 솔리드커넥션. All rights reserved.</p>
    </footer>
  );
};

export default SiteFooter;
