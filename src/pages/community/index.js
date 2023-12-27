import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

import styles from "./index.module.css";

const containerStyle = {
  width: "100%",
  height: "204px",
};

export default function CommunityPage() {
  const name = "Stanford University";
  const latitude = "37.4275";
  const longitude = "-122.1697";
  const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY;
  const location = {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude),
  };

  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAP_API_KEY}&zoom=13&q=${name}`;

  return (
    <div>
      <div>
        embeded map
        <iframe className={styles.map} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" src={mapSrc}></iframe>
      </div>
      <div>
        static map
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=13&size=600x300&maptype=roadmap
&markers=color:red%7Clabel:C%7C${latitude},${longitude}
&key=${GOOGLE_MAP_API_KEY}`}
          alt="map"
        />
      </div>
      dynamic map
      <LoadScript googleMapsApiKey={GOOGLE_MAP_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={15}>
          <Marker position={location} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
