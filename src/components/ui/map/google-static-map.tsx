type GoogleStaticMapProps = {
  latitude: number;
  longitude: number;
};

export default function GoogleStaticMap({ latitude, longitude }: GoogleStaticMapProps) {
  const GOOGLE_MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

  return (
    <img
      src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=13&size=600x300&maptype=roadmap
&markers=color:red%7Clabel:C%7C${latitude},${longitude}
&key=${GOOGLE_MAP_API_KEY}`}
      alt="map"
    />
  );
}
