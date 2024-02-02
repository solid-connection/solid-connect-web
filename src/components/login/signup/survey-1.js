import Image from "next/image";

import styles from "./survey.module.css";

export default function Survey1(props) {
  const { setStage, region, setRegion } = props;
  return (
    <div>
      <div className={styles.desc}>
        Q1
        <br />
        어느지역에 관심이 있으신가요?
      </div>
      <div className={styles.regions}>
        <div
          onClick={() => {
            setRegion("america");
          }}
        >
          <div className={region !== "america" && styles.imgWrapper}>
            <Image src="/images/region_america.jpeg" alt="미주권" width={162} height={159} />
          </div>
          미주권
        </div>
        <div
          onClick={() => {
            setRegion("asia");
          }}
        >
          <div className={region !== "asia" && styles.imgWrapper}>
            <Image src="/images/region_asia.jpeg" alt="아시아권" width={162} height={159} />
          </div>
          아시아권
        </div>
        <div
          onClick={() => {
            setRegion("europe");
          }}
        >
          <div className={region !== "europe" && styles.imgWrapper}>
            <Image src="/images/region_europe.jpeg" alt="유럽권" width={162} height={159} />
          </div>
          유럽권
        </div>
        <div
          onClick={() => {
            setRegion("china");
          }}
        >
          <div className={region !== "china" && styles.imgWrapper}>
            <Image src="/images/region_china.jpeg" alt="중국권" width={162} height={159} />
          </div>
          중국권
        </div>
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
