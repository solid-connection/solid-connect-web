import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import React, { useRef } from "react";

export default function CommunityPage() {
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  const handleTabClick = (ref) => {
    ref.current?.scrollIntoView({ behavior: "auto", block: "start" });
    const yOffset = 56; // 고정된 네비게이션 바 높이나 원하는 만큼의 추가적인 오프셋
    const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div>
      <TopDetailNavigation />
      <h1>Community</h1>
      <div>
        <button onClick={() => handleTabClick(section1Ref)}>Go to Section 1</button>
        <button onClick={() => handleTabClick(section2Ref)}>Go to Section 2</button>
        <button onClick={() => handleTabClick(section3Ref)}>Go to Section 3</button>
      </div>
      <div ref={section1Ref} style={{ height: "500px", border: "1px solid black" }}>
        <h2>Section 1</h2>
        <p>Content for section 1...</p>
      </div>
      <div ref={section2Ref} style={{ height: "500px", border: "1px solid black" }}>
        <h2>Section 2</h2>
        <p>Content for section 2...</p>
      </div>
      <div ref={section3Ref} style={{ height: "500px", border: "1px solid black" }}>
        <h2>Section 3</h2>
        <p>Content for section 3...</p>
      </div>
    </div>
  );
}
