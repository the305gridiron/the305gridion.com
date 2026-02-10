import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerInner}`}>

                <div className={styles.brandBlock}>
                    <h4>The 305 Gridiron</h4>
                    <p className={styles.tagline}>
                        Welcome to The 305 Gridiron — your home for passionate, hilarious, and brutally honest Miami Dolphins fan takes. We're not former players. We're not reporters. We're just two Dolfans who bleed aqua and orange, and we've got opinions you're gonna want to hear.
                    </p>
                </div>

                <div className={styles.schedule}>
                    <h4>In-Season Schedule</h4>
                    <p>Live-stream every Monday and Wednesday at 7 PM EST</p>

                    <h4>Off-Season Schedule</h4>
                    <p>New videos every Tuesday and Thursday at 7 PM EST</p>
                </div>

                <nav className={styles.footerNav}>
                    <h4>Explore</h4>
                    <Link to="/">Video Library</Link>
                    <Link to="/draft">Draft Board</Link>
                    <Link to="/offseason">Offseason Tracker</Link>
                    <a href="mailto:you@the305gridiron.com">
                        Contact Us
                    </a>
                </nav>
            </div>

            <div className={styles.legal}>
                © {new Date().getFullYear()} The 305 Gridiron
            </div>
        </footer>
    );
}
