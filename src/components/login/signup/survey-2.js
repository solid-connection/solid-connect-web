import BlockBtn from "@/components/ui/block-btn";
import CheckBoxOutlineBlankOutlined from "@/components/ui/icon/CheckBoxOutlineBlankOutlined";

import CheckBoxFilled from "../../ui/icon/CheckBoxFilled";
import styles from "./survey.module.css";

export default function Survey2(props) {
  const { setStage, region, countries, setCountries } = props;
  const countryList = {
    미주권: ["미국", "캐나다", "브라질", "호주"],
    아시아권: ["일본", "인도네시아", "아르바이잔", "싱가포르", "브루나이", "튀르키예", "홍콩"],
    유럽권: [
      "네덜란드",
      "체코",
      "노르웨이",
      "포르투갈",
      "독일",
      "폴란드",
      "덴마크",
      "프랑스",
      "리투아니아",
      "핀란드",
      "리히텐슈타인",
      "영국",
      "스웨덴",
      "스페인",
      "오스트리아",
    ],
    중국권: ["중국", "대만"],
  };
  return (
    <div className={styles.screen}>
      <div style={{ marginTop: "60px" }}>
        <div className={styles.desc}>
          Q2
          <br />
          관심있는 국가가 있으신가요?
        </div>
        <div className={styles.subDesc}>(중복 선택 가능)</div>
        <div className={styles.countries}>
          {countryList[region].map((country) => (
            <div
              key={country}
              className={styles.country}
              onClick={() => {
                if (countries.includes(country)) {
                  setCountries(countries.filter((c) => c !== country));
                } else {
                  setCountries([...countries, country]);
                }
              }}
            >
              {countries.includes(country) ? (
                <div style={{ position: "relative", width: "24px", height: "24px" }}>
                  <CheckBoxFilled />
                </div>
              ) : (
                <CheckBoxOutlineBlankOutlined />
              )}
              <div>{country}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ margin: "0 30px 24px 30px" }}>
        <BlockBtn
          onClick={() => {
            if (region) {
              setStage(3);
            }
          }}
        >
          다음으로
        </BlockBtn>
      </div>
    </div>
  );
}
