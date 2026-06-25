"use client";

import BlockBtn from "@/components/button/BlockBtn";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import Image from "@/components/ui/FallbackImage";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";

const LangCertExamplePage = () => {
  const isDesktop = useIsDesktopViewport();
  const closeWindow = () => {
    window.close();
  };

  if (isDesktop === null) return null;

  return isDesktop ? <LangCertDesktopView onClose={closeWindow} /> : <LangCertMobileView onClose={closeWindow} />;
};

const LangCertMobileView = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="w-full">
      <TopDetailNavigation title="증명서 예시" handleBack={onClose} />
      <div className="px-5 py-[33px] pb-[27px] text-gray-800 typo-regular-2">
        공인 어학 성적은 해당 홈페이지를 통해
        <br />
        공식 인증 기간 마크가 포함된 파일의 원본을 제출해주세요.
        <br />
        <br />* 본교 교환학생을 지원할때, 제출해야 하는 동일한 공인어학 점수 파일입니다.
      </div>
      <div className="mx-5">
        <Image
          className="h-auto max-w-full"
          src="/images/lang-cert-example-1.png"
          width={323}
          height={337}
          alt="어학 증명서 예시"
        />
      </div>
      <div className="mx-5 mt-[60px]">
        <BlockBtn onClick={onClose}>닫기</BlockBtn>
      </div>
    </div>
  );
};

const LangCertDesktopView = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-primary typo-sb-9">Certificate guide</p>
          <h1 className="mt-2 text-k-900 typo-bold-1">어학 증명서 예시</h1>
          <p className="mt-2 text-k-500 typo-medium-2">
            공식 인증 기간 마크가 포함된 원본 파일을 준비한 뒤 어학 성적 입력 화면에 첨부해 주세요.
          </p>
        </header>

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
          <section className="rounded-lg border border-k-100 bg-white p-8">
            <div className="rounded-lg bg-k-50 px-5 py-4 text-k-700 typo-medium-2">
              공인 어학 성적은 해당 시험 홈페이지에서 발급되는 원본 파일을 제출해 주세요. 본교 교환학생 지원 시 제출하는
              동일한 공인어학 점수 파일입니다.
            </div>

            <div className="mt-8 overflow-hidden rounded-lg border border-k-100 bg-white p-5">
              <h2 className="text-k-900 typo-bold-4">제출 파일 예시</h2>
              <Image
                className="mx-auto mt-5 h-auto w-full max-w-3xl rounded-lg border border-k-100 bg-white"
                src="/images/lang-cert-example-1.png"
                width={1011}
                height={1055}
                alt="어학 증명서 예시"
              />
            </div>
          </section>

          <aside className="sticky top-8 rounded-lg border border-k-100 bg-white p-6">
            <h2 className="text-k-900 typo-bold-4">제출 전 확인</h2>
            <div className="mt-5 grid gap-3 text-k-700 typo-medium-2">
              <div className="rounded-lg bg-k-50 px-4 py-3">시험명과 점수가 선명하게 보여야 합니다.</div>
              <div className="rounded-lg bg-k-50 px-4 py-3">공식 인증 기간 마크가 포함되어야 합니다.</div>
              <div className="rounded-lg bg-k-50 px-4 py-3">캡처본보다 원본 파일 제출을 권장합니다.</div>
            </div>
            <p className="mt-5 text-k-500 typo-medium-3">
              미인정 서류를 업로드하면 승인 거절될 수 있어요. 성적 입력 화면의 점수와 첨부 파일의 점수가 같은지도 함께
              확인해 주세요.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-lg bg-primary px-5 py-4 text-white typo-sb-9 transition-colors hover:bg-primary/90"
            >
              닫기
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default LangCertExamplePage;
