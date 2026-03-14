import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import styles from "./MobileNav.module.css";

function MobileNav({ links }) {
    console.log(links);
    return (
        <nav className={styles.mobileNav}>
            {links.map(({ link, icon, text }) => (
                <a href={link}>
                    {icon} {text}
                </a>
            ))}
        </nav>
    );
}

export default MobileNav;
