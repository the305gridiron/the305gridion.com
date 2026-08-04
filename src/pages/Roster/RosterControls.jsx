import { Search, X } from "lucide-react";
import { VIEW_TABS } from "./rosterConfig";
import styles from "./Roster.module.css";

const formatTabLabel = (tab) =>
    tab === "special" ? "SPECIAL TEAMS" : tab.toUpperCase();

export default function RosterControls({
    activeTab,
    onTabChange,
    viewMode,
    onViewChange,
    searchQuery,
    onSearchChange,
    onClearSearch,
}) {
    return (
        <>
            <div className={styles.dashboardHeader}>
                {/* Desktop: segmented tab buttons */}
                <div className={styles.segmentControl}>
                    {VIEW_TABS.map((tab) => (
                        <button
                            key={tab}
                            className={`${styles.segmentBtn} ${activeTab === tab ? styles.segmentActive : ""}`}
                            onClick={() => onTabChange(tab)}
                        >
                            {formatTabLabel(tab)}
                        </button>
                    ))}
                </div>

                <div className={styles.actionControls}>
                    <div className={styles.viewSegment}>
                        <button
                            className={`${styles.viewBtn} ${viewMode === "depth" ? styles.viewActive : ""}`}
                            onClick={() => onViewChange("depth")}
                        >
                            DEPTH CHART
                        </button>
                        <button
                            className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewActive : ""}`}
                            onClick={() => onViewChange("grid")}
                        >
                            PLAYER DATABASE
                        </button>
                    </div>
                </div>

                {/* Mobile: dropdown filters, replaces both sets of tabs above */}
                <div className={styles.mobileFilterRow}>
                    <select
                        className={styles.filterSelect}
                        value={activeTab}
                        onChange={(event) => onTabChange(event.target.value)}
                        aria-label='Filter by position group'
                    >
                        {VIEW_TABS.map((tab) => (
                            <option key={tab} value={tab}>
                                {formatTabLabel(tab)}
                            </option>
                        ))}
                    </select>

                    <select
                        className={styles.filterSelect}
                        value={viewMode}
                        onChange={(event) => onViewChange(event.target.value)}
                        aria-label='Select view'
                    >
                        <option value='depth'>DEPTH CHART</option>
                        <option value='grid'>PLAYER DATABASE</option>
                    </select>
                </div>
            </div>

            <div className={styles.searchBarContainer}>
                <div className={styles.searchInputWrapper}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type='text'
                        placeholder='Filter roster by name, college, position...'
                        value={searchQuery}
                        onChange={(event) => onSearchChange(event.target.value)}
                        className={styles.searchInput}
                    />
                    {searchQuery && (
                        <button
                            className={styles.clearSearchBtn}
                            onClick={onClearSearch}
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}