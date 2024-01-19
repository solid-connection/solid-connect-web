import styles from "./search-input-country.module.css";
import World from "@/components/layout/icon/World";

export default function SearchInputCountry(props) {
  return (
    <div className={styles.box}>
      <div className={styles.icon}>
        <World />
      </div>
      <div className={styles.main}>관심있는 나라</div>
    </div>
  );
}
