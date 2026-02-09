import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import styles from "./Layout.module.css";

export default function Layout() {
    return (
        <main className={styles.pageLayout}>
            <Header />
            <Outlet />
            <Footer />
        </main>
    );
}
