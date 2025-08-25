// --- 지역 필터 컴포넌트 ---
import { REGION_KO_MAP } from "@/constants/university";
import { RegionEnumExtend } from "@/types/university";

const RegionFilter = ({
  selectedRegion,
  onRegionChange,
}: {
  selectedRegion: RegionEnumExtend;
  onRegionChange: (region: RegionEnumExtend) => void;
}) => {
  const regions = [
    RegionEnumExtend.ALL,
    RegionEnumExtend.EUROPE,
    RegionEnumExtend.AMERICAS,
    RegionEnumExtend.ASIA,
    RegionEnumExtend.CHINA,
  ];

  return (
    <div className="flex gap-2 overflow-x-auto p-4">
      {regions.map((region) => (
        <button
          key={region}
          onClick={() => onRegionChange(region)}
          className={`min-w-fit whitespace-nowrap rounded-full border px-4 py-2 transition-colors ${
            selectedRegion === region ? "border-primary bg-primary-100 text-primary-900" : "bg-k-50 text-k-300"
          } `}
        >
          {REGION_KO_MAP[region]}
        </button>
      ))}
    </div>
  );
};
export default RegionFilter;
