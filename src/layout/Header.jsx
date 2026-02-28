import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/the-305-gridiron-logo.jpeg";
import styles from "./Header.module.css";
import {
  ArrowLeftRight,
  ListOrdered,
  PlaySquare,
  Video,
  X,
  Menu,
  ClipboardList,
  History,
} from "lucide-react";

const navItems = [
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
  {
    label: "Transactions",
    icon: <ArrowLeftRight size={20} />,
    href: "/transactions",
  },
];

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
            {navItems.map((item) => (
              <Link to={item.href} className={styles.navLink} key={item.label}>
                {item.icon} {item.label}
              </Link>
            ))}

            <a
              className={styles.subscribeBtn}
              href='https://www.youtube.com/channel/UC2FolYfTCRIBP1s3ckiPb_w?sub_confirmation=1'
              target='_blank'
              rel='noopener noreferrer'
            >
              <PlaySquare />
              <span className={styles.subscribeBtnText}>Subscribe</span>
            </a>
          </nav>
        </div>
      </header>

      {drawerOpen && (
        <div className={styles.backdrop} onClick={() => setDrawerOpen(false)} />
      )}
    </>
  );
}
