import GoogleEmbedMap from "@/components/ui/map/GoogleEmbedMap";

interface MapSectionProps {
  universityEnglishName: string;
  variant?: "mobile" | "desktop";
}

const MapSection = ({ universityEnglishName, variant = "mobile" }: MapSectionProps) => {
  if (variant === "desktop") {
    return (
      <section className="rounded-lg border border-k-100 bg-white p-7 shadow-sm">
        <header className="border-b border-k-50 pb-5">
          <p className="text-primary typo-sb-9">Location</p>
          <h2 className="mt-2 text-k-900 typo-bold-2">파견학교 위치</h2>
          <p className="mt-2 text-k-500 typo-medium-3">국가 안에서 어느 지역에 있는지 중심으로 확인해보세요.</p>
        </header>
        <div className="mt-6 overflow-hidden rounded-lg border border-k-100">
          <GoogleEmbedMap width="100%" height="360px" name={universityEnglishName} zoom={5} style={{ border: "0" }} />
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="h-1 bg-k-50" />
      <div className="my-7">
        <div className="mb-3 text-k-900 typo-sb-7">파견학교 위치</div>
        <div>
          <GoogleEmbedMap width="100%" height="300px" name={universityEnglishName} zoom={5} style={{ border: "0" }} />
        </div>
      </div>
    </>
  );
};

export default MapSection;
