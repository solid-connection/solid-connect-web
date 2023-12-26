import HomeCollegeCards from "./home-college-cards";
import styles from "./home.module.css";

export default function Home(props) {
  const colleges = [
    { uuid: 1, name: "릴카톨릭 대학교", image: "/images/catolic.png" },
    { uuid: 2, name: "보라스대학교", image: "/images/catolic.png" },
    { uuid: 3, name: "토론토 대학교", image: "/images/catolic.png" },
    { uuid: 4, name: "퀸즈 대학교", image: "/images/catolic.png" },
    { uuid: 5, name: "워터루 대학교", image: "/images/catolic.png" },
    { uuid: 6, name: "웨스턴 대학교", image: "/images/catolic.png" },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.h1}>교환학생의 첫 걸음,</div>
      <div>해외 학교 알아보기</div>
      <div>성적 공유 시트</div>
      <div className={styles.tm20}>
        <div className={styles.title}>추천하는 파견학교</div>
        <HomeCollegeCards colleges={colleges} />
      </div>
      <div className={styles.tm24}>
        <div className={styles.title}>활발하게 활동중인 멘토</div>
      </div>
      <div className={styles.tm24}>
        <div className={styles.title}>솔커 소식지</div>
      </div>
    </div>
  );
}
