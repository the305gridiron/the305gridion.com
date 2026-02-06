import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import styles from "./SidebarPlayerPanel.module.scss";

export default function SidebarPlayerPanel(props) {
    return (
        <Accordion
            className={styles.sidebarCardListItem}
            square
            expanded={props.expanded === `panel${props.id}`}
            onChange={props.handleChange(`panel${props.id}`)}
            sx={{
                backgroundColor: "inherit",
                border: 0,
                boxShadow: "none",
                color: "inherit",
                "&.Mui-expanded": { margin: 0 },
            }}
        >
            <AccordionSummary
                aria-controls={`panel${props.id}id-content`}
                id={`panel${props.id}id-header`}
                sx={{
                    minHeight: 0,
                    padding: "5px 15px",
                    "& .MuiAccordionSummary-content": {
                        alignItems: "center",
                        margin: 0,
                    },
                }}
            >
                <span className={styles.playerPosition}>{props.position}</span>{" "}
                {props.name}{" "}
                {props.trade && <SwapHorizOutlinedIcon className={styles.tradeIcon} />}
                {props.expanded === `panel${props.id}` ? (
                    <KeyboardArrowUpIcon
                        className={styles.sidebarCardListItemToggleIcon}
                    />
                ) : (
                    <KeyboardArrowDownIcon
                        className={styles.sidebarCardListItemToggleIcon}
                    />
                )}
            </AccordionSummary>

            <AccordionDetails sx={{ padding: "0 15px 15px" }}>
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
            </AccordionDetails>
        </Accordion>
    );
}
