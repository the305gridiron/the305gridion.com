import { Outlet, Link } from "react-router-dom";
import Logo from "../assets/the-305-gridiron-logo.jpeg";
import styles from "./Layout.module.css";
import { ArrowLeftRight, ListOrdered, PlaySquare, Video } from "lucide-react";

export default function Layout() {
    return (
        <main className={styles.pageLayout}>
            <header className={styles.pageHeader}>
                <div className={`container-fluid ${styles.pageHeaderContainer}`}>
                    <figure className={styles.logo}>
                        <img src={Logo} alt="The 305 Gridiron Logo" />
                    </figure>
                    <nav className={styles.pageNav}>
                        <Link to="/" className={styles.navLink}><Video size={18} />
                            Video Library</Link>
                        <Link to="/draft" className={styles.navLink}><ListOrdered size={18} /> Draft Board</Link>
                        <Link to="/offseason" className={styles.navLink}><ArrowLeftRight size={18} /> Offseason Tracker</Link>
                    </nav>
                    <button className={styles.subscribeBtn} onClick={() => window.open("https://www.youtube.com/channel/UC2FolYfTCRIBP1s3ckiPb_w?sub_confirmation=1", "_blank")}>
                        <PlaySquare size={18} /> Subscribe
                    </button>
                </div>
            </header>

            <Outlet />
        </main>
    );
}