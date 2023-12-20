import CollegeCard from "./college-card";

function CollegeList(props) {
  const { colleges } = props;
  return (
    <div>
      {colleges.map((univ) => (
        <CollegeCard key={univ.uuid} {...univ} />
      ))}
    </div>
  );
}

export default CollegeList;
