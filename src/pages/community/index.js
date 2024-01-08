import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import React, { useRef } from "react";

export default function CommunityPage() {
  return (
    <>
      <div>153x120</div>

      <img src="https://basak-image-bucket.s3.amazonaws.com/restaurant_thumbnails_sample/sample_cafe.webp" width="153px" height="120px" />
      <div>아래의 이미지 사용 예정</div>
      <img src="https://basak-image-bucket.s3.amazonaws.com/restaurant_thumbnails_sample/sample_cafe.webp" width="153px" height="120px" style={{ objectFit: "cover" }} />
      <div></div>
      <img src="https://basak-image-bucket.s3.amazonaws.com/restaurant_thumbnails_sample/sample_cafe.webp" width="153px" height="120px" style={{ objectFit: "contain" }} />
      <div>335x120</div>
      <img src="https://basak-image-bucket.s3.amazonaws.com/restaurant_thumbnails_sample/sample_cafe.webp" width="335px" height="120px" />
      <div>아래의 이미지 사용 예정</div>
      <img src="https://basak-image-bucket.s3.amazonaws.com/restaurant_thumbnails_sample/sample_cafe.webp" width="335px" height="120px" style={{ objectFit: "cover" }} />
      <img src="https://basak-image-bucket.s3.amazonaws.com/restaurant_thumbnails_sample/sample_cafe.webp" width="335px" height="120px" style={{ objectFit: "contain" }} />
    </>
  );
}
