import Head from "next/head";
import Image from "next/image";

import BlockBtn from "@/components/button/block-btn";
import TopDetailNavigation from "@/components/layout/top-detail-navigation";

export default function GpaCertExamplePage() {
  const closeWiindow: () => void = () => {
    window.close();
  };
  const div = {
    padding: "33px 20px 27px 20px",
    color: "#1E1E1E",
    fontFamily: "Pretendard",
    fontSize: "14px",
    lineHeight: "150%",
  };
  return (
    <>
      <Head>
        <title>증명서 예시</title>
      </Head>
      <div>
        <TopDetailNavigation title="증명서 예시" handleBack={closeWiindow} />
        <div style={div}>
          공인 어학 성적은 해당 홈페이지를 통해
          <br />
          공식 인증 기간 마크가 포함된 파일의 원본을 제출해주세요.
          <br />
          <br />* 본교 교환학생을 지원할때, 체출해야 하는 동일한 공인어학 점수 파일입니다.
        </div>
        <div style={{ margin: "0 20px 0 20px" }}>
          <Image src="/images/lang-cert-example-1.png" width={323} height={337} alt="성적 증명서 발급 방법" />
        </div>
        <div style={{ margin: "60px 20px 0 20px" }}>
          <BlockBtn onClick={closeWiindow}>닫기</BlockBtn>
        </div>
      </div>
    </>
  );
}
