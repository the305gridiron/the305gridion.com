import React from "react";
import styles from "./MobileNav.module.scss";

function MobileNav(props) {
    return (
        <nav className={styles.mobileNav}>
            <ul>
                <li>
                    <a href="#draftResults">Draft Results</a>
                </li>
                <li>
                    <a href="#freeAgency">Free Agency</a>
                </li>
            </ul>
        </nav>
    );
}

export default MobileNav;
