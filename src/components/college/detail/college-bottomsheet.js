import CollegeMap from "../college-map";

function CollegeDetail(props) {
  const { uuid, name, country, region, requirements } = props;
  return (
    <div>
      <h1>{name}</h1>
      <p>
        {country} {region}
      </p>
      <p>{requirements}</p>
      <CollegeMap />
    </div>
  );
}

export default CollegeDetail;
