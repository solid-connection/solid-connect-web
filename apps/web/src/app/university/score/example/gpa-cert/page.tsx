"use client";

import Link from "next/link";
import BlockBtn from "@/components/button/BlockBtn";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import Image from "@/components/ui/FallbackImage";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";

const GPA_CERT_STEPS = [
  {
    title: "1. 인하대 포털 > 학사행정",
    image: {
      src: "/images/gpa-cert-example-1.png",
      width: 458,
      height: 215,
      mobileWidth: 162,
      mobileHeight: 76,
    },
  },
  {
    title: "2. 성적 > 성적 및 석차 확인",
    image: {
      src: "/images/gpa-cert-example-2.png",
      width: 432,
      height: 192,
      mobileWidth: 177,
      mobileHeight: 80,
    },
  },
  {
    title: "3. PDF 다운로드",
    image: {
      src: "/images/gpa-cert-example-3.png",
      width: 1695,
      height: 400,
      mobileWidth: 291,
      mobileHeight: 68,
    },
  },
] as const;

const GPA_CERT_LINKS = [
  {
    href: "https://portal.inha.ac.kr/",
    label: "인하대학교 포털시스템",
  },
  {
    href: "https://cert.inha.ac.kr/icerti/index_internet.jsp",
    label: "인하대학교 증명발급시스템",
  },
] as const;

const GpaCertExamplePage = () => {
  const isDesktop = useIsDesktopViewport();
  const closeWindow = () => {
    window.close();
  };

  if (isDesktop === null) return null;

  return isDesktop ? <GpaCertDesktopView onClose={closeWindow} /> : <GpaCertMobileView onClose={closeWindow} />;
};

const GpaCertMobileView = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="w-full">
      <TopDetailNavigation title="증명서 예시" handleBack={onClose} />
      <div className="border-b border-magic-certificate-divider px-5 py-[33px] pb-9 text-gray-800 typo-regular-2">
        학번과 직전학기가 표시된 증명서만 승인됩니다.
        <br />
        <br />
        증명서 포털에서 발급되는 성적표 또는 인하대 수강신청 또는 앱에서 직전학기 성적이 명시된 스크린 샷 허용
      </div>
      <div className="mx-5 mt-[23px]">
        <span className="block text-gray-800 typo-bold-4">성적 증명서 발급 방법</span>
        {GPA_CERT_STEPS.map((step) => (
          <div key={step.title}>
            <span className="mt-[30px] block text-gray-800 typo-regular-2">{step.title}</span>
            <Image
              className="mt-2.5 h-auto max-w-full"
              src={step.image.src}
              width={step.image.mobileWidth}
              height={step.image.mobileHeight}
              alt="성적 증명서 발급 방법"
            />
          </div>
        ))}
        <span className="mt-[30px] block text-gray-800 typo-regular-2">4. 파일 첨부하기 버튼 {">"} 업로드 완료</span>
        <span className="mt-12 block text-gray-800 typo-bold-4">발급 바로가기</span>
        {GPA_CERT_LINKS.map((link) => (
          <Link
            key={link.href}
            className="mt-6 block text-black underline typo-medium-2"
            href={link.href}
            target="_blank"
          >
            {link.label} (inha.ac.kr)
          </Link>
        ))}
        <span className="mt-6 block text-black typo-regular-4">
          *포털 시스템뿐만 아니라 증명발급 시스템에서도 성적 증명서를 다운받을 수 있습니다.
        </span>
      </div>
      <div className="mx-5 mt-[60px]">
        <BlockBtn onClick={onClose}>닫기</BlockBtn>
      </div>
    </div>
  );
};

const GpaCertDesktopView = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="desktop-page-shell">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-primary typo-sb-9">Certificate guide</p>
          <h1 className="mt-2 text-k-900 typo-bold-1">성적 증명서 예시</h1>
          <p className="mt-2 text-k-500 typo-medium-2">
            학번과 직전학기가 보이는 파일을 준비한 뒤 성적 입력 화면에 첨부해 주세요.
          </p>
        </header>

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
          <section className="rounded-lg border border-k-100 bg-white p-8">
            <div className="rounded-lg bg-k-50 px-5 py-4 text-k-700 typo-medium-2">
              학번과 직전학기가 표시된 증명서만 승인됩니다. 증명서 포털에서 발급되는 성적표 또는 직전학기 성적이 명시된
              스크린샷을 사용할 수 있어요.
            </div>

            <div className="mt-8">
              <h2 className="text-k-900 typo-bold-4">발급 방법</h2>
              <div className="mt-5 grid gap-6">
                {GPA_CERT_STEPS.map((step) => (
                  <div key={step.title} className="rounded-lg border border-k-100 bg-white p-5">
                    <h3 className="text-k-800 typo-sb-7">{step.title}</h3>
                    <Image
                      className="mt-4 h-auto w-full rounded-lg border border-k-100 bg-white"
                      src={step.image.src}
                      width={step.image.width}
                      height={step.image.height}
                      alt={step.title}
                    />
                  </div>
                ))}
                <div className="rounded-lg border border-k-100 bg-k-50 px-5 py-4 text-k-700 typo-medium-2">
                  4. 파일 첨부하기 버튼을 눌러 다운로드한 파일을 업로드하면 됩니다.
                </div>
              </div>
            </div>
          </section>

          <aside className="desktop-sticky-panel rounded-lg border border-k-100 bg-white p-6">
            <h2 className="text-k-900 typo-bold-4">제출 전 확인</h2>
            <div className="mt-5 grid gap-3 text-k-700 typo-medium-2">
              <div className="rounded-lg bg-k-50 px-4 py-3">학번이 보이는지 확인해 주세요.</div>
              <div className="rounded-lg bg-k-50 px-4 py-3">직전학기 성적이 표시되어야 합니다.</div>
              <div className="rounded-lg bg-k-50 px-4 py-3">PDF, 이미지 파일 모두 업로드할 수 있습니다.</div>
            </div>

            <div className="mt-6">
              <h3 className="text-k-900 typo-sb-7">발급 바로가기</h3>
              <div className="mt-3 grid gap-2">
                {GPA_CERT_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    className="rounded-lg bg-sub-e-100 px-4 py-3 text-sub-e-500 typo-sb-9"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <p className="mt-3 text-k-400 typo-regular-4">
                포털 시스템뿐만 아니라 증명발급 시스템에서도 성적 증명서를 다운받을 수 있습니다.
              </p>
            </div>

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

export default GpaCertExamplePage;
