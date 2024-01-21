import { useState } from "react";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import ProgressBar from "@/components/score/register/progress-bar";

export default function ScoreRegisterPage() {
  const [progress, setProgress] = useState(50);
  return (
    <>
      <TopDetailNavigation title="성적 입력하기" />
      <div>
        <ProgressBar style={{ margin: "11px 20px 0 20px" }} progress={progress} description="본 과정 완료 후, 지원자 현황을 확인 할 수 있습니다. " />
      </div>
    </>
  );
}
