// components
import React from "react";
import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import DraftResults from "../components/DraftResults";
import ScrollToTop from "../components/ScrollToTop";
import Sidebar from "../components/Sidebar";
import SidebarCard from "../components/SidebarCard";
import IconHeader from "../components/IconHeader";

// MUI
import useMediaQuery from "@material-ui/core/useMediaQuery";
import SportsFootballOutlinedIcon from "@material-ui/icons/SportsFootballOutlined";

// styles
import "../styles/styles.scss";

// data
import DraftedPlayers from "../data/drafted-players.json";
import FreeAgents from "../data/free-agency.json";

export default () => {
    const isMobile = useMediaQuery("(max-width:767px)");

    return (
        <div className="page-wrapper">
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
                    <SidebarCard
                        title="Additions"
                        players={FreeAgents.additions}
                    />
                    <SidebarCard
                        title="Resignings"
                        players={FreeAgents.resignings}
                    />
                    <SidebarCard
                        title="Undrafted"
                        players={FreeAgents.undrafted}
                    />
                    <SidebarCard
                        title="Releases"
                        players={FreeAgents.releases}
                    />
                </Sidebar>
            </main>

            <ScrollToTop />
        </div>
    );
};
