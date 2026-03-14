import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import styles from "./Dropdown.module.css";

export default function Dropdown({ id, className, onChange, options }) {
    return (
        <div className={styles.dropdown}>
            <select
                id={id}
                className={className}
                onChange={onChange}
            >
                {options.map(({ value, label }) => (
                    <option value={value} key={value}>{label}</option>
                ))}
            </select>
            <KeyboardArrowDownIcon className={styles.selectArrow} />
        </div>
    );
}
