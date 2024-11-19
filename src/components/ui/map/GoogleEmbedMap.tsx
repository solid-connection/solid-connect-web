type GoogleEmbedMapProps = {
  width: string;
  height: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  style?: React.CSSProperties;
};

const GoogleEmbedMap = ({ width, height, name, latitude, longitude, zoom, style }: GoogleEmbedMapProps) => {
  // name이 있으면 name으로 검색, 없으면 좌표로 검색
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

  let mapSrc = `https://www.google.com/maps/embed/v1/`;
  if (name) {
    const realZoom = zoom || 10;
    mapSrc = `${mapSrc}search?key=${API_KEY}&q=${name}&zoom=${realZoom}`;
  } else if (latitude && longitude) {
    // 정확히 짚어주는 것이 아니기에 zoom을 높여서 검색
    const realZoom = zoom || 14;
    mapSrc = `${mapSrc}view?key=${API_KEY}&center=${latitude},${longitude}&zoom=${realZoom}`;
  } else {
    return <div>지도를 불러올 수 없습니다.</div>;
  }
  return (
    <iframe
      title="google-map"
      style={style}
      width={width}
      height={height}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={mapSrc}
    />
  );
};

export default GoogleEmbedMap;
