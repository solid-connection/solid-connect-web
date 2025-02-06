"use client";

type KakaoLoginButtonProps = {
  onClick: () => void;
};

const KakaoLoginButton = ({ onClick }: KakaoLoginButtonProps) => (
  <>
    <button
      onClick={onClick}
      type="button"
      className="flex h-11 w-full items-center justify-center gap-[5px] rounded-lg bg-[#FEE500] p-2.5"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="login-v2-button__item__logo"
      >
        <title>kakao 로고</title>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.96052 3C5.83983 3 2.5 5.59377 2.5 8.79351C2.5 10.783 3.79233 12.537 5.75942 13.5807L4.9313 16.6204C4.85835 16.8882 5.1634 17.1029 5.39883 16.9479L9.02712 14.5398C9.33301 14.5704 9.64386 14.587 9.96052 14.587C14.0812 14.587 17.421 11.9932 17.421 8.79351C17.421 5.59377 14.0812 3 9.96052 3Z"
          fill="black"
        ></path>
      </svg>
      <span className="text-black">카카오로 시작하기</span>
    </button>
  </>
);

export default KakaoLoginButton;
