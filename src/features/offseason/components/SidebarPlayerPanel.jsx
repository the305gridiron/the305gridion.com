import { useRef } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";

import styles from "./SidebarPlayerPanel.module.scss";

export default function SidebarPlayerPanel(props) {
    const contentRef = useRef(null);
    const isExpanded = props.expanded;

    return (
        <div className={styles.sidebarPlayerPanel}>
            <button
                className={styles.sidebarPlayerPanelHeader}
                onClick={props.onToggle}
            >
                <span className={styles.playerPosition}>
                    {props.position}
                </span>{" "}
                {props.name}{" "}
                {props.trade && (
                    <SwapHorizOutlinedIcon className={styles.tradeIcon} />
                )}
                {isExpanded ? (
                    <KeyboardArrowUpIcon
                        className={styles.sidebarCardListItemToggleIcon}
                    />
                ) : (
                    <KeyboardArrowDownIcon
                        className={styles.sidebarCardListItemToggleIcon}
                    />
                )}
            </button>

            <div
                ref={contentRef}
                className={styles.sidebarPlayerPanelContent}
                style={{ maxHeight: isExpanded ? contentRef.current?.scrollHeight : 0 }}

            >
                <div className={styles.sidebarPlayerPanelContentContainer}>
                    <ul className={styles.playerDetails}>
                        {props.age && (
                            <li>
                                <strong>Age:</strong> {props.age}
                            </li>
                        )}
                        {props.formerTeam && (
                            <li>
                                <strong>Former Team:</strong> {props.formerTeam}
                            </li>
                        )}
                        {props.comments && <li>{props.comments}</li>}
                        {props.profile && (
                            <li>
                                <a
                                    href={props.profile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Player Profile
                                </a>
                            </li>
                        )}
                    </ul>

                    {props.contract && (
                        <ul className={styles.contractDetails}>
                            <li className={styles.contractDetailsTitle}>Contract Details</li>
                            <li>
                                <strong>Length:</strong>{" "}
                                {props.contract.years &&
                                    `${props.contract.years} ${props.contract.years > 1 ? "years" : "year"
                                    }`}
                            </li>
                            <li>
                                <strong>Total:</strong> {props.contract.total}
                            </li>
                            {props.contract.years > 1 && props.contract.average && (
                                <li>
                                    <strong>Average:</strong> {props.contract.average}
                                </li>
                            )}
                            {props.contract.guaranteed && (
                                <li>
                                    <strong>Guaranteed:</strong> {props.contract.guaranteed}
                                </li>
                            )}
                            <li>
                                <strong>2020 Cap:</strong> {props.contract.cap}
                            </li>
                            {props.contract.out && (
                                <li>
                                    <strong>Potential Out:</strong> {props.contract.out}
                                </li>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
