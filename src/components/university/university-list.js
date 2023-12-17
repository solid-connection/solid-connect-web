import UniversityCard from "./university-card";

function UniversityList(props) {
  const { universities } = props;
  return (
    <div>
      {universities.map((univ) => (
        <UniversityCard key={univ.uuid} {...univ} />
      ))}
    </div>
  );
}

export default UniversityList;
