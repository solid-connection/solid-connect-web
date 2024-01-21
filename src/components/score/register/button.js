import styles from "./button.module.css";

export default function Button(props) {
  const { text } = props;
  return (
    <div style={props.style}>
      <button className={styles.button}>
        <div className={styles.text}>{text}</div>
      </button>
    </div>
  );
}
