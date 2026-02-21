// React
import React from "react";

// Components
import Header from "../features/offseason/components/Header";
import MobileNav from "../features/offseason/components/MobileNav";
import DraftResults from "../features/offseason/components/DraftResults";
import ScrollToTop from "../features/offseason/components/ScrollToTop";
import Sidebar from "../features/offseason/components/Sidebar";
import SidebarCards from "../features/offseason/components/SidebarCards";
import SidebarCard from "../features/offseason/components/SidebarCard";
import IconHeader from "../features/offseason/components/IconHeader";

// MUI
import useMediaQuery from "@mui/material/useMediaQuery";
import SportsFootballOutlinedIcon from "@mui/icons-material/SportsFootballOutlined";

// Styles
import "../features/offseason/styles/styles.scss";
import styles from "../styles/Offseason.module.css";

// Data
import MockDraft from "../features/offseason/data/mock-draft/2026-v1.json";
import DraftedPlayers from "../features/offseason/data/draft/2026.json";
import FreeAgents from "../features/offseason/data/fa/2026.json";

export default function Offseason() {
    const isMobile = useMediaQuery("(max-width:767px)");

    return (
        <div className={`offseason-page ${styles.offseasonPage}`}>
            <Header>
                <h1>2026 Offseason Tracker</h1>
                <p className="promo">Trades, cuts, signings, and roster shakeups, plus, dive into our mock drafts to see which players we like in the 2026 draft!</p>
            </Header>

            {isMobile && <MobileNav />}

            <main className="container-fluid">
                <DraftResults players={MockDraft} mockDraft={true} />
                <Sidebar id="freeAgency">
                    <IconHeader
                        icon={<SportsFootballOutlinedIcon />}
                        title="Free Agency"
                    />
                    <SidebarCards>
                        <SidebarCard title="Additions" players={FreeAgents?.additions} />
                        <SidebarCard title="Resignings" players={FreeAgents?.resignings} />
                        <SidebarCard title="Losses" players={FreeAgents?.losses} />
                        <SidebarCard title="Undrafted" players={FreeAgents?.undrafted} />
                    </SidebarCards>
                </Sidebar>
            </main>

            <ScrollToTop />
        </div>
    );
}
