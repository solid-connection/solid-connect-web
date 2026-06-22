import GoogleEmbedMap from "@/components/ui/map/GoogleEmbedMap";

interface MapSectionProps {
  universityEnglishName: string;
}

const SCHOOL_LOCATION_OVERVIEW_ZOOM = 5;

const MapSection = ({ universityEnglishName }: MapSectionProps) => {
  return (
    <>
      <div className="h-1 bg-k-50" />
      <div className="my-7">
        <div className="mb-3 text-k-900 typo-sb-7">파견학교 위치</div>
        <div>
          <GoogleEmbedMap
            width="100%"
            height="300px"
            name={universityEnglishName}
            zoom={SCHOOL_LOCATION_OVERVIEW_ZOOM}
            style={{ border: "0" }}
          />
        </div>
      </div>
    </>
  );
};

export default MapSection;
