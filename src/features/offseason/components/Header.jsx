import React from "react";
import styles from "./Header.module.scss";

function Header(props) {
    return (
        <header className={styles.pageHeader}>
            <div className="container">{props.children}</div>
        </header>
    );
}

export default Header;
