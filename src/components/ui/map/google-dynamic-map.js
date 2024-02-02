import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "204px",
};

export default function GoogleDynamicMap(props) {
  const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY;

  const latitude = "37.4275";
  const longitude = "-122.1697";
  const location = {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude),
  };
  return (
    <div>
      <LoadScript googleMapsApiKey={GOOGLE_MAP_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={15}>
          <Marker position={location} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
