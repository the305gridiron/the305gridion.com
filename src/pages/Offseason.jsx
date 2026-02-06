// React
import React from "react";

// Components
import Header from "../features/offseason/components/Header";
import MobileNav from "../features/offseason/components/MobileNav";
import DraftResults from "../features/offseason/components/DraftResults";
import ScrollToTop from "../features/offseason/components/ScrollToTop";
import Sidebar from "../features/offseason/components/Sidebar";
import SidebarCard from "../features/offseason/components/SidebarCard";
import IconHeader from "../features/offseason/components/IconHeader";

// MUI
import useMediaQuery from "@mui/material/useMediaQuery";
import SportsFootballOutlinedIcon from "@mui/icons-material/SportsFootballOutlined";

// Styles
import "../features/offseason/styles/styles.scss";

// Data
import DraftedPlayers from "../features/offseason/data/drafted-players.json";
import FreeAgents from "../features/offseason/data/free-agency.json";

export default function Offseason() {
    const isMobile = useMediaQuery("(max-width:767px)");

    return (
        <div className="offseason-page">
            <Header>
                <h1>Miami Dolphins Offseason 2020</h1>
            </Header>

            {isMobile && <MobileNav />}

            <main className="page-content">
                <DraftResults players={DraftedPlayers} />
                <Sidebar id="freeAgency">
                    <IconHeader
                        icon={<SportsFootballOutlinedIcon />}
                        title="Free Agency"
                    />
                    <SidebarCard title="Additions" players={FreeAgents.additions} />
                    <SidebarCard title="Resignings" players={FreeAgents.resignings} />
                    <SidebarCard title="Undrafted" players={FreeAgents.undrafted} />
                    <SidebarCard title="Releases" players={FreeAgents.releases} />
                </Sidebar>
            </main>

            <ScrollToTop />
        </div>
    );
}
