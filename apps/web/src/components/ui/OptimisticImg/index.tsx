import Image from "next/image";
import { useEffect, useState } from "react";

const OptimisticImg = ({ src, alt }: { src: string; alt: string }) => {
  // 실제 서버 URL인지, 아니면 로컬 blob URL인지 판단
  const isFinalUrl = src && !src.startsWith("blob:");

  // 최종 이미지가 로딩 완료되었는지 추적하는 상태
  const [isFinalImageLoaded, setFinalImageLoaded] = useState(false);

  // src prop이 변경될 때마다 로딩 상태를 초기화합니다.
  // (예: 다른 아티클을 보게 되어 src가 바뀔 경우를 대비)
  useEffect(() => {
    setFinalImageLoaded(false);
  }, [src]);

  return (
    <div className="relative h-full w-full">
      {/* 낙관적 UI를 위한 일반 img 태그입니다.
        항상 렌더링되어 있다가, 최종 이미지가 로드 완료되면 투명해지면서 사라집니다.
        'src'를 그대로 사용하여, blob URL일때는 미리보기를, 최종 URL로 바뀌면 임시 플레이스홀더 역할을 합니다.
      */}
      <img
        src={src}
        alt={alt}
        className={`absolute h-full w-full object-cover ${isFinalUrl && isFinalImageLoaded ? "opacity-0" : "opacity-100"} `}
      />

      {/* 실제 URL일 경우에만 Next/Image를 렌더링하고,
        로드가 완료되면 isFinalImageLoaded 상태를 true로 변경합니다.
      */}
      {isFinalUrl && (
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover ${isFinalImageLoaded ? "opacity-100" : "opacity-0"} `}
          // 이미지가 성공적으로 로드되면 이 함수가 실행됩니다.
          onLoad={() => {
            setFinalImageLoaded(true);
          }}
        />
      )}
    </div>
  );
};
export default OptimisticImg;
