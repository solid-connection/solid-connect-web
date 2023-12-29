export default function GoogleStaticMap(props) {
  const { latitude, longitude } = props;
  const API_KEY = process.env.GOOGLE_MAP_API_KEY;

  return (
    <img
      src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=13&size=600x300&maptype=roadmap
&markers=color:red%7Clabel:C%7C${latitude},${longitude}
&key=${GOOGLE_MAP_API_KEY}`}
      alt="map"
    />
  );
}
