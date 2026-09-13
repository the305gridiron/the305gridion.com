import { useState, useMemo } from "react";
import { PageTitle, Hero } from "@/components/layout";
import { usePlayersQuery } from "@/hooks/usePlayersQuery";
import {
    buildPlayerRecord,
    groupPlayersByDepthPosition,
    filterAndSortPlayers,
} from "./rosterConfig";
import RosterControls from "./RosterControls";
import DepthChartTable from "./DepthChartTable";
import DatabaseTable from "./DatabaseTable";

import styles from "./Roster.module.css";

export default function Roster() {
    const {
        data: players,
        isLoading: playersLoading,
        isError: playersError,
    } = usePlayersQuery();

    // Not gated on its own loading/error state — if this is slow or fails,
    // the roster still renders, just with "-" for college until it resolves.

    const [activeTab, setActiveTab] = useState("all"); // all | offense | defense | special
    const [viewMode, setViewMode] = useState("depth"); // depth | grid (database table)
    const [searchQuery, setSearchQuery] = useState("");

    const [sortConfig, setSortConfig] = useState({
        key: "number",
        direction: "asc",
    });

    const rosterPlayers = useMemo(() => {
        if (!players) return [];

        return players.filter((player) => player.status !== "Inactive").map((player) =>
            buildPlayerRecord(player, player.school),
        );
    }, [players]);

    const roster = useMemo(
        () => groupPlayersByDepthPosition(rosterPlayers),
        [rosterPlayers],
    );

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const filteredPlayers = useMemo(() => {
        return filterAndSortPlayers({
            players: rosterPlayers,
            activeTab,
            searchQuery,
            sortConfig,
        });
    }, [rosterPlayers, activeTab, searchQuery, sortConfig]);

    // The inactive and practice squad tabs have no meaningful depth-chart
    // layout — those players aren't ranked on a depth chart — so they
    // always render as the database view regardless of the view toggle.
    const forcesGridView = activeTab === "inactive" || activeTab === "practice_squad";
    const effectiveViewMode = forcesGridView ? "grid" : viewMode;

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
                    {playersLoading && (
                        <div className={styles.stateMessage}>
                            Loading roster…
                        </div>
                    )}

                    {playersError && (
                        <div className={styles.stateMessage}>
                            Couldn't load the roster. Please refresh the page.
                        </div>
                    )}

                    {players && (
                        <>
                            <RosterControls
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                viewMode={effectiveViewMode}
                                onViewChange={setViewMode}
                                showViewToggle={!forcesGridView}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                onClearSearch={() => setSearchQuery("")}
                            />

                            {effectiveViewMode === "depth" ? (
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
                        </>
                    )}
                </main>
            </div>
        </>
    );
}