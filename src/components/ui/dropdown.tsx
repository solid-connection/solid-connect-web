import styles from "./dropdown.module.css";

// DropdownItem 타입 정의
interface DropdownItem {
  label: string;
  action: () => void;
}

// Dropdown 컴포넌트의 props 타입 정의
interface DropdownProps {
  options: DropdownItem[];
}

export default function Dropdown({ options }: DropdownProps) {
  return (
    <div className={styles.dropdown}>
      {options.map((option) => (
        <button key={option.label} className={styles.dropdown__item} onClick={option.action} type="button">
          {option.label}
        </button>
      ))}
    </div>
  );
}
