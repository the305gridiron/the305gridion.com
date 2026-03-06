import styles from "./IconHeader.module.css";

function IconHeader(props) {
    return (
        <h2 className={styles.iconHeader}>
            {props.icon} {props.title}
        </h2>
    );
}

export default IconHeader;
