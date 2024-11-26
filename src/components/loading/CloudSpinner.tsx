import { useEffect, useState } from "react";

import {
  IconCloudSpinner1,
  IconCloudSpinner2,
  IconCloudSpinner3,
  IconCloudSpinner4,
  IconCloudSpinner5,
  IconCloudSpinner6,
  IconCloudSpinner7,
} from "@/public/svgs/loading";

const frames = [
  IconCloudSpinner1,
  IconCloudSpinner2,
  IconCloudSpinner3,
  IconCloudSpinner4,
  IconCloudSpinner5,
  IconCloudSpinner6,
  IconCloudSpinner7,
];

type CloudSpinnerProps = {
  interval?: number;
};

const CloudSpinner = ({ interval = 200 }: CloudSpinnerProps) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const frameInterval = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % frames.length);
    }, interval);

    return () => clearInterval(frameInterval); // 컴포넌트가 언마운트될 때 클리어
  }, [interval]);

  const FrameComponent = frames[currentFrame];

  return (
    <div className="cloud-spinner">
      <FrameComponent />
    </div>
  );
};

export default CloudSpinner;
