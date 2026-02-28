import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import styles from "./MobileNav.module.css";

function MobileNav() {
    return (
        <nav className={styles.mobileNav}>
            <a href='#freeAgency'>
                <KeyboardDoubleArrowDownIcon /> Jump to Free Agency
            </a>
        </nav>
    );
}

export default MobileNav;
