import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "204px",
};

const GoogleDynamicMap = () => {
  const GOOGLE_MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string;

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
};

export default GoogleDynamicMap;
