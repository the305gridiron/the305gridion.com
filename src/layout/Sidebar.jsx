import React from "react";
import styles from "./Sidebar.module.css";

function Sidebar(props) {
    return (
        <aside id={props.id} className={styles.sidebar}>
            {props.children}
        </aside>
    );
}

export default Sidebar;
