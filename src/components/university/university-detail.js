function UniversityDetail(props) {
  const { uuid, name, country, region, requirements } = props;
  return (
    <div>
      <h1>{name}</h1>
      <p>
        {country} {region}
      </p>
      <p>{requirements}</p>
    </div>
  );
}

export default UniversityDetail;
