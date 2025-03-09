"use client";

type EmailSignUpButtonProps = {
  onClick: () => void;
};

const EmailSignUpButton = ({ onClick }: EmailSignUpButtonProps) => (
  <>
    <button
      onClick={onClick}
      type="button"
      className="flex h-11 w-full items-center justify-center gap-[5px] rounded-lg bg-secondary p-2.5"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
        <path
          d="M1.8 14C1.305 14 0.8814 13.8288 0.5292 13.4864C0.177 13.144 0.0006 12.7318 0 12.25V1.75C0 1.26875 0.1764 0.856916 0.5292 0.5145C0.882 0.172083 1.3056 0.000583333 1.8 0H16.2C16.695 0 17.1189 0.1715 17.4717 0.5145C17.8245 0.8575 18.0006 1.26933 18 1.75V12.25C18 12.7312 17.8239 13.1434 17.4717 13.4864C17.1195 13.8294 16.6956 14.0006 16.2 14H1.8ZM9 7.875L16.2 3.5V1.75L9 6.125L1.8 1.75V3.5L9 7.875Z"
          fill="white"
        />
      </svg>
      <span className="text-white">이메일로 시작하기</span>
    </button>
  </>
);

export default EmailSignUpButton;
