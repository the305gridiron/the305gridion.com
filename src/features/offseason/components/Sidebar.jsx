import React from "react";
import styles from "./Sidebar.module.scss";

function Sidebar(props) {
    return (
        <aside id={props.id} className={styles.sidebar}>
            {props.children}
        </aside>
    );
}

export default Sidebar;
