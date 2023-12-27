import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

import styles from "./college-map.module.css";

const containerStyle = {
  width: "100%",
  height: "204px",
};

function CollegeMap({ latitude, longitude }) {
  const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY;
  const location = {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude),
  };

  return (
    <div className={styles.wrapper}>
      <LoadScript googleMapsApiKey={GOOGLE_MAP_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={15}>
          <Marker position={location} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default CollegeMap;
