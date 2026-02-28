import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import styles from "./Accordion.module.css";

export default function Accordion({
    id,
    expanded,
    onChange,
    title,
    className,
    headerClassName,
    contentClassName,
    children,
}) {
    return (
        <div className={`${styles.accordion} ${className || ""}`}>
            <button
                className={`${styles.accordionHeader} ${headerClassName || ""}`}
                onClick={() => onChange(id)}
                aria-expanded={expanded}
            >
                {title}
                <span className={styles.accordionIcon}>
                    {expanded ? (
                        <KeyboardArrowUpIcon />
                    ) : (
                        <KeyboardArrowDownIcon />
                    )}
                </span>
            </button>

            <div
                className={`${styles.accordionContent} ${
                    expanded ? styles.expanded : ""
                } ${contentClassName || ""}`}
            >
                <div className={styles.accordionContentInner}>{children}</div>
            </div>
        </div>
    );
}
