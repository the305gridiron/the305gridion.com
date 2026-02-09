import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/the-305-gridiron-logo.jpeg";
import styles from "./Header.module.css";
import { ArrowLeftRight, ListOrdered, PlaySquare, Video, X, Menu } from "lucide-react";

export default function Header() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        if (drawerOpen) {
            document.body.classList.add("noScroll");
        } else {
            document.body.classList.remove("noScroll");
        }

        return () => {
            document.body.classList.remove("noScroll");
        };
    }, [drawerOpen]);

    return (
        <>
            <header className={styles.pageHeader}>
                <div className={styles.pageHeaderContainer}>
                    <figure className={styles.logo}>
                        <img src={Logo} alt="The 305 Gridiron Logo" />
                    </figure>

                    <button
                        className={styles.pageNavToggle}
                        onClick={() => setDrawerOpen(prev => !prev)}
                        aria-label="Toggle menu"
                    >
                        {drawerOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <nav
                        className={`${styles.pageNav} ${drawerOpen ? styles.open : ""}`}
                        onClick={() => setDrawerOpen(false)}
                    >
                        <Link to="/" className={styles.navLink}><Video /> Video Library</Link>
                        <Link to="/draft" className={styles.navLink}><ListOrdered /> Draft Board</Link>
                        <Link to="/offseason" className={styles.navLink}><ArrowLeftRight /> Offseason Tracker</Link>

                        <a
                            className={styles.subscribeBtn}
                            href="https://www.youtube.com/channel/UC2FolYfTCRIBP1s3ckiPb_w?sub_confirmation=1"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <PlaySquare />
                            <span className={styles.subscribeBtnText}>Subscribe</span>
                        </a>
                    </nav>
                </div>
            </header>

            {drawerOpen && (
                <div
                    className={styles.backdrop}
                    onClick={() => setDrawerOpen(false)}
                />
            )}
        </>
    );
}
