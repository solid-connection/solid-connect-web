import Image from "next/image";

import styles from "./survey.module.css";

export default function Survey1(props) {
  const { setStage, region, setRegion } = props;

  const regionList = [
    {
      englishName: "america",
      name: "미주권",
      img: "/images/region_america.jpeg",
    },
    {
      englishName: "asia",
      name: "아시아권",
      img: "/images/region_asia.jpeg",
    },
    {
      englishName: "europe",
      name: "유럽권",
      img: "/images/region_europe.jpeg",
    },
    {
      englishName: "china",
      name: "중국권",
      img: "/images/region_china.jpeg",
    },
  ];
  return (
    <div>
      <div className={styles.desc}>
        Q1
        <br />
        어느지역에 관심이 있으신가요?
      </div>
      <div className={styles.regionContainer}>
        {regionList.map((regionItem, index) => {
          return (
            <div
              key={index}
              className={styles.region}
              onClick={() => {
                setRegion(regionItem.englishName);
              }}
            >
              <div className={region !== regionItem.englishName ? styles.imgWrapper : ""}>
                <Image src={regionItem.img} alt={regionItem.name} width={162} height={162} />
              </div>
              <div className={styles.name}>{regionItem.name}</div>
            </div>
          );
        })}
      </div>
      <button
        className={styles.btn}
        onClick={() => {
          if (region) {
            setStage(2);
          }
        }}
      >
        <div>다음으로</div>
      </button>
    </div>
  );
}
