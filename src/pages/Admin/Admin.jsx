import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ChevronDown } from "lucide-react";
import { PageTitle, Hero } from "@/components/layout";
import { clearAllLocalData } from "@/admin/localStore";
import { useAuth } from "@/admin/useAuth";
import PlayersAdmin from "./PlayersAdmin";
import TransactionsAdmin from "./TransactionsAdmin";
import SchoolsAdmin from "./SchoolsAdmin";
import ExpiringContractsAdmin from "./ExpiringContractsAdmin";
import ProspectsAdmin from "./ProspectsAdmin";
import ScheduleAdmin from "./ScheduleAdmin";
import styles from "./Admin.module.css";

const TABS = [
    { key: "players", label: "Players", Component: PlayersAdmin },
    { key: "transactions", label: "Transactions", Component: TransactionsAdmin },
    { key: "schools", label: "Schools", Component: SchoolsAdmin },
    { key: "expiring_contracts", label: "Expiring Contracts", Component: ExpiringContractsAdmin },
    { key: "prospects", label: "Prospects", Component: ProspectsAdmin },
    { key: "schedule", label: "Schedule", Component: ScheduleAdmin },
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
            <PageTitle title='The Front Office - The 305 Gridiron' />

            <Hero>
                <Hero.Title>The Front Office</Hero.Title>
                <Hero.Promo>
                    Cut players, sign free agents, shuffle the depth chart —
                    play GM to your heart's content. Nothing goes live until
                    you hit "Push to Xano," so break stuff freely.
                </Hero.Promo>
            </Hero>

            <div className={styles.adminContainer}>
                <div className={styles.tabRow}>
                    <div className={styles.tabSelectWrap}>
                        <select
                            className={styles.tabSelect}
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value)}
                        >
                            {TABS.map((tab) => (
                                <option key={tab.key} value={tab.key}>
                                    {tab.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={16} className={styles.tabSelectCaret} />
                    </div>

                    <div className={styles.headerActions}>
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            Log out
                        </button>
                        <button
                            className={styles.resetBtn}
                            onClick={handleResetLocal}
                        >
                            <Trash2 size={14} /> Clear Edits
                        </button>
                    </div>
                </div>

                <ActiveComponent />
            </div>
        </>
    );
}
