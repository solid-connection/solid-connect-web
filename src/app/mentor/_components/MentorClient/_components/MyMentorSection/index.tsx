import { getMentorData } from "@/utils/mockingGetData";

import MentorCard from "@/components/mentor/MentorCard";

const MyMentorSection = () => {
  const myMentoData = getMentorData();

  return (
    <>
      <h2 className="text-lg font-bold text-gray-900">나의 멘토 페이지</h2>
      <div className="mt-[14px]">
        {myMentoData.map((mentee) => (
          <MentorCard key={mentee.id} isMine mentor={mentee} />
        ))}
      </div>
    </>
  );
};
export default MyMentorSection;
