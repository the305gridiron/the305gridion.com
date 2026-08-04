import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/the-305-gridiron-logo.jpeg";
import styles from "./Header.module.css";
import {
    ArrowLeftRight,
    ChevronDown,
    ListOrdered,
    PlaySquare,
    X,
    Menu,
    ClipboardList,
    History,
    UserRound,
} from "lucide-react";

const draftLinks = [
    { label: "Big Board", icon: <ListOrdered size={20} />, href: "/prospects" },
    {
        label: "Mock Drafts",
        icon: <ClipboardList size={20} />,
        href: "/mocks",
    },
    {
        label: "Draft Results",
        icon: <History size={20} />,
        href: "/drafts",
    },
];

export default function Header() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [draftOpen, setDraftOpen] = useState(false);

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
                        <Link to='/'>
                            <img src={Logo} alt='The 305 Gridiron Logo' />
                        </Link>
                    </figure>

                    <button
                        className={styles.pageNavToggle}
                        onClick={() => setDrawerOpen((prev) => !prev)}
                        aria-label='Toggle menu'
                    >
                        {drawerOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <nav
                        className={`${styles.pageNav} ${drawerOpen ? styles.open : ""}`}
                        onClick={() => setDrawerOpen(false)}
                    >
                        <Link
                            to='/roster'
                            className={styles.navLink}
                            onClick={() => {
                                setDraftOpen(false);
                                setDrawerOpen(false);
                            }}
                        >
                            <UserRound size={20} /> Roster
                        </Link>

                        <Link
                            to='/transactions'
                            className={styles.navLink}
                            onClick={() => {
                                setDraftOpen(false);
                                setDrawerOpen(false);
                            }}
                        >
                            <ArrowLeftRight size={20} /> Transactions
                        </Link>

                        <div className={styles.navItem}>
                            {drawerOpen ? (
                                // Mobile drawer: show draft links inline as regular nav links
                                draftLinks.map((item) => (
                                    <Link
                                        to={item.href}
                                        className={styles.navLink}
                                        key={item.label}
                                        onClick={() => {
                                            setDraftOpen(false);
                                            setDrawerOpen(false);
                                        }}
                                    >
                                        {item.icon} {item.label}
                                    </Link>
                                ))
                            ) : (
                                // Desktop: keep dropdown header + floating menu
                                <>
                                    <button
                                        type='button'
                                        className={`${styles.navLink} ${styles.dropdownToggle}`}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setDraftOpen((prev) => !prev);
                                        }}
                                        aria-expanded={draftOpen}
                                    >
                                        <span className={styles.navLabel}>
                                            <ListOrdered size={20} /> Draft
                                        </span>
                                        <ChevronDown
                                            size={14}
                                            className={`${styles.dropdownChevron} ${draftOpen ? styles.open : ""}`}
                                        />
                                    </button>

                                    {draftOpen && (
                                        <div
                                            className={styles.dropdownMenu}
                                            role='menu'
                                        >
                                            {draftLinks.map((item) => (
                                                <Link
                                                    to={item.href}
                                                    className={
                                                        styles.dropdownLink
                                                    }
                                                    key={item.label}
                                                    onClick={() => {
                                                        setDraftOpen(false);
                                                        setDrawerOpen(false);
                                                    }}
                                                >
                                                    {item.icon} {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <a
                            className={styles.subscribeBtn}
                            href='https://www.youtube.com/channel/UC2FolYfTCRIBP1s3ckiPb_w?sub_confirmation=1'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <PlaySquare />
                            <span className={styles.subscribeBtnText}>
                                Subscribe
                            </span>
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