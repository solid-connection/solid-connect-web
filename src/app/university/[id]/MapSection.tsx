import GoogleEmbedMap from "@/components/ui/map/GoogleEmbedMap";

import HeaderZone from "./HeaderZone";

const MapSection = ({ universityEnglishName }: { universityEnglishName: string }) => {
  return (
    <>
      <div className="h-1 bg-k-50" />
      <div className="my-7">
        <HeaderZone title="파견학교 위치">
          <GoogleEmbedMap width="100%" height="300px" name={universityEnglishName} style={{ border: "0" }} />
        </HeaderZone>
      </div>
    </>
  );
};

export default MapSection;
