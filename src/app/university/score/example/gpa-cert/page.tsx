"use client";

import Image from "next/image";
import Link from "next/link";

import BlockBtn from "@/components/button/BlockBtn";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

const GpaCertExamplePage = () => {
  const closeWindow = () => {
    window.close();
  };

  const divStyle = {
    padding: "33px 20px 36px 20px",
    borderBottom: "1px solid rgb(236, 236, 236)",
    fontFamily: "Pretendard",
    fontSize: "14px",
    lineHeight: "150%",
  };

  const h1Style = {
    display: "block",
    fontFamily: "Pretendard",
    fontSize: "18px",
    fontWeight: 700,
    lineHeight: "150%",
  };

  const h3Style = {
    marginTop: "30px",
    display: "block",
    fontFamily: "Pretendard",
    fontSize: "14px",
    lineHeight: "150%",
  };

  const aStyle = {
    display: "block",
    marginTop: "24px",
    fontFamily: "Pretendard",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "150%",
    textDecorationLine: "underline",
  };

  return (
    <div className="w-full">
      <TopDetailNavigation title="증명서 예시" handleBack={closeWindow} />
      <div style={divStyle} className="border-b border-bg-400 text-gray-800">
        학번과 직전학기가 표시된 증명서만 승인됩니다.
        <br />
        <br />
        증명서 포털에서 발급되는 성적표 또는 인하대 수강신청 또는 앱에서 직전학기 성적이 명시된 스크린 샷 허용
      </div>
      <div style={{ margin: "23px 20px 0 20px" }}>
        <span style={h1Style} className="text-gray-800">
          성적 증명서 발급 방법
        </span>
        <span style={h3Style} className="text-gray-800">
          1. 인하대 포털 {">"} 학사행정
        </span>
        <Image
          style={{ marginTop: "10px" }}
          src="/images/gpa-cert-example-1.png"
          width={162}
          height={76}
          alt="성적 증명서 발급 방법"
        />
        <span style={h3Style} className="text-gray-800">
          2. 성적 {">"} 성적 및 석차 확인
        </span>
        <Image
          style={{ marginTop: "10px" }}
          src="/images/gpa-cert-example-2.png"
          width={177}
          height={80}
          alt="성적 증명서 발급 방법"
        />
        <span style={h3Style} className="text-gray-800">
          3. PDF 다운로드
        </span>
        <Image
          style={{ marginTop: "10px" }}
          src="/images/gpa-cert-example-3.png"
          width={291}
          height={68}
          alt="성적 증명서 발급 방법"
        />
        <span style={h3Style} className="text-gray-800">
          4. 파일 첨부하기 버튼 {">"} 업로드 완료
        </span>
        <span style={{ ...h1Style, marginTop: "48px" }}>성적 증명서 발급 방법</span>
        <Link style={aStyle} className="text-black" href="https://portal.inha.ac.kr/" target="_blank">
          인하대학교 포털시스템 (inha.ac.kr)
        </Link>
        <Link style={aStyle} href="https://cert.inha.ac.kr/icerti/index_internet.jsp" target="_blank">
          인하대학교 증명발급시스템[ICerti] (inha.ac.kr)
        </Link>
        <span
          className="text-black"
          style={{
            fontFamily: "Pretendard",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "150%",
          }}
        >
          *포털 시스템뿐만 아니라 증명발급 시스템에서도 성적 증명서를 다운받을 수 있습니다.
        </span>
      </div>
      <div style={{ margin: "60px 20px 0 20px" }}>
        <BlockBtn onClick={closeWindow}>닫기</BlockBtn>
      </div>
    </div>
  );
};

export default GpaCertExamplePage;
