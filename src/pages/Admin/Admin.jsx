import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "@/components/layout";
import { clearAllLocalData } from "@/admin/localStore";
import { useAuth } from "@/admin/AuthContext";
import PlayersAdmin from "./PlayersAdmin";
import TransactionsAdmin from "./TransactionsAdmin";
import SchoolsAdmin from "./SchoolsAdmin";
import styles from "./Admin.module.css";

const TABS = [
    { key: "players", label: "Players", Component: PlayersAdmin },
    { key: "transactions", label: "Transactions", Component: TransactionsAdmin },
    { key: "schools", label: "Schools", Component: SchoolsAdmin },
];

export default function Admin() {
    const [activeTab, setActiveTab] = useState("players");
    const ActiveComponent = TABS.find((tab) => tab.key === activeTab).Component;
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    const handleResetLocal = () => {
        if (
            !window.confirm(
                `Discard all local ${activeTab} edits and revert to what Xano returns? This can't be undone.`,
            )
        ) {
            return;
        }
        clearAllLocalData(activeTab);
        window.location.reload();
    };

    return (
        <>
            <PageTitle title='Local Admin - The 305 Gridiron' />

            <div className={styles.adminContainer}>
                <div className={styles.adminHeaderRow}>
                    <div className={styles.adminHeader}>
                        <h1 className={styles.adminTitle}>Local Data Admin</h1>
                        <p className={styles.adminNote}>
                            Edits save to this browser's localStorage first
                            and show up everywhere on the site immediately —
                            nothing reaches Xano until you hit "Push to Xano"
                            on a row (or "Push all"), so you can fill in data
                            and preview it before committing anything for
                            real.
                        </p>
                    </div>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        Log out
                    </button>
                </div>

                <div className={styles.tabRow}>
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            className={`${styles.tabBtn} ${
                                activeTab === tab.key ? styles.tabBtnActive : ""
                            }`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}

                    <button
                        className={styles.resetBtn}
                        onClick={handleResetLocal}
                    >
                        Clear local {activeTab} edits
                    </button>
                </div>

                <ActiveComponent />
            </div>
        </>
    );
}
