import React, { useState, useMemo } from "react";
import styles from "./ProspectTable.module.css";

const ProspectTable = ({ prospects, designations }) => {
    const [expandedProspects, setExpandedProspects] = useState([]);

    const designationsMap = useMemo(() => {
        const map = new Map();
        if (Array.isArray(designations)) {
            designations.forEach((des) => map.set(des.code, des.description));
        }
        return map;
    }, [designations]);

    if (!prospects) return null;

    const toggleProspectDetails = (prospectId) => {
        setExpandedProspects(
            (prevIds) =>
                prevIds.includes(prospectId)
                    ? prevIds.filter((id) => id !== prospectId) // Remove if already expanded
                    : [...prevIds, prospectId] // Add if not expanded
        );
    };

    const getTierClass = (tier) => {
        if (!tier) return "";
        return `${tier
            .replace(/\s+/g, "")   // remove spaces
            .replace(/\//g, "")    // remove slashes
            .replace(/–/g, "")     // remove en-dash
            }`;
    };

    const hasValue = (val) => {
        if (val == null) return false;           // null/undefined
        if (typeof val === "number") return val !== 0; // numeric 0 is invalid
        if (typeof val === "string") return val.trim() !== ""; // blank string is invalid
        return true; // everything else is valid
    };

    const renderMeasurables = (prospect) => {
        const items = [];

        if (hasValue(prospect.age)) items.push(<span key="age"><strong>Age:</strong> {prospect.age}</span>);
        if (hasValue(prospect.height)) items.push(<span key="height"><strong>Height:</strong> {prospect.height}</span>);
        if (hasValue(prospect.weight)) items.push(<span key="weight"><strong>Weight:</strong> {prospect.weight}</span>);

        // Join with bullet, but avoid adding trailing bullet
        return items.reduce((acc, el, index) => {
            if (index === 0) return [el];
            return [...acc, <span key={`bullet-${index}`}>&nbsp;&bull;&nbsp;</span>, el];
        }, []);
    };


    return (
        <div className={styles.prospectTableContainer}>
            <div className={styles.prospectTableHeader}>
                <div className={`${styles.prospectTableHeaderCell} ${styles.prospectTableCellRank}`}>
                    Ovr Rank
                </div>
                <div className={`${styles.prospectTableHeaderCell} ${styles.prospectTableCellPosRank}`}>
                    Pos Rank
                </div>
                <div
                    className={`${styles.prospectTableHeaderCell} ${styles.prospectTableCellName}`}
                >
                    Prospect Details
                </div>
                <div
                    className={`${styles.prospectTableHeaderCell} ${styles.prospectTableCellGrade}`}
                >
                    Grade
                </div>
                <div className={`${styles.prospectTableHeaderCell} ${styles.prospectTableCellFit}`}>
                    Fit Score
                </div>
                <div
                    className={`${styles.prospectTableHeaderCell} ${styles.prospectTableCellProjection}`}
                >
                    Projection
                </div>
                <div
                    className={`${styles.prospectTableHeaderCell} ${styles.prospectTableCellComp}`}
                >
                    Player Comp
                </div>
            </div>
            {/* prospectTableHeader */}

            {prospects.map((prospect) => (
                <React.Fragment key={prospect.id}>
                    <div
                        className={`${styles.prospectTableRow} ${!prospect.profile ? styles.noProfile : ""}`}
                        onClick={() => toggleProspectDetails(prospect.id)}
                    >
                        <div className={`${styles.prospectTableCell} ${styles.prospectTableCellRank}`}>
                            {prospect.draft_rank}
                        </div>
                        <div className={`${styles.prospectTableCell} ${styles.prospectTableCellPosRank}`}>
                            {prospect.position_rank}
                        </div>
                        <div
                            className={`${styles.prospectTableCell} ${styles.prospectTableCellName}`}
                        >
                            <span className={styles.prospectsTableName}>
                                <span className={styles.positionBadge}>
                                    {prospect.position}
                                </span>
                                {prospect.name}
                            </span>
                            <span className={styles.prospectsTableMeasurables}>
                                {renderMeasurables(prospect)}
                            </span>
                            <span className={styles.prospectsTableCollege}>
                                {prospect.college}&nbsp;&bull;&nbsp;{prospect.class}
                            </span>
                            {prospect.profile && (
                                <button
                                    className={
                                        styles.prospectTableDetailsButton
                                    }
                                    aria-label={
                                        expandedProspects.includes(prospect.id)
                                            ? `Collapse ${prospect.name} Details`
                                            : `Expand ${prospect.name} Details`
                                    }
                                >
                                    {expandedProspects.includes(prospect.id)
                                        ? "- Hide Profile"
                                        : "+ View Profile"}
                                </button>
                            )}
                        </div>
                        <div className={`${styles.prospectTableCell} ${styles.prospectTableCellGrade}`}>
                            {prospect.base_grade}
                        </div>
                        <div className={`${styles.prospectTableCell} ${styles.prospectTableCellFit}`}>
                            <span className={`${styles.fitBadge} ${styles[getTierClass(prospect.fit_tier)]}`}>
                                {prospect.fit_score}
                            </span>
                        </div>

                        <div
                            className={`${styles.prospectTableCell} ${styles.prospectTableCellProjection}`}
                        >
                            {prospect.draft_range}
                        </div>
                        <div
                            className={`${styles.prospectTableCell} ${styles.prospectTableCellComp}`}
                        >
                            {prospect.nfl_comparison}
                        </div>
                    </div>

                    <div
                        className={`${styles.prospectDetails} ${!prospect.profile && styles.noProfile
                            } ${expandedProspects.includes(prospect.id)
                                ? styles.expanded
                                : ""
                            }`}
                    >
                        <ul className={styles.prospectDetailsMobile}>
                            <li className={styles.prospectDetailsGrade}>
                                <span className='semibold'>Grade</span>
                                &nbsp;
                                {prospect.base_grade
                                    ? prospect.base_grade
                                    : "-"}
                            </li>
                            <li className={styles.prospectDetailsFit}>
                                <span className='semibold'>Fit Score</span>
                                <span className={`${styles.fitBadge} ${styles[getTierClass(prospect.fit_tier)]}`}>
                                    {prospect.fit_score ? prospect.fit_score : "-"}
                                </span>
                            </li>
                            <li className={styles.prospectDetailsProjection}>
                                <span className='semibold'>Projection</span>
                                &nbsp;
                                {prospect.draft_range
                                    ? prospect.draft_range
                                    : "-"}
                            </li>
                            <li className={styles.prospectDetailsComp}>
                                <span className='semibold'>Player Comp</span>
                                &nbsp;
                                {prospect.nfl_comparison
                                    ? prospect.nfl_comparison
                                    : "-"}
                            </li>
                        </ul>
                        {prospect.designation || prospect.injury_status ? (
                            <div className={styles.prospectDetailsAlert}>
                                {prospect.designation && (
                                    <p
                                        className={
                                            styles.prospectDetailsDesignation
                                        }
                                    >
                                        {prospect.designation
                                            ? prospect.designation
                                                .split(",")
                                                .map(
                                                    (code) =>
                                                        designationsMap.get(
                                                            code.trim()
                                                        ) || ""
                                                )
                                                .join(", ")
                                            : ""}
                                    </p>
                                )}
                                {prospect.injury_status && (
                                    <p>{prospect.injury_status}</p>
                                )}
                            </div>
                        ) : null}
                        <p
                            style={{
                                textAlign: !prospect.profile
                                    ? "center"
                                    : "left",
                            }}
                        >
                            {prospect.profile
                                ? prospect.profile
                                : "We're still evaluating this player, check back later for more details."}
                        </p>
                    </div>
                    {/* prospectsTable-details */}
                </React.Fragment>
            ))}
        </div>
    );
};

export default ProspectTable;
