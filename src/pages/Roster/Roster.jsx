import React, { useState, useMemo } from "react";
import { PageTitle, Hero } from "@/components/layout";
import {
    normalizeRosterState,
    getInitialDepthChart,
    filterAndSortPlayers,
} from "./rosterConfig";
import RosterControls from "./RosterControls";
import DepthChartTable from "./DepthChartTable";
import DatabaseTable from "./DatabaseTable";

import styles from "./Roster.module.css";

export default function Roster() {
    // State
    const [roster] = useState(() => {
        if (typeof window === "undefined") {
            return getInitialDepthChart();
        }

        const saved = window.localStorage.getItem("dolphinsRosterLineup");
        if (!saved) {
            return getInitialDepthChart();
        }

        try {
            return normalizeRosterState(JSON.parse(saved));
        } catch {
            return getInitialDepthChart();
        }
    });
    const [activeTab, setActiveTab] = useState("offense"); // offense | defense | special | all
    const [viewMode, setViewMode] = useState("depth"); // depth | grid (database table)
    const [searchQuery, setSearchQuery] = useState("");

    // Sort configuration for Database Grid view
    const [sortConfig, setSortConfig] = useState({
        key: "number",
        direction: "asc",
    });

    // Flatten roster for filtering & database rendering
    const allPlayersList = useMemo(() => {
        return Object.values(roster).flat().filter(Boolean);
    }, [roster]);

    // Handle database header sort clicks
    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Filtered & Sorted list for Grid (Database) View
    const filteredPlayers = useMemo(() => {
        return filterAndSortPlayers({
            players: allPlayersList,
            activeTab,
            searchQuery,
            sortConfig,
        });
    }, [allPlayersList, activeTab, searchQuery, sortConfig]);

    return (
        <>
            <PageTitle title='Roster - The 305 Gridiron' />

            <div className={styles.rosterContainer}>
                <Hero>
                    <Hero.Title>Miami Dolphins Roster</Hero.Title>
                    <Hero.Promo>
                        A professional-grade squad coordinator and player
                        catalog. Browse the full roster depth chart or sort the
                        team database with quick filtering.
                    </Hero.Promo>
                </Hero>

                <main className={styles.mainDashboard}>
                    <RosterControls
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        viewMode={viewMode}
                        onViewChange={setViewMode}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onClearSearch={() => setSearchQuery("")}
                    />

                    {viewMode === "depth" ? (
                        <DepthChartTable
                            roster={roster}
                            activeTab={activeTab}
                            searchQuery={searchQuery}
                        />
                    ) : (
                        <DatabaseTable
                            players={filteredPlayers}
                            sortConfig={sortConfig}
                            onSort={requestSort}
                        />
                    )}
                </main>
            </div>
        </>
    );
}