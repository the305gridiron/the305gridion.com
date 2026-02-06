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

    return (
        <div className={styles.prospectTableContainer}>
            <div className={styles.prospectTableHeader}>
                <div
                    className={`${styles.prospectTableHeaderCell} ${styles.prospectTableCellRank}`}
                >
                    Rank
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
                        className={`${styles.prospectTableRow} ${!prospect.profile ? styles.noProfile : ""
                            }`}
                        onClick={() => toggleProspectDetails(prospect.id)}
                    >
                        <div
                            className={`${styles.prospectTableCell} ${styles.prospectTableCellRank}`}
                        >
                            {prospect.position_rank}
                        </div>
                        <div
                            className={`${styles.prospectTableCell} ${styles.prospectTableCellName}`}
                        >
                            <span className={styles.prospectsTableName}>
                                {prospect.name}
                            </span>
                            <span className={styles.prospectsTableMeasurables}>
                                <strong>Age:</strong> {prospect.age} &bull; <strong>Height:</strong> {prospect.height} &bull; <strong>Weight:</strong> {prospect.weight}
                            </span>
                            <span className={styles.prospectsTableCollege}>
                                {prospect.college} &bull; {prospect.class}
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
                        <div
                            className={`${styles.prospectTableCell} ${styles.prospectTableCellGrade}`}
                        >
                            {prospect.base_grade}
                        </div>
                        <div
                            className={`${styles.prospectTableCell} ${styles.prospectTableCellProjection}`}
                        >
                            {prospect.base_grade_description
                                .split(" - ")
                                .map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
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
                            <li className={styles.prospectDetailsHeight}>
                                <span className='semibold'>Height</span>
                                &nbsp;
                                {prospect.height ? prospect.height : "?"}
                            </li>
                            <li className={styles.prospectDetailsWeight}>
                                <span className='semibold'>Weight</span>
                                &nbsp;
                                {prospect.weight ? prospect.weight : "?"}
                            </li>
                            <li className={styles.prospectDetailsAge}>
                                <span className='semibold'>Age</span>&nbsp;
                                {!prospect.age || prospect.age === 0
                                    ? "?"
                                    : prospect.age}
                            </li>
                            <li className={styles.prospectDetailsGrade}>
                                <span className='semibold'>Grade</span>
                                &nbsp;
                                {prospect.base_grade
                                    ? prospect.base_grade
                                    : "-"}
                            </li>
                            <li className={styles.prospectDetailsProjection}>
                                <span className='semibold'>Projection</span>
                                &nbsp;
                                {prospect.base_grade_description &&
                                    prospect.base_grade_description
                                        .split(" - ")
                                        .map((line, index) => (
                                            <React.Fragment key={index}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                {!prospect.base_grade_description && "-"}
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
