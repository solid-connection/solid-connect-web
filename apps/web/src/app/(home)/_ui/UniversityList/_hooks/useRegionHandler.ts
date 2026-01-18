import { useEffect, useState } from "react";

import { RegionEnumExtend } from "@/types/university";

const useRegionHandler = () => {
  const [region, setRegion] = useState<RegionEnumExtend | null>(RegionEnumExtend.ALL);

  const handleRegionChange = (newRegion: RegionEnumExtend | null) => {
    setRegion(newRegion);
  };
  useEffect(() => {
    if (region === null) {
      setRegion(RegionEnumExtend.ALL);
    }
  }, [region]);

  return {
    region,
    handleRegionChange,
  };
};

export default useRegionHandler;
